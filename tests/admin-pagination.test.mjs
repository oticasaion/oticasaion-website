import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';
import { transformWithOxc } from 'vite';

const calls = [];
let authChecks = 0;
const row = { id: 'aion-1', name: 'Aion 1', material: 'Metal', gender: 'unissex', current_price: 100, pix_discount_percent: 5, is_promo: true, is_bestseller: false, images: ['https://example.com/1.webp'] };
const builder = {
  select(columns, options) { calls.push(['select', columns, options]); return this; },
  or(value) { calls.push(['or', value]); return this; },
  eq(key, value) { calls.push(['eq', key, value]); return this; },
  order(key, options) { calls.push(['order', key, options]); return this; },
  range(start, end) { calls.push(['range', start, end]); return Promise.resolve({ data: [row], count: 21, error: null }); },
};
const synthetic = values => new SyntheticModule(Object.keys(values), function() { for (const [key,value] of Object.entries(values)) this.setExport(key,value); });
const source = await transformWithOxc(await fs.readFile('src/services/productService.ts', 'utf8'), 'src/services/productService.ts');
const module = new SourceTextModule(source.code, { identifier: 'src/services/productService.ts' });
await module.link(async specifier => {
  if (specifier.endsWith('/lib/supabase')) return synthetic({ supabase: { from: table => { assert.equal(table, 'products'); return builder; } } });
  if (specifier.endsWith('/lib/adminAccess')) return synthetic({ requireAdmin: async () => { authChecks++; } });
  if (specifier.endsWith('/data/products')) return synthetic({ PRODUCTS: [] });
  if (specifier.endsWith('?raw')) return synthetic({ default: '' });
  throw new Error('Unexpected import: ' + specifier);
});
await module.evaluate();
const { fetchAdminProductPage } = module.namespace;
const result = await fetchAdminProductPage({ page: 2, pageSize: 12, query: 'Aion, 1', filter: 'promocoes', sort: 'price' });
assert.equal(authChecks, 1);
assert.deepEqual(calls.find(([name]) => name === 'range'), ['range', 12, 23]);
assert.equal(calls.find(([name]) => name === 'select')[2].count, 'exact');
assert.doesNotMatch(calls.find(([name]) => name === 'select')[1], /description|dimensions|specs/);
assert.deepEqual(calls.find(([name]) => name === 'or'), ['or', 'name.ilike.%Aion 1%,id.ilike.%Aion 1%,material.ilike.%Aion 1%']);
assert.deepEqual(calls.find(([name]) => name === 'eq'), ['eq', 'is_promo', true]);
assert.equal(result.total, 21);
assert.equal(result.items[0].image, row.images[0]);
assert.equal(result.items[0].currentPrice, 100);
console.log('PASS: catalog pages request only displayed product fields, filter on the server, and use a 12-item range.');
