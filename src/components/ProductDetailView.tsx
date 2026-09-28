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
  Share2,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  onBackToCatalog: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenLensModal: (product: Product) => void;
  onWhatsAppClick: (customText?: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
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

  // Navigate between previous/next product
  const currentIndex = PRODUCTS.findIndex((p) => p.id === product.id);
  const prevProduct = PRODUCTS[(currentIndex - 1 + PRODUCTS.length) % PRODUCTS.length];
  const nextProduct = PRODUCTS[(currentIndex + 1) % PRODUCTS.length];

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

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
    }, 600);
  };

  return (
    <div className="bg-[#fcfbf9] text-stone-900 pb-24 animate-fadeIn">
      
      {/* Breadcrumb & Navigation Bar */}
      <div className="bg-white border-b border-stone-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm text-stone-500">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <button
              onClick={onBackToCatalog}
              className="text-[#0c251d] font-semibold hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Catálogo</span>
            </button>
            <span>/</span>
            <span>Óculos de Grau</span>
            <span>/</span>
            <span className="text-stone-900 font-bold truncate max-w-[180px] sm:max-w-none">
              {product.name}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => onSelectProduct(prevProduct)}
              className="hover:text-[#0c251d] flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={() => onSelectProduct(nextProduct)}
              className="hover:text-[#0c251d] flex items-center gap-1"
            >
              <span>Seguinte</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Image Gallery & Photos */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Stage Image */}
            <div className="relative bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm flex items-center justify-center min-h-[380px] sm:min-h-[460px] overflow-hidden group">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {discountPercent > 0 && (
                  <span className="bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                    {discountPercent}% de desconto
                  </span>
                )}
                {product.isBestseller && (
                  <span className="bg-[#0c251d] text-[#c8a25a] font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                    Carro-Chefe Aion
                  </span>
                )}
              </div>

              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full max-h-[360px] object-contain transition-transform duration-500 group-hover:scale-105"
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md border border-stone-200 flex items-center justify-center text-stone-700 hover:text-black hover:scale-105 transition"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((selectedImageIndex + 1) % product.images.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md border border-stone-200 flex items-center justify-center text-stone-700 hover:text-black hover:scale-105 transition"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl bg-white border-2 p-1.5 shrink-0 overflow-hidden transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#0c251d] ring-2 ring-[#c8a25a]/40 shadow-md'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}

              {/* Client real photos thumbnails */}
              {product.clientPhotos?.map((clientImg, idx) => (
                <div
                  key={`client-${idx}`}
                  className="w-20 h-20 rounded-2xl bg-stone-100 border border-stone-200 p-1 shrink-0 overflow-hidden relative"
                  title="Foto real de cliente"
                >
                  <img src={clientImg} alt="" className="w-full h-full object-cover rounded-xl" />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] text-white px-1 rounded font-bold">
                    Cliente
                  </span>
                </div>
              ))}
            </div>

            {/* UGC / Client Photos Banner */}
            {product.clientPhotos && product.clientPhotos.length > 0 && (
              <div className="bg-stone-100/80 rounded-2xl p-4 border border-stone-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {product.clientPhotos.map((c, i) => (
                      <img
                        key={i}
                        src={c}
                        alt="Cliente Aion"
                        className="w-9 h-9 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <div className="text-xs">
                    <strong className="text-stone-900 block font-bold">
                      Fotos reais de clientes com este modelo
                    </strong>
                    <span className="text-stone-500">Recebidos e aprovados via WhatsApp</span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    onWhatsAppClick(
                      `Olá! Gostaria de ver mais fotos reais de clientes usando o ${product.name}.`
                    )
                  }
                  className="text-xs font-bold text-[#0c251d] hover:text-[#c8a25a] underline shrink-0"
                >
                  Ver no WhatsApp
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Buy Box, Specs & Actions */}
          <div className="lg:col-span-5 space-y-6 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            
            {/* Title & Rating */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-700">
                  {product.rating} ({product.reviewsCount} avaliações)
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500 font-medium capitalize">
                  {product.gender}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c251d] font-serif-brand">
                {product.name}
              </h1>
              <p className="text-xs text-stone-500 mt-1">{product.material}</p>
            </div>

            {/* Price Box */}
            <div className="bg-[#faf8f5] rounded-2xl p-5 border border-stone-200">
              <span className="text-xs text-stone-400 line-through">
                De R$ {product.originalPrice.toFixed(2)}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl sm:text-4xl font-black text-[#0c251d]">
                  R$ {product.currentPrice.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  No PIX (5% OFF)
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200/80 pt-2">
                <span>ou até <strong>12x de R$ {(product.currentPrice / 12 * 1.08).toFixed(2)}</strong></span>
                <span className="text-stone-400">Cartão de Crédito</span>
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Cor:{' '}
                  <span className="text-stone-900 font-semibold normal-case">
                    {product.colors[selectedColorIndex]?.name}
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`w-9 h-9 rounded-full border-2 p-0.5 transition-all ${
                      selectedColorIndex === idx
                        ? 'border-[#0c251d] scale-110 shadow-md ring-2 ring-[#c8a25a]/50'
                        : 'border-transparent hover:scale-105'
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

            {/* Main Action Button (Inspirado na referência Euglasses) */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => onOpenLensModal(product)}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-extrabold text-base py-4 px-6 rounded-2xl shadow-xl shadow-amber-700/25 transition-all hover:scale-[1.02] active:scale-98 tracking-wide uppercase"
              >
                <Layers className="w-5 h-5" />
                <span>Adicionar Lentes e Comprar</span>
              </button>

              <button
                onClick={() =>
                  onWhatsAppClick(
                    `Olá! Gostaria de consultar sobre a armação *${product.name}* na cor *${product.colors[selectedColorIndex]?.name}*. Tenho minha receita em mãos!`
                  )
                }
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm py-3 px-4 rounded-2xl shadow-md transition active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Tirar Dúvida no WhatsApp</span>
              </button>
            </div>

            {/* Delivery Alert notice from reference */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Prazo de laboratório:</strong> Para lentes com grau, o prazo de confecção digital e conferência técnica é de até <strong>7 dias úteis</strong>.
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
                    className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#0c251d] focus:bg-white transition"
                  />
                  <button
                    type="submit"
                    disabled={isCalculatingShipping}
                    className="bg-[#0c251d] hover:bg-[#143d30] text-[#c8a25a] font-bold text-xs px-5 py-2.5 rounded-xl transition shrink-0 disabled:opacity-50"
                  >
                    {isCalculatingShipping ? 'Calculando...' : 'Calcular'}
                  </button>
                </div>
              </form>

              {shippingResult?.calculated && (
                <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-stone-700">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{shippingResult.pac}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-stone-700 pt-1 border-t border-stone-200">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-[#c8a25a]" />
                      <span>{shippingResult.sedex}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Garantia de 7 Dias</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Receita conferida por técnico</span>
              </div>
            </div>

          </div>

        </div>

        {/* Technical Tabs: Medidas, Descrição, Itens Inclusos */}
        <div className="mt-16 bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-stone-200 bg-stone-50 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('medidas')}
              className={`flex-1 py-4 px-6 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
                activeTab === 'medidas'
                  ? 'border-[#0c251d] text-[#0c251d] bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Ruler className="w-4 h-4" />
              <span>Medidas do Modelo</span>
            </button>
            <button
              onClick={() => setActiveTab('descricao')}
              className={`flex-1 py-4 px-6 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
                activeTab === 'descricao'
                  ? 'border-[#0c251d] text-[#0c251d] bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Descrição & Benefícios</span>
            </button>
            <button
              onClick={() => setActiveTab('inclusos')}
              className={`flex-1 py-4 px-6 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
                activeTab === 'inclusos'
                  ? 'border-[#0c251d] text-[#0c251d] bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Itens Inclusos no Estojo</span>
            </button>
          </div>

          {/* Tab 1: Medidas (Reproduzindo o diagrama cotado da referência!) */}
          {activeTab === 'medidas' && (
            <div className="p-6 sm:p-10 space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Visual Technical Diagram */}
                <div className="lg:col-span-6 bg-[#faf8f5] rounded-3xl p-6 border border-stone-200 flex flex-col items-center justify-center relative">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-4 block">
                    Diagrama Técnico de Medidas (em milímetros)
                  </span>

                  {/* SVG Diagram with annotated measurements */}
                  <div className="relative w-full max-w-md py-4">
                    <svg viewBox="0 0 400 200" className="w-full h-auto drop-shadow-sm">
                      {/* Left Rim */}
                      <rect
                        x="50"
                        y="50"
                        width="120"
                        height="80"
                        rx="16"
                        fill="none"
                        stroke="#0c251d"
                        strokeWidth="3"
                      />
                      {/* Right Rim */}
                      <rect
                        x="230"
                        y="50"
                        width="120"
                        height="80"
                        rx="16"
                        fill="none"
                        stroke="#0c251d"
                        strokeWidth="3"
                      />
                      {/* Bridge */}
                      <path
                        d="M 170 80 Q 200 68 230 80"
                        fill="none"
                        stroke="#c8a25a"
                        strokeWidth="3.5"
                      />
                      {/* Left Temple Stub */}
                      <line x1="50" y1="65" x2="15" y2="55" stroke="#0c251d" strokeWidth="3" />
                      {/* Right Temple Stub */}
                      <line x1="350" y1="65" x2="385" y2="55" stroke="#0c251d" strokeWidth="3" />

                      {/* Dimension: Bridge (Ponte) */}
                      <line x1="172" y1="40" x2="228" y2="40" stroke="#78716c" strokeWidth="1.5" />
                      <text x="200" y="32" textAnchor="middle" fill="#1c1917" fontSize="12" fontWeight="bold">
                        {product.dimensions.bridgeWidth} mm (Ponte)
                      </text>

                      {/* Dimension: Lens Width (Aro) */}
                      <line x1="232" y1="40" x2="348" y2="40" stroke="#78716c" strokeWidth="1.5" />
                      <text x="290" y="32" textAnchor="middle" fill="#1c1917" fontSize="12" fontWeight="bold">
                        {product.dimensions.lensWidth} mm (Aro)
                      </text>

                      {/* Dimension: Lens Height (Altura) */}
                      <line x1="30" y1="52" x2="30" y2="128" stroke="#78716c" strokeWidth="1.5" />
                      <text x="22" y="95" textAnchor="end" fill="#1c1917" fontSize="11" fontWeight="bold">
                        {product.dimensions.lensHeight} mm
                      </text>

                      {/* Dimension: Front Total */}
                      <line x1="50" y1="160" x2="350" y2="160" stroke="#c8a25a" strokeWidth="2" strokeDasharray="4 2" />
                      <text x="200" y="180" textAnchor="middle" fill="#0c251d" fontSize="13" fontWeight="bold">
                        {product.dimensions.totalFront} mm (Frente Total)
                      </text>
                    </svg>

                    <div className="text-center mt-3 text-xs text-stone-500">
                      Hastes ergonômicas: <strong>{product.dimensions.templeLength} mm</strong>
                    </div>
                  </div>
                </div>

                {/* Specs Table (Idêntica à referência Euglasses) */}
                <div className="lg:col-span-6">
                  <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-xs sm:text-sm text-left">
                      <tbody className="divide-y divide-stone-100">
                        <tr className="bg-stone-50/50">
                          <td className="p-3.5 font-bold text-stone-600 w-1/2">Material Frente</td>
                          <td className="p-3.5 text-stone-900 font-semibold">{product.specs.materialFront}</td>
                        </tr>
                        <tr>
                          <td className="p-3.5 font-bold text-stone-600">Material Haste</td>
                          <td className="p-3.5 text-stone-900 font-semibold">{product.specs.materialTemple}</td>
                        </tr>
                        <tr className="bg-stone-50/50">
                          <td className="p-3.5 font-bold text-stone-600">Tipo do Aro</td>
                          <td className="p-3.5 text-stone-900 font-semibold">{product.specs.rimType}</td>
                        </tr>
                        <tr>
                          <td className="p-3.5 font-bold text-stone-600">Plaquetas Nasais</td>
                          <td className="p-3.5 text-stone-900 font-semibold">{product.specs.nosePads}</td>
                        </tr>
                        <tr className="bg-stone-50/50">
                          <td className="p-3.5 font-bold text-stone-600">Mola na Haste</td>
                          <td className="p-3.5 text-stone-900 font-semibold">{product.specs.springHinges}</td>
                        </tr>
                        <tr>
                          <td className="p-3.5 font-bold text-stone-600">Estilo da Armação</td>
                          <td className="p-3.5 text-stone-900 font-semibold">{product.specs.style}</td>
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
            <div className="p-6 sm:p-10 space-y-4 max-w-3xl">
              <h3 className="text-xl font-bold font-serif-brand text-[#0c251d]">
                Detalhes & Ergonomia de Construção
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <strong className="text-xs uppercase text-[#c8a25a] font-bold block mb-1">
                    Leveza Extrema
                  </strong>
                  <p className="text-xs text-stone-600">
                    Projetado para não deixar marcas vermelhas no nariz ou machucar as orelhas ao longo do dia.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <strong className="text-xs uppercase text-[#c8a25a] font-bold block mb-1">
                    Corte Oftálmico Digital
                  </strong>
                  <p className="text-xs text-stone-600">
                    Bordas polidas e montagem milimétrica para encaixe perfeito das suas lentes de grau.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Itens Inclusos */}
          {activeTab === 'inclusos' && (
            <div className="p-6 sm:p-10 space-y-4 max-w-3xl">
              <h3 className="text-xl font-bold font-serif-brand text-[#0c251d]">
                O que você recebe na sua encomenda Aion:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {product.includedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#0c251d] text-[#c8a25a] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-stone-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* You May Also Like / Related Products Carousel */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#c8a25a]">
                Sugestões
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0c251d] font-serif-brand">
                Você Também Pode Gostar
              </h3>
            </div>
            <button
              onClick={onBackToCatalog}
              className="text-xs sm:text-sm font-bold text-[#0c251d] hover:underline"
            >
              Ver todo o catálogo →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  onSelectProduct(rel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer group bg-white rounded-3xl border border-stone-200 p-4 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="aspect-[4/3] bg-stone-50 rounded-2xl overflow-hidden p-2 flex items-center justify-center">
                  <img
                    src={rel.images[0]}
                    alt={rel.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="mt-3">
                  <h4 className="font-bold text-stone-900 text-sm group-hover:text-[#0c251d]">
                    {rel.name}
                  </h4>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-base font-extrabold text-[#0c251d]">
                      R$ {rel.currentPrice.toFixed(2)}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                      no PIX
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Sticky Bottom Buy Bar (Como na referência mobile/desktop da Euglasses) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={product.images[0]}
              alt=""
              className="w-12 h-12 rounded-xl object-cover border border-stone-200 hidden sm:block"
            />
            <div>
              <span className="font-bold text-stone-900 text-xs sm:text-sm block truncate max-w-[160px] sm:max-w-none">
                {product.name}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm sm:text-base font-black text-[#0c251d]">
                  R$ {product.currentPrice.toFixed(2)}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded hidden sm:inline">
                  no PIX
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenLensModal(product)}
              className="bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-extrabold text-xs sm:text-sm py-3 px-6 sm:px-8 rounded-xl shadow-lg transition active:scale-95 whitespace-nowrap uppercase tracking-wider"
            >
              Comprar com Lentes
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
