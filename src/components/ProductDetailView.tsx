import React, { useState } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  Clock,
  Sparkles,
  Layers,
  Check,
  Package,
  Ruler,
  HelpCircle,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  allProducts?: Product[];
  onBackToCatalog: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenLensModal: (product: Product) => void;
  onWhatsAppClick: (customText?: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts = PRODUCTS,
  onBackToCatalog,
  onSelectProduct,
  onOpenLensModal,
  onWhatsAppClick,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'medidas' | 'descricao' | 'inclusos'>('medidas');
  
  // Shipping calculator state
  const [cep, setCep] = useState('');
  const [shippingResult, setShippingResult] = useState<{
    calculated: boolean;
    pac: string;
    sedex: string;
  } | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  const discountPercent = Math.round(
    ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
  );

  const productList = allProducts && allProducts.length > 0 ? allProducts : PRODUCTS;
  const currentIndex = productList.findIndex((p) => p.id === product.id);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const prevProduct = productList[(safeIndex - 1 + productList.length) % productList.length];
  const nextProduct = productList[(safeIndex + 1) % productList.length];

  const relatedProducts = productList.filter((p) => p.id !== product.id).slice(0, 4);

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cep || cep.replace(/\D/g, '').length < 8) {
      alert('Por favor, informe um CEP válido com 8 dígitos.');
      return;
    }
    setIsCalculatingShipping(true);
    setTimeout(() => {
      setIsCalculatingShipping(false);
      setShippingResult({
        calculated: true,
        pac: 'Frete Econômico: R$ 14,90 (5 a 7 dias úteis)',
        sedex: 'Frete Expresso: R$ 24,50 (2 a 4 dias úteis)',
      });
    }, 500);
  };

  return (
    <div className="bg-[#fcfbf9] text-stone-900 pb-28 sm:pb-24 animate-fadeIn">
      
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-stone-200 py-3 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm text-stone-500">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              onClick={onBackToCatalog}
              className="text-[#0c251d] font-bold hover:underline flex items-center gap-1 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catálogo</span>
            </button>
            <span>/</span>
            <span className="text-stone-900 font-bold truncate max-w-[150px] sm:max-w-none">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
            <button
              onClick={() => onSelectProduct(prevProduct)}
              className="hover:text-[#0c251d] flex items-center gap-0.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Anterior</span>
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={() => onSelectProduct(nextProduct)}
              className="hover:text-[#0c251d] flex items-center gap-0.5"
            >
              <span className="hidden xs:inline">Seguinte</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            
            {/* Main Stage Image */}
            <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-4 sm:p-8 shadow-sm flex items-center justify-center min-h-[260px] xs:min-h-[300px] sm:min-h-[440px] overflow-hidden group">
              {/* Badges */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                {discountPercent > 0 && (
                  <span className="bg-rose-600 text-white font-bold text-[10px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
                {product.isBestseller && (
                  <span className="bg-[#0c251d] text-[#c8a25a] font-bold text-[10px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm">
                    Mais Vendido
                  </span>
                )}
              </div>

              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full max-h-[220px] xs:max-h-[260px] sm:max-h-[360px] object-contain transition-transform duration-500"
              />

              {/* Prev / Next Image arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex(
                        (selectedImageIndex - 1 + product.images.length) % product.images.length
                      )
                    }
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-md border border-stone-200 flex items-center justify-center text-stone-700 active:scale-95 transition"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((selectedImageIndex + 1) % product.images.length)
                    }
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-md border border-stone-200 flex items-center justify-center text-stone-700 active:scale-95 transition"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Row */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white border-2 p-1 shrink-0 overflow-hidden transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#0c251d] ring-2 ring-[#c8a25a]/40 shadow-sm'
                      : 'border-stone-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}

              {/* Client real photos thumbnails */}
              {product.clientPhotos?.map((clientImg, idx) => (
                <div
                  key={`client-${idx}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-stone-100 border border-stone-200 p-1 shrink-0 overflow-hidden relative"
                >
                  <img src={clientImg} alt="" className="w-full h-full object-cover rounded-lg" />
                  <span className="absolute bottom-1 right-1 bg-black/75 text-[8px] sm:text-[9px] text-white px-1 rounded font-bold">
                    Real
                  </span>
                </div>
              ))}
            </div>

            {/* UGC Client Photos Box */}
            {product.clientPhotos && product.clientPhotos.length > 0 && (
              <div className="bg-stone-100/90 rounded-2xl p-3 sm:p-4 border border-stone-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2 shrink-0">
                    {product.clientPhotos.map((c, i) => (
                      <img
                        key={i}
                        src={c}
                        alt="Cliente Aion"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <div className="text-[11px] sm:text-xs">
                    <strong className="text-stone-900 block font-bold">
                      Fotos reais de clientes
                    </strong>
                    <span className="text-stone-500">Recebidos e aprovados no WhatsApp</span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    onWhatsAppClick(
                      `Olá! Gostaria de ver mais fotos reais de clientes usando o ${product.name}.`
                    )
                  }
                  className="text-[11px] sm:text-xs font-bold text-[#0c251d] underline shrink-0"
                >
                  Ver no Zap
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Buy Box & Actions */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-stone-200 shadow-sm">
            
            {/* Title & Rating */}
            <div>
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-700">
                  {product.rating} ({product.reviewsCount})
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500 font-medium capitalize">
                  {product.gender}
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold text-[#0c251d] font-serif-brand leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">{product.material}</p>
            </div>

            {/* Price Box */}
            <div className="bg-[#faf8f5] rounded-2xl p-4 sm:p-5 border border-stone-200">
              <span className="text-xs text-stone-400 line-through">
                De R$ {product.originalPrice.toFixed(2)}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-4xl font-black text-[#0c251d]">
                  R$ {product.currentPrice.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  No PIX (5% OFF)
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200/80 pt-2">
                <span>ou até <strong>12x de R$ {(product.currentPrice / 12 * 1.08).toFixed(2)}</strong></span>
                <span className="text-stone-400">no Cartão</span>
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Cor:{' '}
                <span className="text-stone-900 font-semibold normal-case">
                  {product.colors[selectedColorIndex]?.name}
                </span>
              </label>

              <div className="flex items-center gap-2.5">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 p-0.5 transition-all ${
                      selectedColorIndex === idx
                        ? 'border-[#0c251d] scale-110 shadow-md ring-2 ring-[#c8a25a]/50'
                        : 'border-transparent'
                    }`}
                    title={color.name}
                  >
                    <span
                      className="block w-full h-full rounded-full border border-black/20"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Actions (Direcionado para WhatsApp - Sem compra no site) */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => onOpenLensModal(product)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-extrabold text-sm sm:text-base py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl shadow-xl shadow-amber-700/25 active:scale-98 tracking-wide uppercase text-center"
              >
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Personalizar Lentes & Pedir no WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  const colorName = product.colors[selectedColorIndex]?.name || 'Padrão';
                  const pixVal = product.currentPrice * (1 - product.pixDiscountPercent / 100);
                  onWhatsAppClick(
                    `*Olá, Óticas Aion!* 👋\n\nGostaria de pedir apenas a *armação sem lentes de grau*:\n\n👓 *Modelo:* ${product.name}\n🎨 *Cor:* ${colorName}\n💰 *Valor com desconto PIX:* R$ ${pixVal.toFixed(2)} (ou R$ ${product.currentPrice.toFixed(2)} normal)\n\nQual o procedimento para envio e entrega?`
                  );
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition active:scale-98 text-center shadow-md shadow-emerald-700/20"
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                <span>Pedir Apenas a Armação no WhatsApp</span>
              </button>

              <button
                onClick={() =>
                  onWhatsAppClick(
                    `Olá! Gostaria de tirar dúvidas sobre a armação *${product.name}* na cor *${product.colors[selectedColorIndex]?.name}*. Tenho minha receita em mãos!`
                  )
                }
                className="w-full flex items-center justify-center gap-2 border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold text-xs sm:text-sm py-2.5 sm:py-3 px-4 rounded-xl transition active:scale-98 text-center"
              >
                <HelpCircle className="w-4 h-4 text-stone-500 shrink-0" />
                <span>Dúvidas sobre o modelo? Falar com consultor</span>
              </button>
            </div>

            {/* Delivery Alert notice */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Prazo de laboratório:</strong> Para lentes com grau, o prazo de confecção e conferência técnica é de até <strong>7 dias úteis</strong>.
              </span>
            </div>

            {/* Freight Simulator */}
            <div className="pt-2 border-t border-stone-200">
              <form onSubmit={handleCalculateShipping} className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Calcular Frete e Prazo:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Seu CEP (00000-000)"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    maxLength={9}
                    className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-base sm:text-xs font-medium focus:outline-none focus:border-[#0c251d]"
                  />
                  <button
                    type="submit"
                    disabled={isCalculatingShipping}
                    className="bg-[#0c251d] text-[#c8a25a] font-bold text-xs px-4 py-2.5 rounded-xl shrink-0 disabled:opacity-50"
                  >
                    {isCalculatingShipping ? '...' : 'Calcular'}
                  </button>
                </div>
              </form>

              {shippingResult?.calculated && (
                <div className="mt-2.5 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{shippingResult.pac}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-700 pt-1 border-t border-stone-200">
                    <Sparkles className="w-3.5 h-3.5 text-[#c8a25a] shrink-0" />
                    <span>{shippingResult.sedex}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Garantia de 7 Dias</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Receita conferida</span>
              </div>
            </div>

          </div>

        </div>

        {/* Technical Tabs: Medidas, Descrição, Itens Inclusos */}
        <div className="mt-10 sm:mt-16 bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-stone-200 bg-stone-50 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('medidas')}
              className={`flex-1 py-3 sm:py-4 px-2 sm:px-6 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'medidas'
                  ? 'border-[#0c251d] text-[#0c251d] bg-white'
                  : 'border-transparent text-stone-500'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Medidas</span>
            </button>
            <button
              onClick={() => setActiveTab('descricao')}
              className={`flex-1 py-3 sm:py-4 px-2 sm:px-6 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'descricao'
                  ? 'border-[#0c251d] text-[#0c251d] bg-white'
                  : 'border-transparent text-stone-500'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Descrição</span>
            </button>
            <button
              onClick={() => setActiveTab('inclusos')}
              className={`flex-1 py-3 sm:py-4 px-2 sm:px-6 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'inclusos'
                  ? 'border-[#0c251d] text-[#0c251d] bg-white'
                  : 'border-transparent text-stone-500'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Inclusos</span>
            </button>
          </div>

          {/* Tab 1: Medidas */}
          {activeTab === 'medidas' && (
            <div className="p-4 sm:p-10 space-y-6 sm:space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                
                {/* Visual Technical Diagram */}
                <div className="lg:col-span-6 bg-[#faf8f5] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-stone-200 flex flex-col items-center justify-center">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2 sm:mb-4 block text-center">
                    Diagrama Técnico de Medidas (em milímetros)
                  </span>

                  <div className="w-full max-w-sm sm:max-w-md py-2">
                    <svg viewBox="0 0 400 200" className="w-full h-auto drop-shadow-sm">
                      <rect x="50" y="50" width="120" height="80" rx="16" fill="none" stroke="#0c251d" strokeWidth="3" />
                      <rect x="230" y="50" width="120" height="80" rx="16" fill="none" stroke="#0c251d" strokeWidth="3" />
                      <path d="M 170 80 Q 200 68 230 80" fill="none" stroke="#c8a25a" strokeWidth="3.5" />
                      <line x1="50" y1="65" x2="15" y2="55" stroke="#0c251d" strokeWidth="3" />
                      <line x1="350" y1="65" x2="385" y2="55" stroke="#0c251d" strokeWidth="3" />

                      <line x1="172" y1="40" x2="228" y2="40" stroke="#78716c" strokeWidth="1.5" />
                      <text x="200" y="32" textAnchor="middle" fill="#1c1917" fontSize="12" fontWeight="bold">
                        {product.dimensions.bridgeWidth} mm (Ponte)
                      </text>

                      <line x1="232" y1="40" x2="348" y2="40" stroke="#78716c" strokeWidth="1.5" />
                      <text x="290" y="32" textAnchor="middle" fill="#1c1917" fontSize="12" fontWeight="bold">
                        {product.dimensions.lensWidth} mm (Aro)
                      </text>

                      <line x1="30" y1="52" x2="30" y2="128" stroke="#78716c" strokeWidth="1.5" />
                      <text x="22" y="95" textAnchor="end" fill="#1c1917" fontSize="11" fontWeight="bold">
                        {product.dimensions.lensHeight} mm
                      </text>

                      <line x1="50" y1="160" x2="350" y2="160" stroke="#c8a25a" strokeWidth="2" strokeDasharray="4 2" />
                      <text x="200" y="180" textAnchor="middle" fill="#0c251d" fontSize="13" fontWeight="bold">
                        {product.dimensions.totalFront} mm (Frente Total)
                      </text>
                    </svg>

                    <div className="text-center mt-2 text-xs text-stone-500">
                      Hastes: <strong>{product.dimensions.templeLength} mm</strong>
                    </div>
                  </div>
                </div>

                {/* Specs Table */}
                <div className="lg:col-span-6">
                  <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-xs sm:text-sm text-left">
                      <tbody className="divide-y divide-stone-100">
                        <tr className="bg-stone-50/50">
                          <td className="p-3 font-bold text-stone-600 w-1/2">Material Frente</td>
                          <td className="p-3 text-stone-900 font-semibold">{product.specs.materialFront}</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-stone-600">Material Haste</td>
                          <td className="p-3 text-stone-900 font-semibold">{product.specs.materialTemple}</td>
                        </tr>
                        <tr className="bg-stone-50/50">
                          <td className="p-3 font-bold text-stone-600">Tipo do Aro</td>
                          <td className="p-3 text-stone-900 font-semibold">{product.specs.rimType}</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-stone-600">Plaquetas Nasais</td>
                          <td className="p-3 text-stone-900 font-semibold">{product.specs.nosePads}</td>
                        </tr>
                        <tr className="bg-stone-50/50">
                          <td className="p-3 font-bold text-stone-600">Mola na Haste</td>
                          <td className="p-3 text-stone-900 font-semibold">{product.specs.springHinges}</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-stone-600">Estilo</td>
                          <td className="p-3 text-stone-900 font-semibold">{product.specs.style}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tab 2: Descrição */}
          {activeTab === 'descricao' && (
            <div className="p-4 sm:p-10 space-y-3 sm:space-y-4 max-w-3xl">
              <h3 className="text-lg sm:text-xl font-bold font-serif-brand text-[#0c251d]">
                Detalhes de Construção & Ergonomia
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Tab 3: Itens Inclusos */}
          {activeTab === 'inclusos' && (
            <div className="p-4 sm:p-10 space-y-3 sm:space-y-4 max-w-3xl">
              <h3 className="text-lg sm:text-xl font-bold font-serif-brand text-[#0c251d]">
                O que você recebe no estojo:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 pt-1">
                {product.includedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-semibold text-stone-800"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#0c251d] text-[#c8a25a] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* You May Also Like */}
        <div className="mt-12 sm:mt-20">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <h3 className="text-xl sm:text-3xl font-extrabold text-[#0c251d] font-serif-brand">
              Você Pode Gostar
            </h3>
            <button
              onClick={onBackToCatalog}
              className="text-xs sm:text-sm font-bold text-[#0c251d] hover:underline"
            >
              Ver todos →
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  onSelectProduct(rel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-3 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="aspect-square bg-stone-50 rounded-xl overflow-hidden p-2 flex items-center justify-center">
                  <img
                    src={rel.images[0]}
                    alt={rel.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-2">
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                    {rel.name}
                  </h4>
                  <span className="text-sm sm:text-base font-extrabold text-[#0c251d] block mt-0.5">
                    R$ {rel.currentPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Sticky Bottom Buy Bar for Mobile & Desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 py-2.5 sm:py-3 px-3 sm:px-8 shadow-2xl pb-safe">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img
              src={product.images[0]}
              alt=""
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain border border-stone-200 shrink-0"
            />
            <div className="min-w-0">
              <span className="font-bold text-stone-900 text-xs sm:text-sm block truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
                {product.name}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm sm:text-base font-black text-[#0c251d]">
                  R$ {product.currentPrice.toFixed(2)}
                </span>
                <span className="text-[9px] text-emerald-800 font-bold bg-emerald-50 px-1 rounded">
                  no PIX
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onOpenLensModal(product)}
              className="bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-extrabold text-xs sm:text-sm py-2.5 sm:py-3 px-4 sm:px-8 rounded-xl shadow-md transition active:scale-95 whitespace-nowrap uppercase tracking-tight sm:tracking-wider"
            >
              Comprar c/ Lentes
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
