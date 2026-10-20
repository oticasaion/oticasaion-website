export type AppView = 'home' | 'catalog' | 'product-detail' | 'terms-policy' | 'admin' | 'how-it-works' | 'about' | 'faq';

export const pageHashes: Record<AppView, string> = {
  home: '#/', catalog: '#/catalogo', 'product-detail': '#/produto',
  'terms-policy': '#/politicas', admin: '#/admin',
  'how-it-works': '#/como-funciona', about: '#/por-que-aion', faq: '#/duvidas',
};

export function getPage(hash: string): AppView {
  const path = hash.replace(/^#\/?/, '').split('?')[0].split('/')[0];
  if (path === 'catalogo') return 'catalog';
  if (path === 'produto') return 'product-detail';
  if (['politicas', 'termos'].includes(path)) return 'terms-policy';
  if (['admin', 'lojista'].includes(path)) return 'admin';
  if (path === 'como-funciona') return 'how-it-works';
  if (['por-que-aion', 'comparativo'].includes(path)) return 'about';
  if (['duvidas', 'faq'].includes(path)) return 'faq';
  return 'home';
}
