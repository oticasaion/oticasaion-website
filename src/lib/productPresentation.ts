import type { Product } from '../types';
import { LENS_OPTIONS } from '../data/lenses';

export const currency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
export function productPricing(product: Product) {
  const frame = Math.max(0, Number.isFinite(product.currentPrice) ? product.currentPrice : 0);
  const discount = Math.min(100, Math.max(0, Number.isFinite(product.pixDiscountPercent) ? product.pixDiscountPercent : 0));
  const lenses = LENS_OPTIONS.filter(lens => lens.price > 0).map(lens => lens.price);
  const lens = lenses.length ? Math.min(...lenses) : null;
  return {
    frame, discount, pix: frame * (1 - discount / 100),
    previous: product.originalPrice > frame ? product.originalPrice : null,
    completePix: lens === null ? null : (frame + lens) * (1 - discount / 100),
  };
}
export function normalizeCep(value: string): string { return value.replace(/\D/g, '').slice(0,8); }
export function formatCep(value: string): string { const cep = normalizeCep(value); return cep.length > 5 ? cep.slice(0,5) + '-' + cep.slice(5) : cep; }
export function productInquiry(product: Product, colorIndex: number, kind: 'frame' | 'help' | 'shipping', cep = ''): string {
  const color = product.colors[colorIndex]?.name;
  const details = '*Modelo:* ' + product.name + (color ? '\n*Cor:* ' + color : '');
  if (kind === 'shipping') return 'Olá! Gostaria de consultar frete e prazo para o produto:\n' + details + '\n*CEP:* ' + formatCep(cep) + '\nPoderiam confirmar o valor do envio e o prazo de entrega?';
  if (kind === 'help') return 'Olá! Gostaria de ajuda para escolher as lentes e conferir as medidas desta armação:\n' + details;
  return 'Olá! Tenho interesse somente na armação:\n' + details + '\n*Preço da armação no Pix:* ' + currency(productPricing(product).pix) + '\nPodem confirmar a disponibilidade e as condições de envio?';
}
