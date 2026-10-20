import type { Product } from '../types';

export interface ProductDraft {
  name: string; material: string; shape: string; gender: string; rimType: string;
  description: string; originalPrice: string; currentPrice: string; pixDiscount: string;
  lensWidth: string; lensHeight: string; bridgeWidth: string; totalFront: string; templeLength: string;
  materialTemple: string; nosePads: string; springHinges: string; style: string; includedItems: string;
  colors: { name: string; hex: string }[];
  isPromo: boolean; isBestseller: boolean;
}
export const blankProductDraft = (): ProductDraft => ({
  name: '', material: '', shape: '', gender: '', rimType: '', description: '',
  originalPrice: '', currentPrice: '', pixDiscount: '', lensWidth: '', lensHeight: '',
  bridgeWidth: '', totalFront: '', templeLength: '', materialTemple: '', nosePads: '',
  springHinges: '', style: '', includedItems: '', colors: [], isPromo: false, isBestseller: false,
});
export function draftFromProduct(p: Product): ProductDraft {
  return { name: p.name, material: p.material, shape: p.shape, gender: p.gender, rimType: p.rimType,
    description: p.description, originalPrice: String(p.originalPrice), currentPrice: String(p.currentPrice),
    pixDiscount: String(p.pixDiscountPercent), lensWidth: String(p.dimensions.lensWidth),
    lensHeight: String(p.dimensions.lensHeight), bridgeWidth: String(p.dimensions.bridgeWidth),
    totalFront: String(p.dimensions.totalFront), templeLength: String(p.dimensions.templeLength),
    materialTemple: p.specs.materialTemple, nosePads: p.specs.nosePads, springHinges: p.specs.springHinges,
    style: p.specs.style, includedItems: p.includedItems.join('\n'), colors: p.colors.map(c => ({ ...c })),
    isPromo: !!p.isPromo, isBestseller: !!p.isBestseller };
}
const amount = (value: string) => Number(value.replace(',', '.'));
export interface ProductIssue { step: number; field: keyof ProductDraft | 'photos'; message: string }
export function getProductIssues(d: ProductDraft, photoCount: number): ProductIssue[] {
  const issues: ProductIssue[] = [];
  const required = (key: keyof ProductDraft, label: string, step: number) => {
    if (!String(d[key]).trim()) issues.push({ step, field: key, message: 'Informe ' + label + '.' });
  };
  required('name', 'o nome do produto', 1);
  required('material', 'o material da frente', 1);
  if (!['quadrado','redondo','gatinho','retangular','aviador','oval'].includes(d.shape)) issues.push({ step: 1, field: 'shape', message: 'Selecione o formato da armação.' });
  if (!['unissex','feminino','masculino'].includes(d.gender)) issues.push({ step: 1, field: 'gender', message: 'Selecione o público do produto.' });
  if (!['Aro Fechado','Meio Aro','Sem Aro (Balgriff)'].includes(d.rimType)) issues.push({ step: 1, field: 'rimType', message: 'Selecione o tipo de aro.' });
  required('description', 'a descrição do produto', 1);
  if (photoCount < 1 || photoCount > 8) issues.push({ step: 2, field: 'photos', message: 'Adicione de 1 a 8 fotos e escolha a foto de capa.' });
  if (d.colors.some(c => !c.name.trim() || !/^#[0-9a-f]{6}$/i.test(c.hex))) issues.push({ step: 2, field: 'colors', message: 'Preencha o nome e a cor de cada opção adicionada, ou remova a opção vazia.' });
  for (const [key,label] of [['lensWidth','a largura da lente'],['lensHeight','a altura da lente'],['bridgeWidth','a largura da ponte'],['totalFront','a largura frontal total'],['templeLength','o comprimento da haste']] as const) {
    if (!d[key].trim() || !Number.isFinite(amount(d[key])) || amount(d[key]) <= 0) issues.push({ step: 3, field: key, message: 'Informe ' + label + ' em milímetros, com valor maior que zero.' });
  }
  if (!d.currentPrice.trim() || !Number.isFinite(amount(d.currentPrice)) || amount(d.currentPrice) <= 0) issues.push({ step: 3, field: 'currentPrice', message: 'Informe um preço de venda maior que zero.' });
  if (d.originalPrice.trim() && (!Number.isFinite(amount(d.originalPrice)) || amount(d.originalPrice) < amount(d.currentPrice))) issues.push({ step: 3, field: 'originalPrice', message: 'O preço anterior deve ser igual ou maior que o preço de venda.' });
  if (!Number.isFinite(amount(d.pixDiscount)) || amount(d.pixDiscount) < 0 || amount(d.pixDiscount) > 100) issues.push({ step: 3, field: 'pixDiscount', message: 'O desconto Pix deve ficar entre 0 e 100%.' });
  return issues;
}
export function validateProductDraft(d: ProductDraft, photoCount: number): ProductIssue | null {
  return getProductIssues(d, photoCount)[0] || null;
}
export function buildDraftProduct(d: ProductDraft, images: string[], id: string, existing?: Product | null): Product {
  const number = (value: string) => Number.isFinite(amount(value)) ? amount(value) : 0;
  return { id, name: d.name.trim(), material: d.material.trim(), shape: d.shape as Product['shape'],
    gender: d.gender as Product['gender'], rimType: d.rimType as Product['rimType'],
    description: d.description.trim(), currentPrice: number(d.currentPrice),
    originalPrice: d.originalPrice.trim() ? number(d.originalPrice) : number(d.currentPrice),
    pixDiscountPercent: number(d.pixDiscount), images, colors: d.colors.map(c => ({ ...c, name: c.name.trim() })),
    clientPhotos: existing?.clientPhotos || [], rating: existing?.rating ?? 0, reviewsCount: existing?.reviewsCount ?? 0,
    isPromo: d.isPromo, isBestseller: d.isBestseller,
    dimensions: { lensWidth: number(d.lensWidth), lensHeight: number(d.lensHeight), bridgeWidth: number(d.bridgeWidth), totalFront: number(d.totalFront), templeLength: number(d.templeLength) },
    specs: { materialFront: d.material.trim(), materialTemple: d.materialTemple.trim(), rimType: d.rimType,
      nosePads: d.nosePads, springHinges: d.springHinges, style: d.style.trim() },
    includedItems: d.includedItems.split('\n').map(v => v.trim()).filter(Boolean) };
}
