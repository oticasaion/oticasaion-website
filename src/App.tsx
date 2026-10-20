import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Product } from './types';
import { getPage, pageHashes, type AppView } from './lib/navigation';
export type { AppView } from './lib/navigation';
import { getLocalStoredProducts, fetchProducts } from './services/productService';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Catalog } from './components/Catalog';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { TermsAndPolicyView } from './components/TermsAndPolicyView';
import { HowItWorks } from './components/HowItWorks';
import { Comparison } from './components/Comparison';
import { Testimonials } from './components/Testimonials';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { LensSelectorModal } from './components/LensSelectorModal';
import { trackWhatsAppLead, trackProductView } from './firebase';

const AdminView = lazy(() => import('./components/admin/AdminView').then(module => ({ default: module.AdminView })));

// Configuração central do número de atendimento WhatsApp da Óticas Aion
export const WHATSAPP_PHONE_NUMBER = '5511988176072';


export const App: React.FC = () => {
  // Dynamic products state (synced with Supabase & localStorage fallback)
  const [products, setProducts] = useState<Product[]>(() => getLocalStoredProducts());
  
  // Navigation view state
  const [currentView, setCurrentView] = useState<AppView>(() => getPage(window.location.hash));
  const [routeHash, setRouteHash] = useState(window.location.hash);
  const productParams = new URLSearchParams(routeHash.split('?')[1] || '');
  let productId = productParams.get('id');
  if (!productId && getPage(routeHash) === 'product-detail') {
    try { productId = decodeURIComponent(routeHash.replace(/^#\/?/, '').split('/')[1] || ''); } catch { productId = null; }
  }
  const activeProductDetail = products.find(p => p.id === productId) || null;

  // Lens selection modal
  const [selectedProductForLenses, setSelectedProductForLenses] = useState<Product | null>(null);
  const [isLensModalOpen, setIsLensModalOpen] = useState(false);
  const [initialLensColor, setInitialLensColor] = useState(0);

  // Load products from Supabase on mount
  useEffect(() => {
    fetchProducts().then(({ products: loaded }) => {
      if (loaded) {
        setProducts(loaded);
      }
    });
  }, []);

  // Dedicated hash pages remain compatible with static hosting.
  useEffect(() => {
    const update = () => {
      setCurrentView(getPage(window.location.hash));
      setRouteHash(window.location.hash);
      setIsLensModalOpen(false);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  useEffect(() => {
    const titles: Record<AppView, string> = {
      home: 'Óculos de grau completo', catalog: 'Catálogo de armações',
      'product-detail': activeProductDetail?.name || 'Armação',
      'terms-policy': 'Políticas e termos', admin: 'Painel administrativo',
      'how-it-works': 'Como funciona', about: 'Por que a Aion?', faq: 'Dúvidas frequentes',
    };
    document.title = titles[currentView] + ' | Óticas Aion';
  }, [currentView, activeProductDetail?.name]);

  const navigateTo = (view: AppView, targetProduct?: Product) => {
    window.location.hash = view === 'product-detail' && targetProduct
      ? pageHashes[view] + '?id=' + encodeURIComponent(targetProduct.id)
      : pageHashes[view];
    window.scrollTo({ top: 0 });
  };

  const handleOpenWhatsApp = (message?: string, context: string = 'geral') => {
    trackWhatsAppLead(context, { messagePreview: message?.substring(0, 50) });
    const text =
      message ||
      'Olá! Gostaria de consultar o catálogo e tirar dúvidas sobre óculos de grau completo na Óticas Aion.';
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encoded}`, '_blank');
  };

  const handleOpenProductDetail = (product: Product) => {
    trackProductView(product.id, product.name, product.currentPrice);
    navigateTo('product-detail', product);
  };

  const handleOpenLensModal = (product: Product, colorIndex = 0) => {
    setInitialLensColor(colorIndex);
    setSelectedProductForLenses(product);
    setIsLensModalOpen(true);
  };

  const handleQuickAskProduct = (productName: string) => {
    handleOpenWhatsApp(
      `Olá! Tenho interesse no modelo *${productName}*. Ele está disponível para fazer com meu grau?`
    );
  };

  // View Dedicada: Painel do Lojista (Acesso Separado)
  if (currentView === 'admin') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f6f7f4] text-[#18392d]" role="status">Carregando painel…</div>}>
      <AdminView
        products={products}
        onProductsUpdated={(updated) => setProducts(updated)}
        onBackToStore={() => navigateTo('home')}
        onPreviewProduct={handleOpenProductDetail}
      />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans-brand bg-[#fcfbf9] text-stone-900">
      {/* Header with Announcements and Navigation */}
      <Header
        onWhatsAppClick={handleOpenWhatsApp}
        onNavigate={navigateTo}
        currentView={currentView}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {currentView === 'how-it-works' && <HowItWorks onWhatsAppClick={handleOpenWhatsApp} />}
        {currentView === 'about' && <><Comparison /><Testimonials /></>}
        {currentView === 'faq' && <Faq onWhatsAppClick={handleOpenWhatsApp} />}
        {currentView === 'product-detail' && !activeProductDetail && <div className="max-w-5xl mx-auto p-12"><h1 className="text-2xl font-bold">Armação não encontrada</h1><a href="#/catalogo" className="inline-block mt-5 underline">Voltar ao catálogo</a></div>}
        {/* TELA 1: POLÍTICA E TERMOS */}
        {currentView === 'terms-policy' && (
          <TermsAndPolicyView
            onBackToHome={() => navigateTo('home')}
            onGoToCatalog={() => navigateTo('catalog')}
            onWhatsAppClick={handleOpenWhatsApp}
          />
        )}

        {/* TELA 2: DETALHES DO PRODUTO */}
        {currentView === 'product-detail' && activeProductDetail && (
          <ProductDetailView
            key={activeProductDetail.id}
            product={activeProductDetail}
            allProducts={products}
            onBackToCatalog={() => navigateTo('catalog')}
            onSelectProduct={handleOpenProductDetail}
            onOpenLensModal={handleOpenLensModal}
            onWhatsAppClick={handleOpenWhatsApp}
          />
        )}

        {/* TELA 3: CATÁLOGO COMPLETO */}
        {currentView === 'catalog' && (
          <CatalogView
            products={products}
            onOpenProductDetail={handleOpenProductDetail}
            onOpenLensModal={handleOpenLensModal}
            onWhatsAppClick={handleOpenWhatsApp}
            onBackToHome={() => navigateTo('home')}
          />
        )}

        {/* HOME LANDING PAGE */}
        {currentView === 'home' && (
          <>
            <Hero onWhatsAppClick={handleOpenWhatsApp} />

            <Catalog
              products={products}
              onOpenProductDetail={handleOpenProductDetail}
              onOpenLensModal={handleOpenLensModal}
              onWhatsAppQuickAsk={handleQuickAskProduct}
            />
            <Testimonials />
          </>
        )}
      </main>

      {/* Footer with navigation and discrete admin login */}
      <Footer
        onWhatsAppClick={handleOpenWhatsApp}
        onNavigate={navigateTo}
      />

      {/* Floating WhatsApp Action Button (Oculto na primeira página / Home) */}
      <WhatsAppButton
        onClick={handleOpenWhatsApp}
        isDetailView={currentView === 'product-detail'}
        isHome={currentView === 'home'}
      />

      {/* Lens Selection & WhatsApp Checkout Modal (Direcionado para WhatsApp) */}
      <LensSelectorModal
        key={(selectedProductForLenses?.id || 'none') + ':' + initialLensColor + ':' + isLensModalOpen}
        initialColorIndex={initialLensColor}
        product={selectedProductForLenses}
        isOpen={isLensModalOpen}
        onClose={() => setIsLensModalOpen(false)}
        onConfirmWhatsApp={(customMessage) => {
          setIsLensModalOpen(false);
          handleOpenWhatsApp(customMessage, 'checkout_lente');
        }}
      />
    </div>
  );
};

export default App;
