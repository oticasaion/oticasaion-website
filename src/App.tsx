import React, { useState, useEffect } from 'react';
import { Product } from './types';
import { PRODUCTS } from './data/products';
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
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { trackWhatsAppLead, trackProductView } from './firebase';

// Configuração central do número de atendimento WhatsApp da Óticas Aion
export const WHATSAPP_PHONE_NUMBER = '5511999999999';

export type AppView = 'home' | 'catalog' | 'product-detail' | 'terms-policy';

export const App: React.FC = () => {
  // Dynamic products state (synced with Supabase & localStorage fallback)
  const [products, setProducts] = useState<Product[]>(() => getLocalStoredProducts());
  
  // Navigation view state
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeProductDetail, setActiveProductDetail] = useState<Product | null>(null);

  // Admin and Lens modals
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedProductForLenses, setSelectedProductForLenses] = useState<Product | null>(null);
  const [isLensModalOpen, setIsLensModalOpen] = useState(false);

  // Load products from Supabase on mount
  useEffect(() => {
    fetchProducts().then(({ products: loaded }) => {
      if (loaded && loaded.length > 0) {
        setProducts(loaded);
      }
    });
  }, []);

  // Hash-based URL router support (compatible with GitHub Pages)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#produto')) {
        const idMatch = hash.match(/[?&]id=([^&]+)/) || hash.split('/')[1];
        const prodId = typeof idMatch === 'string' ? idMatch : idMatch?.[1];
        if (prodId) {
          const currentList = getLocalStoredProducts();
          const found = currentList.find((p) => p.id === prodId) || PRODUCTS.find((p) => p.id === prodId);
          if (found) {
            setActiveProductDetail(found);
            setCurrentView('product-detail');
            return;
          }
        }
      }

      if (hash === '#catalogo' || hash === '#/catalogo') {
        setCurrentView('catalog');
        setActiveProductDetail(null);
      } else if (hash === '#termos' || hash === '#politicas' || hash === '#/termos' || hash === '#/politicas') {
        setCurrentView('terms-policy');
        setActiveProductDetail(null);
      } else if (hash === '#admin') {
        setIsAdminModalOpen(true);
      } else if (hash === '' || hash === '#' || hash === '#home' || hash === '#/') {
        setCurrentView('home');
        setActiveProductDetail(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: AppView, targetProduct?: Product) => {
    setCurrentView(view);
    if (view === 'product-detail' && targetProduct) {
      setActiveProductDetail(targetProduct);
      window.location.hash = `#produto?id=${targetProduct.id}`;
    } else if (view === 'catalog') {
      setActiveProductDetail(null);
      window.location.hash = '#catalogo';
    } else if (view === 'terms-policy') {
      setActiveProductDetail(null);
      window.location.hash = '#termos';
    } else {
      setActiveProductDetail(null);
      window.location.hash = '#';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleOpenLensModal = (product: Product) => {
    setSelectedProductForLenses(product);
    setIsLensModalOpen(true);
  };

  const handleQuickAskProduct = (productName: string) => {
    handleOpenWhatsApp(
      `Olá! Tenho interesse no modelo *${productName}*. Ele está disponível para fazer com meu grau?`
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans-brand bg-[#fcfbf9] text-stone-900">
      {/* Header with Announcements and Navigation */}
      <Header
        onWhatsAppClick={handleOpenWhatsApp}
        onNavigate={navigateTo}
        currentView={currentView}
      />

      {/* Main Content Area */}
      <main className="flex-1">
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

            <HowItWorks onWhatsAppClick={handleOpenWhatsApp} />

            <Comparison />

            <Testimonials />

            <Faq onWhatsAppClick={handleOpenWhatsApp} />
          </>
        )}
      </main>

      {/* Footer with navigation and discrete admin login */}
      <Footer
        onWhatsAppClick={handleOpenWhatsApp}
        onNavigate={navigateTo}
        onOpenAdminLogin={() => setIsAdminModalOpen(true)}
      />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppButton
        onClick={handleOpenWhatsApp}
        isDetailView={currentView === 'product-detail'}
      />

      {/* Lens Selection & WhatsApp Checkout Modal (Direcionado para WhatsApp) */}
      <LensSelectorModal
        product={selectedProductForLenses}
        isOpen={isLensModalOpen}
        onClose={() => setIsLensModalOpen(false)}
        onConfirmWhatsApp={(customMessage) => {
          setIsLensModalOpen(false);
          handleOpenWhatsApp(customMessage, 'checkout_lente');
        }}
      />

      {/* Supabase Admin Auth & Product Manager Modal */}
      <AdminAuthModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        products={products}
        onProductsUpdated={(updated) => setProducts(updated)}
        onPreviewProduct={handleOpenProductDetail}
      />
    </div>
  );
};

export default App;
