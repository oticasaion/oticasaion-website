import type { Product } from '../types';

export interface ImportEntry {
  reference: string;
  name: string;
  description: string;
  shape: Product['shape'] | null;
  gender: Product['gender'] | null;
  rim_type: Product['rimType'];
  images: string[];
  required_to_confirm: {
    material_front: string | null;
    current_price: number | null;
    lens_width_mm: number | null;
    lens_height_mm: number | null;
    bridge_width_mm: number | null;
    total_front_mm: number | null;
    temple_length_mm: number | null;
  };
  optional_to_confirm?: {
    material_temple?: string | null; nose_pads?: string | null; spring_hinges?: string | null;
    colors?: { name: string; hex: string }[]; included_items?: string[];
    original_price?: number | null; pix_discount_percent?: number | null;
  };
}

const allowedShapes = ['quadrado','redondo','gatinho','retangular','aviador','oval'];
const allowedGenders = ['unissex','masculino','feminino'];
const allowedRims = ['Aro Fechado','Meio Aro','Sem Aro (Balgriff)'];
const imagePrefix = 'https://vdptrgqxrwugrtienktg.supabase.co/storage/v1/object/public/product-images/';
const positive = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value > 0;

export function parseImportEntries(raw: unknown): ImportEntry[] {
  if (!Array.isArray(raw) || !raw.length) throw new Error('O arquivo deve conter uma lista de produtos.');
  const refs = new Set<string>();
  return raw.map((value, index) => {
    if (!value || typeof value !== 'object') throw new Error(`Registro ${index + 1} inválido.`);
    const entry = value as ImportEntry;
    if (!/^[a-z0-9-]+$/.test(entry.reference || '') || refs.has(entry.reference)) throw new Error(`Referência inválida ou repetida no registro ${index + 1}.`);
    refs.add(entry.reference);
    if (!Array.isArray(entry.images) || entry.images.length < 1 || entry.images.length > 8 || entry.images.some(url => typeof url !== 'string' || !url.startsWith(imagePrefix))) throw new Error(`${entry.reference}: informe de 1 a 8 URLs do bucket product-images deste projeto.`);
    if (!entry.required_to_confirm || typeof entry.required_to_confirm !== 'object') throw new Error(`${entry.reference}: campos obrigatórios ausentes.`);
    return entry;
  });
}

export function fillFromExisting(entry: ImportEntry, product?: Product): ImportEntry {
  if (!product) return entry;
  const data = entry.required_to_confirm;
  const optional = entry.optional_to_confirm || {};
  return {
    ...entry,
    name: entry.name || product.name,
    description: entry.description || product.description,
    shape: entry.shape || product.shape,
    gender: entry.gender || product.gender,
    rim_type: entry.rim_type || product.rimType,
    images: entry.images.length ? entry.images : product.images,
    required_to_confirm: {
      material_front: data.material_front || product.material,
      current_price: data.current_price ?? product.currentPrice,
      lens_width_mm: data.lens_width_mm ?? product.dimensions.lensWidth,
      lens_height_mm: data.lens_height_mm ?? product.dimensions.lensHeight,
      bridge_width_mm: data.bridge_width_mm ?? product.dimensions.bridgeWidth,
      total_front_mm: data.total_front_mm ?? product.dimensions.totalFront,
      temple_length_mm: data.temple_length_mm ?? product.dimensions.templeLength,
    },
    optional_to_confirm: {
      ...optional,
      material_temple: optional.material_temple ?? product.specs.materialTemple,
      nose_pads: optional.nose_pads ?? product.specs.nosePads,
      spring_hinges: optional.spring_hinges ?? product.specs.springHinges,
      colors: optional.colors?.length ? optional.colors : product.colors,
      included_items: optional.included_items?.length ? optional.included_items : product.includedItems,
      original_price: optional.original_price ?? product.originalPrice,
      pix_discount_percent: optional.pix_discount_percent ?? product.pixDiscountPercent,
    },
  };
}

export function requiredImportIssues(entry: ImportEntry): string[] {
  const data = entry.required_to_confirm;
  const issues: string[] = [];
  if (!entry.name?.trim()) issues.push('nome');
  if (!entry.description?.trim()) issues.push('descrição');
  if (!allowedShapes.includes(entry.shape || '')) issues.push('formato');
  if (!allowedGenders.includes(entry.gender || '')) issues.push('público');
  if (!allowedRims.includes(entry.rim_type)) issues.push('tipo de aro');
  if (!Array.isArray(entry.images) || entry.images.length < 1 || entry.images.length > 8 || entry.images.some(url => typeof url !== 'string' || !url.startsWith(imagePrefix))) issues.push('fotos públicas (1 a 8)');
  if (!data.material_front?.trim()) issues.push('material da frente');
  if (!positive(data.current_price)) issues.push('preço');
  for (const [key,label] of [['lens_width_mm','largura da lente'],['lens_height_mm','altura da lente'],['bridge_width_mm','ponte'],['total_front_mm','largura frontal'],['temple_length_mm','haste']] as const) if (!positive(data[key])) issues.push(label);
  return issues;
}

export function importIssues(entry: ImportEntry): string[] {
  const issues = requiredImportIssues(entry);
  const data = entry.required_to_confirm;
  const opt = entry.optional_to_confirm;
  if (opt?.original_price != null && (!positive(opt.original_price) || opt.original_price < (data.current_price || 0))) issues.push('preço anterior');
  if (opt?.pix_discount_percent != null && (!Number.isFinite(opt.pix_discount_percent) || opt.pix_discount_percent < 0 || opt.pix_discount_percent > 100)) issues.push('desconto Pix');
  if (opt?.colors?.some(color => !color.name?.trim() || !/^#[0-9a-f]{6}$/i.test(color.hex))) issues.push('cores');
  return issues;
}

export function productFromImport(entry: ImportEntry): Product {
  const issues = importIssues(entry);
  if (issues.length) throw new Error(`${entry.reference}: faltam ${issues.join(', ')}.`);
  const data = entry.required_to_confirm;
  const opt = entry.optional_to_confirm || {};
  return {
    id: `aion-import-${entry.reference}`, name: entry.name.trim(), description: entry.description.trim(),
    material: data.material_front!.trim(), shape: entry.shape!, gender: entry.gender!, rimType: entry.rim_type,
    currentPrice: data.current_price!, originalPrice: opt.original_price ?? data.current_price!,
    pixDiscountPercent: opt.pix_discount_percent ?? 0, rating: 0, reviewsCount: 0,
    isBestseller: false, isPromo: false, images: entry.images, clientPhotos: [],
    colors: opt.colors || [], includedItems: opt.included_items || [],
    dimensions: { lensWidth: data.lens_width_mm!, lensHeight: data.lens_height_mm!, bridgeWidth: data.bridge_width_mm!, totalFront: data.total_front_mm!, templeLength: data.temple_length_mm! },
    specs: { materialFront: data.material_front!.trim(), materialTemple: opt.material_temple || '', rimType: entry.rim_type, nosePads: opt.nose_pads || '', springHinges: opt.spring_hinges || '', style: '' },
  };
}
