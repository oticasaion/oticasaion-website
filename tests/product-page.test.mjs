import assert from 'node:assert/strict';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { blankProductDraft, buildDraftProduct } = await server.ssrLoadModule('/src/lib/productDraft.ts');
  const { currency, productPricing, productInquiry, normalizeCep, formatCep } = await server.ssrLoadModule('/src/lib/productPresentation.ts');
  const { ProductDetailView } = await server.ssrLoadModule('/src/components/ProductDetailView.tsx');
  const { LensSelectorModal } = await server.ssrLoadModule('/src/components/LensSelectorModal.tsx');
  const product = buildDraftProduct({ ...blankProductDraft(), name: 'Modelo Teste', material: 'Metal', shape: 'oval', gender: 'unissex', rimType: 'Meio Aro',
    description: 'Descrição real do produto', currentPrice: '100', pixDiscount: '5', lensWidth: '52', lensHeight: '40', bridgeWidth: '18', totalFront: '136', templeLength: '140',
    colors: [{ name: 'Preto', hex: '#000000' },{ name: 'Azul', hex: '#0000ff' }] }, ['/photo-1.webp','/photo-2.webp'], 'product-test');
  const price = productPricing(product);
  assert.equal(price.pix,95);
  assert.equal(productPricing(product, [{id:'only-frame',price:0},{id:'custom',price:100}]).completePix,190);
  assert.equal(price.previous,null);
  assert.ok(price.completePix > price.pix);
  assert.equal(productPricing({...product,pixDiscountPercent:0}).pix,100);
  assert.equal(productPricing({...product,pixDiscountPercent:150}).pix,0);
  assert.equal(productPricing({...product,pixDiscountPercent:NaN}).pix,100);
  assert.equal(productPricing({...product,originalPrice:120}).previous,120);
  assert.equal(normalizeCep('01310-100'), '01310100');
  assert.equal(formatCep('01310100'),'01310-100');
  const message = productInquiry(product,1,'shipping','01310100');
  assert.ok(message.includes('Azul'));
  assert.ok(message.includes('01310-100'));
  assert.ok(!message.includes('14,90'));
  const noColor = productInquiry({...product,colors:[]},0,'frame');
  assert.ok(!noColor.includes('undefined'));
  assert.ok(noColor.includes(currency(95)));

  const noop=()=>{};
  const props={product,allProducts:[product],onBackToCatalog:noop,onSelectProduct:noop,onOpenLensModal:noop,onWhatsAppClick:noop};
  const html = renderToStaticMarkup(React.createElement(ProductDetailView, props));
  assert.ok(html.includes('Somente a armação'));
  assert.ok(html.includes(currency(95)));
  assert.ok(html.includes(currency(price.completePix)));
  assert.ok(html.includes('Novo no catálogo'));
  assert.ok(html.includes('Descrição real do produto'));
  assert.ok(html.includes('Ampliar foto de Modelo Teste'));
  assert.ok(html.includes('Ver foto 2'));
  assert.ok(html.includes('postal-code'));
  assert.ok(!html.includes('Frete Econômico:'));
  assert.ok(!html.includes('12x de'));
  const disabledHtml = renderToStaticMarkup(React.createElement(ProductDetailView, { ...props, product: { ...product, lensesEnabled:false } }));
  assert.ok(!disabledHtml.includes('Escolher lentes'));
  assert.ok(!disabledHtml.includes('Armação + lentes'));
  assert.ok(disabledHtml.includes('Pedir armação'));
  assert.ok(disabledHtml.includes('Precisa de ajuda com o modelo?'));
  const emptyHtml = renderToStaticMarkup(React.createElement(ProductDetailView, { ...props, product:{...product,images:[],colors:[],includedItems:[]} }));
  assert.ok(emptyHtml.includes('Fotos em breve'));
  assert.ok(!emptyHtml.includes('undefined'));
  const modalHtml = renderToStaticMarkup(React.createElement(LensSelectorModal, { product, initialColorIndex:1, isOpen:true, analyticsEnabled:false, onClose:noop, onConfirmWhatsApp:noop }));
  assert.match(modalHtml, /aria-pressed="true"[^>]*>[\s\S]*?Azul/);
  assert.ok(modalHtml.includes('<dialog'));
  assert.ok(modalHtml.includes('Carregando preços das lentes'));
  assert.ok(!modalHtml.includes('Total estimado:'));
  console.log('PASS: product prices, complete-lens estimate, CEP inquiry, empty content, real gallery controls and selected color in lens dialog.');
} finally { await server.close(); }
