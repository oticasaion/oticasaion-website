import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';
import { transformWithOxc } from 'vite';

let authorized = false;
let uploadError = null;
const uploaded = [];
const removed = [];
const supabase = { storage: { from: bucket => {
  assert.equal(bucket, 'product-images');
  return {
    upload: async (path, file, options) => { uploaded.push({path,file,options}); return { error: uploadError }; },
    getPublicUrl: path => ({ data: { publicUrl: 'https://example.test/' + path } }),
    remove: async paths => { removed.push(...paths); return { error: null }; },
  };
} } };
const synthetic = values => new SyntheticModule(Object.keys(values), function() { for (const [key,value] of Object.entries(values)) this.setExport(key,value); });
async function load(path) {
  const { code } = await transformWithOxc(await fs.readFile(path,'utf8'),path);
  const module = new SourceTextModule(code);
  await module.link(specifier => {
    if (specifier.endsWith('/lib/supabase')) return synthetic({ supabase });
    if (specifier.endsWith('/lib/adminAccess')) return synthetic({ requireAdmin: async () => { if (!authorized) throw new Error('Unauthorized'); return {id:'admin-user'}; } });
    if (specifier === './bulkProductImport') return load('src/lib/bulkProductImport.ts').then(namespace => synthetic({ requiredImportIssues: namespace.requiredImportIssues }));
    throw new Error('Unexpected import: ' + specifier);
  });
  await module.evaluate();
  return module.namespace;
}
const {blankProductDraft,validateProductDraft,buildDraftProduct,draftFromProduct} = await load('src/lib/productDraft.ts');
const draft = blankProductDraft();
assert.equal(draft.lensesEnabled,true);
for (const [key,value] of Object.entries(draft)) if (key !== 'lensesEnabled') assert.ok(value === '' || value === false || (Array.isArray(value) && value.length === 0));
assert.equal(validateProductDraft(draft,0).step,1);
Object.assign(draft,{ name:'Modelo real',material:'Metal',shape:'oval',gender:'unissex',rimType:'Meio Aro',description:'Descrição real' });
assert.equal(validateProductDraft(draft,0).step,2);
assert.equal(validateProductDraft(draft,1).step,3);
Object.assign(draft,{currentPrice:'129,90',lensWidth:'51',lensHeight:'38',bridgeWidth:'18',totalFront:'135',templeLength:'140'});
assert.equal(validateProductDraft(draft,1),null);
draft.pixDiscount = '101';
assert.equal(validateProductDraft(draft,1).step,3);
draft.pixDiscount = '';
draft.originalPrice = '100';
assert.equal(validateProductDraft(draft,1).step,3);
draft.originalPrice = '';
const product = buildDraftProduct(draft,['https://example.test/photo.webp'],'test');
assert.equal(product.currentPrice,129.9);
assert.equal(product.originalPrice,129.9);
assert.equal(product.pixDiscountPercent,0);
assert.equal(product.rating,0);
assert.equal(product.reviewsCount,0);
assert.deepEqual(product.includedItems,[]);
assert.equal(product.specs.nosePads,'');
assert.equal(draftFromProduct(product).lensHeight,'38');
assert.equal(product.lensesEnabled,true);
assert.equal(buildDraftProduct({...draft,lensesEnabled:false},product.images,'disabled').lensesEnabled,false);
assert.equal(buildDraftProduct(draft,product.images,'test',product).dimensions.totalFront,135);
console.log('PASS: new products are blank, required data and numeric ranges are validated, no fabricated ratings/specs/items.');

const {exportProductsCsv,importProductsCsv} = await load('src/lib/productSpreadsheet.ts');
const exported = exportProductsCsv([{...product,name:'Modelo "A"',description:'Linha 1\nLinha 2',images:['https://example.test/photo.webp']}]);
const [imported] = importProductsCsv(exported);
assert.equal(imported.name,'Modelo "A"');
assert.equal(imported.description,'Linha 1\nLinha 2');
assert.deepEqual(imported.images,['https://example.test/photo.webp']);
assert.equal(imported.dimensions.lensWidth,51);
assert.equal(imported.lensesEnabled,true);
const disabledCsv=exportProductsCsv([{...product,lensesEnabled:false}]);
assert.equal(importProductsCsv(disabledCsv)[0].lensesEnabled,false);
const legacyCsv=exported.split('\r\n').map(line=>line.replace(/;"(?:lentes_ativas|sim)"$/, '')).join('\r\n');
assert.equal(importProductsCsv(legacyCsv)[0].lensesEnabled,undefined);
assert.throws(()=>importProductsCsv(disabledCsv.replace(/;"não"\r\n$/, ';"talvez"\r\n')),/lentes_ativas/);
assert.throws(() => importProductsCsv(exported.replace('https://example.test/photo.webp','javascript:alert(1)')),/links HTTPS/);
console.log('PASS: CSV export/import preserves product fields and rejects unsafe image URLs.');

