import React, { useState } from 'react';
import { Product } from './types';
import { PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Catalog } from './components/Catalog';
import { ProductDetailView } from './components/ProductDetailView';
import { HowItWorks } from './components/HowItWorks';
import { Comparison } from './components/Comparison';
import { Testimonials } from './components/Testimonials';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { LensSelectorModal } from './components/LensSelectorModal';

// Configuração central do número de atendimento WhatsApp da Óticas Aion
export const WHATSAPP_PHONE_NUMBER = '5511999999999';

export const App: React.FC = () => {
  // Navigation state: null means home/catalog landing page, or a Product object means product detail page
  const [activeProductDetail, setActiveProductDetail] = useState<Product | null>(null);
  
  // Lens customizer modal state
  const [selectedProductForLenses, setSelectedProductForLenses] = useState<Product | null>(null);
  const [isLensModalOpen, setIsLensModalOpen] = useState(false);

  const handleOpenWhatsApp = (message?: string) => {
    const text =
      message ||
      'Olá! Gostaria de consultar o catálogo e tirar dúvidas sobre óculos de grau completo na Óticas Aion.';
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encoded}`, '_blank');
  };

  const handleOpenProductDetail = (product: Product) => {
    setActiveProductDetail(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleBackToCatalog = () => {
    setActiveProductDetail(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans-brand bg-[#fcfbf9] text-stone-900">
      {/* Header with Announcements and Navigation */}
      <Header onWhatsAppClick={handleOpenWhatsApp} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeProductDetail ? (
          /* Dedicated Product Detail View (matching Bangkok reference) */
          <ProductDetailView
            product={activeProductDetail}
            onBackToCatalog={handleBackToCatalog}
            onSelectProduct={handleOpenProductDetail}
            onOpenLensModal={handleOpenLensModal}
            onWhatsAppClick={handleOpenWhatsApp}
          />
        ) : (
          /* Home & Full Catalog Landing Page (matching Collection reference) */
          <>
            <Hero onWhatsAppClick={handleOpenWhatsApp} />

            <Catalog
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

      {/* Footer */}
      <Footer onWhatsAppClick={handleOpenWhatsApp} />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppButton onClick={handleOpenWhatsApp} />

      {/* Lens Selection & WhatsApp Checkout Modal */}
      <LensSelectorModal
        product={selectedProductForLenses}
        isOpen={isLensModalOpen}
        onClose={() => setIsLensModalOpen(false)}
        onConfirmWhatsApp={(customMessage) => {
          setIsLensModalOpen(false);
          handleOpenWhatsApp(customMessage);
        }}
      />
    </div>
  );
};

export default App;
