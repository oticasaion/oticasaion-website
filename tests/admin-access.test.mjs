import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';
import { transformWithOxc } from 'vite';

let user = null;
let remoteError = null;
let rows = [{ id: 'test' }];
let writes = 0;
const cache = new Map();
globalThis.localStorage = { getItem: key => cache.get(key) ?? null, setItem: (key, value) => cache.set(key, value) };
const supabase = {
  auth: { getUser: async () => ({ data: { user }, error: null }) },
  from: () => ({
    upsert: () => { writes++; return { select: () => ({ single: async () => ({ data: remoteError ? null : rows[0], error: remoteError }) }) }; },
    delete: () => { writes++; return { eq: () => ({ select: async () => ({ data: rows, error: remoteError }) }) }; },
    select: () => ({ order: async () => ({ data: rows, error: remoteError }) }),
  }),
};
const synthetic = values => new SyntheticModule(Object.keys(values), function() { for (const [key,value] of Object.entries(values)) this.setExport(key,value); });
const modules = new Map();
async function load(path) {
  if (modules.has(path)) return modules.get(path);
  const result = await transformWithOxc(await fs.readFile(path, 'utf8'), path);
  const module = new SourceTextModule(result.code, { identifier: path });
  modules.set(path, module);
  await module.link(async specifier => {
    if (specifier.endsWith('/lib/supabase') || specifier === './supabase') return synthetic({ supabase });
    if (specifier.endsWith('/lib/adminAccess')) return load('src/lib/adminAccess.ts');
    if (specifier.endsWith('/data/products')) return synthetic({ PRODUCTS: [] });
    if (specifier.endsWith('?raw')) return synthetic({ default: await fs.readFile('docs/admin-access.sql','utf8') });
    throw new Error('Unexpected import: ' + specifier);
  });
  await module.evaluate();
  return module;
}

const { getPage, pageHashes } = (await load('src/lib/navigation.ts')).namespace;
for (const [page,hash] of Object.entries(pageHashes)) assert.equal(getPage(hash), page);
for (const hash of ['#admin', '#/admin/login', '#/admin/produtos', '#/admin/produtos/test/editar', '#/admin/acesso']) assert.equal(getPage(hash), 'admin');
for (const hash of ['#produto?id=test', '#/produto/test', '#/produto?id=test']) assert.equal(getPage(hash), 'product-detail');
assert.equal(getPage('#como-funciona'), 'how-it-works');
assert.equal(getPage('#faq'), 'faq');
assert.equal(getPage('#/politicas/trocas'), 'terms-policy');
console.log('PASS: public and administrative routes, legacy links and policy subpages.');

const { isAdmin, requireAdmin } = (await load('src/lib/adminAccess.ts')).namespace;
assert.equal(isAdmin(null), false);
assert.equal(isAdmin({ app_metadata: {}, user_metadata: { role: 'admin' } }), false);
assert.equal(isAdmin({ is_anonymous: true, app_metadata: { role: 'admin' } }), false);
assert.equal(isAdmin({ app_metadata: { role: 'admin' } }), true);
await assert.rejects(requireAdmin());
console.log('PASS: anonymous users and user-editable admin claims cannot authorize access.');

const { saveProduct, deleteProduct, fetchProducts } = (await load('src/services/productService.ts')).namespace;
const product = { id: 'test', name: 'Test', material: 'Metal', currentPrice: 100, images: [], colors: [], dimensions: {}, specs: {}, includedItems: [] };
let result = await saveProduct(product);
assert.equal(result.success, false);
assert.equal(writes, 0);
assert.equal(cache.size, 0);
assert.equal((await deleteProduct('test')).success, false);
assert.equal(writes, 0);
user = { id: 'admin', app_metadata: { role: 'admin' } };
remoteError = { message: 'Permission denied' };
assert.equal((await saveProduct(product)).success, false);
assert.equal((await deleteProduct('test')).success, false);
assert.equal(cache.size, 0);
remoteError = null;
assert.equal((await saveProduct(product)).success, true);
assert.equal(JSON.parse(cache.get('oticas_aion_products_v2'))[0].id, 'test');
rows = [];
assert.equal((await deleteProduct('test')).success, false);
assert.equal(JSON.parse(cache.get('oticas_aion_products_v2')).length, 1);
rows = [{id:'test'}];
assert.equal((await deleteProduct('test')).success, true);
assert.deepEqual(JSON.parse(cache.get('oticas_aion_products_v2')), []);
rows = [];
assert.deepEqual(await fetchProducts(), { products: [], source: 'supabase' });
console.log('PASS: denied/failed writes leave cache intact, zero-row deletion fails, confirmed deletion and empty catalog persist.');

const loginSources = await Promise.all(['src/components/admin/AdminLoginView.tsx', 'src/components/admin/AdminAuthModal.tsx'].map(path => fs.readFile(path, 'utf8')));
for (const source of loginSources) assert.doesNotMatch(source, /signUp|isRegisterMode/);
console.log('PASS: no public signup flow in either administrative entry point.');
console.log('Remote Supabase configuration and RLS require separate hosted verification.');