const {parseImportEntries,fillFromExisting,importIssues,requiredImportIssues,productFromImport} = await load('src/lib/bulkProductImport.ts');
const imageUrl = 'https://vdptrgqxrwugrtienktg.supabase.co/storage/v1/object/public/product-images/test.webp';
const [prepared] = parseImportEntries([{reference:'modelo-01',name:'Modelo novo',description:'Descrição do arquivo',shape:'redondo',gender:null,rim_type:'Aro Fechado',images:[imageUrl],required_to_confirm:{material_front:null,current_price:null,lens_width_mm:null,lens_height_mm:null,bridge_width_mm:null,total_front_mm:null,temple_length_mm:null}}]);
assert.equal(requiredImportIssues(prepared).length,8);
const existing = {...product,id:'aion-import-modelo-01',gender:'feminino',material:'Metal'};
const filled = fillFromExisting(prepared,existing);
assert.equal(filled.name,'Modelo novo');
assert.equal(filled.gender,'feminino');
assert.equal(filled.required_to_confirm.material_front,'Metal');
assert.equal(filled.required_to_confirm.current_price,129.9);
assert.deepEqual(filled.images,[imageUrl]);
assert.deepEqual(importIssues(filled),[]);
assert.equal(productFromImport(filled).images[0],imageUrl);
assert.ok(importIssues({...filled,images:[]}).includes('fotos públicas (1 a 8)'));
const {exportPreparedCsv,exportImportAuditCsv} = await load('src/lib/productSpreadsheet.ts');
assert.equal(importProductsCsv(exportPreparedCsv([filled]))[0].images[0],imageUrl);
assert.match(exportImportAuditCsv([prepared]),/material da frente \| preço/);
console.log('PASS: JSON keeps supplied content, fills missing fields from matching products and validates edited image URLs.');

const {validateImageFile,uploadProductImage,removeUnpublishedImages,MAX_IMAGE_BYTES} = await load('src/services/productImages.ts');
assert.ok(validateImageFile({type:'image/svg+xml',size:100}));
assert.ok(validateImageFile({type:'image/jpeg',size:MAX_IMAGE_BYTES + 1}));
assert.ok(validateImageFile({type:'image/png',size:0}));
assert.equal(validateImageFile({type:'image/webp',size:1024}),null);
const image = new File(['image bytes'],'photo.webp',{type:'image/webp'});
await assert.rejects(uploadProductImage(image,'product'));
assert.equal(uploaded.length,0);
authorized = true;
await assert.rejects(uploadProductImage(new File(['x'],'file.svg',{type:'image/svg+xml'}),'product'));
assert.equal(uploaded.length,0);
const result = await uploadProductImage(image,'product');
assert.match(result.path,/^admin-user\/product\/.+\.webp$/);
assert.equal(uploaded[0].options.upsert,false);
assert.ok(result.url.startsWith('https://example.test/'));
uploadError = {message:'denied'};
await assert.rejects(uploadProductImage(image,'product'),/Não foi possível enviar/);
await removeUnpublishedImages([result.path]);
assert.deepEqual(removed,[result.path]);
console.log('PASS: file type/size limits, authenticated upload, unique file paths, error reporting and unpublished-image cleanup.');


const { prepareImage, WEBP_TARGET_BYTES, MAX_IMAGE_DIMENSION } = await load('src/services/productImages.ts');
let encodes = 0;
let closed = 0;
let dimensions = [];
let outputType = 'image/webp';
globalThis.createImageBitmap = async () => ({ width: 4000, height: 3000, close() { closed++; } });
globalThis.document = { createElement: () => {
  const canvas = { width: 0, height: 0,
    getContext: () => ({ drawImage() { dimensions.push([canvas.width, canvas.height]); } }),
    toBlob(callback, type, quality) {
      assert.equal(type, 'image/webp');
      assert.ok(quality >= .64 && quality <= .84);
      encodes++;
      callback(new Blob([new Uint8Array(encodes < 4 ? 700 * 1024 : 180 * 1024)], { type: outputType }));
    },
  };
  return canvas;
} };
const optimized = await prepareImage(new File([new Uint8Array(2 * 1024 * 1024)], 'original.jpg', {type:'image/jpeg'}));
assert.equal(optimized.type,'image/webp');
assert.equal(optimized.name,'original.webp');
assert.ok(optimized.size <= WEBP_TARGET_BYTES);
assert.ok(encodes > 1);
assert.ok(dimensions.every(([width,height]) => width <= MAX_IMAGE_DIMENSION && height <= MAX_IMAGE_DIMENSION));
assert.equal(closed,1);
const beforeUploads = uploaded.length;
outputType = 'image/png';
await assert.rejects(prepareImage(new File(['x'],'photo.png',{type:'image/png'})),/não suporta a conversão WebP/);
assert.equal(closed,2);
outputType = 'image/webp';
globalThis.createImageBitmap = async () => ({ width: 100, height: 100, close() { closed++; } });
const smallWebp = new File(['RIFFxxxxWEBPsmall'], 'small.webp',{type:'image/webp'});
assert.equal(await prepareImage(smallWebp),smallWebp);
assert.equal(uploaded.length,beforeUploads);
console.log('PASS: browser-side WebP compression retries, dimension limit, format verification, bitmap cleanup and preservation of smaller existing WebP.');
