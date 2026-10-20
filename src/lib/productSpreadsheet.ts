import type { Product } from '../types';
import type { ImportEntry } from './bulkProductImport';

export const columns = ['id','nome','descricao','material_frente','formato','publico','tipo_aro','preco','preco_anterior','desconto_pix','largura_lente_mm','altura_lente_mm','ponte_mm','largura_frontal_mm','haste_mm','material_hastes','plaquetas','molas_hastes','estilo','cores','itens_inclusos','imagens','promocao','mais_vendido'] as const;
type Column = typeof columns[number];
type Row = Record<Column,string>;
const clean = (value: unknown) => String(value ?? '');
const num = (value: string) => Number(value.replace(',', '.'));
const yes = (value: string) => ['sim','true','1'].includes(value.trim().toLowerCase());
const safeCell = (value: string) => /^[=+\-@]/.test(value) ? "'" + value : value;
const quote = (value: string) => '"' + safeCell(value).replace(/"/g,'""') + '"';

export function exportProductsCsv(products: Product[], siteBase?: string): string {
  const rows = products.map(p => [p.id,p.name,p.description,p.material,p.shape,p.gender,p.rimType,p.currentPrice,p.originalPrice,p.pixDiscountPercent,p.dimensions.lensWidth,p.dimensions.lensHeight,p.dimensions.bridgeWidth,p.dimensions.totalFront,p.dimensions.templeLength,p.specs.materialTemple,p.specs.nosePads,p.specs.springHinges,p.specs.style,p.colors.map(c => `${c.name}:${c.hex}`).join('|'),p.includedItems.join('|'),p.images.map(image => siteBase ? new URL(image,siteBase).href : image).join('|'),p.isPromo?'sim':'não',p.isBestseller?'sim':'não'].map(clean));
  return '\ufeff' + [columns.map(quote).join(';'),...rows.map(row => row.map(quote).join(';'))].join('\r\n') + '\r\n';
}

export function exportPreparedCsv(entries: ImportEntry[]): string {
  const rows=entries.map(e=>[ `aion-import-${e.reference}`,e.name,e.description,e.required_to_confirm.material_front||'',e.shape||'',e.gender||'',e.rim_type,e.required_to_confirm.current_price??'',e.optional_to_confirm?.original_price??'',e.optional_to_confirm?.pix_discount_percent??'',e.required_to_confirm.lens_width_mm??'',e.required_to_confirm.lens_height_mm??'',e.required_to_confirm.bridge_width_mm??'',e.required_to_confirm.total_front_mm??'',e.required_to_confirm.temple_length_mm??'',e.optional_to_confirm?.material_temple||'',e.optional_to_confirm?.nose_pads||'',e.optional_to_confirm?.spring_hinges||'','',e.optional_to_confirm?.colors?.map(c=>`${c.name}:${c.hex}`).join('|')||'',e.optional_to_confirm?.included_items?.join('|')||'',e.images.join('|'),'não','não'].map(clean));
  return '\ufeff'+[columns.map(quote).join(';'),...rows.map(row=>row.map(quote).join(';'))].join('\r\n')+'\r\n';
}

function parseDelimited(text: string): string[][] {
  const input = text.replace(/^\ufeff/,'');
  const delimiter = input.slice(0,input.indexOf('\n')).includes(';') ? ';' : ',';
  const rows: string[][] = []; let row: string[] = []; let cell = ''; let quoted = false;
  for (let i=0;i<input.length;i++) {
    const c=input[i];
    if (c==='"') { if (quoted && input[i+1]==='"') {cell+='"';i++;} else quoted=!quoted; }
    else if (c===delimiter && !quoted) {row.push(cell);cell='';}
    else if ((c==='\n' || c==='\r') && !quoted) { if(c==='\r' && input[i+1]==='\n')i++; row.push(cell); if(row.some(v=>v!==''))rows.push(row); row=[];cell=''; }
    else cell+=c;
  }
  if (quoted) throw new Error('Planilha CSV com aspas não fechadas.');
  if (cell || row.length) {row.push(cell);rows.push(row);}
  return rows;
}

export function importProductsCsv(text: string): Product[] {
  const rows=parseDelimited(text);
  if (!rows.length || columns.some((column,index)=>rows[0][index]!==column) || rows[0].length!==columns.length) throw new Error('Cabeçalhos diferentes do modelo exportado pelo painel.');
  const ids=new Set<string>();
  return rows.slice(1).map((cells,index) => {
    if(cells.length!==columns.length) throw new Error(`Linha ${index+2}: número de colunas incorreto.`);
    const r=Object.fromEntries(columns.map((key,i)=>[key,cells[i].replace(/^'(?=[=+\-@])/,'')])) as Row;
    const line=index+2;
    if(!/^[a-zA-Z0-9_-]+$/.test(r.id) || ids.has(r.id)) throw new Error(`Linha ${line}: ID inválido ou repetido.`);
    ids.add(r.id);
    if(!r.nome.trim() || !r.descricao.trim() || !r.material_frente.trim()) throw new Error(`Linha ${line}: nome, descrição e material são obrigatórios.`);
    if(!['quadrado','redondo','gatinho','retangular','aviador','oval'].includes(r.formato) || !['feminino','masculino','unissex'].includes(r.publico) || !['Aro Fechado','Meio Aro','Sem Aro (Balgriff)'].includes(r.tipo_aro)) throw new Error(`Linha ${line}: formato, público ou tipo de aro inválido.`);
    const images=r.imagens.split('|').map(v=>v.trim()).filter(Boolean);
    if(images.length<1 || images.length>8 || images.some(url=>{try{const parsed=new URL(url);return parsed.protocol!=='https:' || !!parsed.username || !!parsed.password}catch{return true}})) throw new Error(`Linha ${line}: informe de 1 a 8 links HTTPS públicos de imagens.`);
    const numeric=['preco','largura_lente_mm','altura_lente_mm','ponte_mm','largura_frontal_mm','haste_mm'] as const;
    if(numeric.some(key=>!Number.isFinite(num(r[key])) || num(r[key])<=0)) throw new Error(`Linha ${line}: preço e cinco medidas devem ser maiores que zero.`);
    const previous=r.preco_anterior ? num(r.preco_anterior) : num(r.preco);
    const discount=r.desconto_pix ? num(r.desconto_pix) : 0;
    if(!Number.isFinite(previous) || previous<num(r.preco) || !Number.isFinite(discount) || discount<0 || discount>100) throw new Error(`Linha ${line}: preço anterior ou desconto Pix inválido.`);
    const colors=r.cores ? r.cores.split('|').map(value=>{const at=value.lastIndexOf(':');return {name:value.slice(0,at).trim(),hex:value.slice(at+1).trim()};}) : [];
    if(colors.some(c=>!c.name || !/^#[0-9a-f]{6}$/i.test(c.hex))) throw new Error(`Linha ${line}: use cores no formato Nome:#aabbcc, separadas por |.`);
    return { id:r.id,name:r.nome,description:r.descricao,material:r.material_frente,shape:r.formato as Product['shape'],gender:r.publico as Product['gender'],rimType:r.tipo_aro as Product['rimType'],currentPrice:num(r.preco),originalPrice:previous,pixDiscountPercent:discount,rating:0,reviewsCount:0,isPromo:yes(r.promocao),isBestseller:yes(r.mais_vendido),images,clientPhotos:[],colors,includedItems:r.itens_inclusos?r.itens_inclusos.split('|').map(v=>v.trim()).filter(Boolean):[],dimensions:{lensWidth:num(r.largura_lente_mm),lensHeight:num(r.altura_lente_mm),bridgeWidth:num(r.ponte_mm),totalFront:num(r.largura_frontal_mm),templeLength:num(r.haste_mm)},specs:{materialFront:r.material_frente,materialTemple:r.material_hastes,rimType:r.tipo_aro,nosePads:r.plaquetas,springHinges:r.molas_hastes,style:r.estilo} };
  });
}
