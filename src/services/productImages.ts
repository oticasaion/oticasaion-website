import { supabase } from '../lib/supabase';
import { requireAdmin } from '../lib/adminAccess';

export const PRODUCT_IMAGE_BUCKET = 'product-images';
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export function validateImageFile(file: Pick<File, 'type' | 'size'>): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return 'Escolha uma imagem JPG, PNG ou WebP.';
  if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) return 'Cada foto deve ter até 8 MB e não pode estar vazia.';
  return null;
}
export const WEBP_TARGET_BYTES = 350 * 1024;
export const MAX_IMAGE_DIMENSION = 1600;
export async function prepareImage(file: File): Promise<File> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);
  const bitmap = await createImageBitmap(file);
  try {
    if (!bitmap.width || !bitmap.height) throw new Error('A imagem não tem dimensões válidas.');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Não foi possível preparar a imagem neste navegador.');
    let dimension = Math.min(MAX_IMAGE_DIMENSION, Math.max(bitmap.width, bitmap.height));
    let quality = .84;
    let best: Blob | null = null;
    for (let attempt = 0; attempt < 8; attempt++) {
      const ratio = Math.min(1, dimension / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
      canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const encoded = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Não foi possível comprimir a foto.')), 'image/webp', quality));
      if (encoded.type !== 'image/webp') throw new Error('Seu navegador não suporta a conversão WebP. Atualize o navegador e tente novamente.');
      if (!best || encoded.size < best.size) best = encoded;
      if (best.size <= WEBP_TARGET_BYTES) break;
      if (quality > .65) quality = Math.max(.64, quality - .1);
      else dimension = Math.max(640, Math.round(dimension * .8));
    }
    if (file.type === 'image/webp' && file.size < best!.size && Math.max(bitmap.width, bitmap.height) <= MAX_IMAGE_DIMENSION) {
      const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
      if (String.fromCharCode(...header.slice(0,4)) === 'RIFF' && String.fromCharCode(...header.slice(8,12)) === 'WEBP') return file;
    }
    return new File([best!], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
  } finally { bitmap.close(); }
}
export async function uploadProductImage(file: File, productId: string): Promise<{ path: string; url: string }> {
  const user = await requireAdmin();
  const invalid = validateImageFile(file);
  if (invalid) throw new Error(invalid);
  const extension = file.type === 'image/png' ? 'png' : file.type === 'image/jpeg' ? 'jpg' : 'webp';
  const path = user.id + '/' + encodeURIComponent(productId) + '/' + crypto.randomUUID() + '.' + extension;
  const bucket = supabase.storage.from(PRODUCT_IMAGE_BUCKET);
  const { error } = await bucket.upload(path, file, { upsert: false, contentType: file.type, cacheControl: '31536000' });
  if (error) throw new Error('Não foi possível enviar a foto. Verifique sua conexão e se o armazenamento de imagens foi configurado.');
  return { path, url: bucket.getPublicUrl(path).data.publicUrl };
}
export async function removeUnpublishedImages(paths: string[]): Promise<void> {
  if (!paths.length) return;
  const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(paths);
  if (error) console.warn('Não foi possível limpar fotos ainda não publicadas:', error.message);
}
