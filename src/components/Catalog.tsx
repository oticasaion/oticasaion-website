import React, { useState } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import {
  Star,
  Eye,
  MessageCircle,
  SlidersHorizontal,
  Sparkles,
  Check,
  ArrowRight,
  Filter,
  X,
  Truck,
} from 'lucide-react';

interface CatalogProps {
  onOpenProductDetail: (product: Product) => void;
  onOpenLensModal: (product: Product) => void;
  onWhatsAppQuickAsk: (productName: string) => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  onOpenProductDetail,
  onOpenLensModal,
  onWhatsAppQuickAsk,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('todos');
  const [selectedGender, setSelectedGender] = useState<string>('todos');
  const [selectedRimType, setSelectedRimType] = useState<string>('todos');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters logic
  const filteredProducts = PRODUCTS.filter((product) => {
    // Format
    if (selectedFormat !== 'todos' && product.shape !== selectedFormat) {
      return false;
    }
    // Gender
    if (selectedGender !== 'todos') {
      if (selectedGender === 'masculino' && product.gender === 'feminino') return false;
      if (selectedGender === 'feminino' && product.gender === 'masculino') return false;
    }
    // Rim Type
    if (selectedRimType !== 'todos') {
      if (selectedRimType === 'balgriff' && !product.specs.rimType.includes('Sem Aro')) return false;
      if (selectedRimType === 'fechado' && product.specs.rimType !== 'Aro Fechado') return false;
      if (selectedRimType === 'meio-aro' && product.specs.rimType !== 'Meio Aro') return false;
    }
    // Price
    if (selectedPriceRange === 'ate-100' && product.currentPrice > 100) return false;
    if (selectedPriceRange === '100-140' && (product.currentPrice < 100 || product.currentPrice > 140)) return false;
    if (selectedPriceRange === 'acima-140' && product.currentPrice < 140) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.currentPrice - b.currentPrice;
    if (sortBy === 'price-desc') return b.currentPrice - a.currentPrice;
    return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
  });

  const clearAllFilters = () => {
    setSelectedFormat('todos');
    setSelectedGender('todos');
    setSelectedRimType('todos');
    setSelectedPriceRange('todos');
  };

  const hasActiveFilters =
    selectedFormat !== 'todos' ||
    selectedGender !== 'todos' ||
    selectedRimType !== 'todos' ||
    selectedPriceRange !== 'todos';

  return (
    <section id="catalogo" className="py-16 sm:py-20 bg-[#faf8f5] text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0c251d]/10 text-[#0c251d] text-xs font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c8a25a]" />
            <span>Coleção Completa de Armações</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0c251d] font-serif-brand">
            Óculos de Grau Completo
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600">
            Armações anatômicas para colocar qualquer tipo de grau. Clique no modelo para ver todas as medidas técnicas ou configure as lentes diretamente para fechar no WhatsApp.
          </p>
        </div>

        {/* Results Bar (Filter trigger & sorting) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 bg-[#0c251d] text-[#c8a25a] font-bold text-xs px-4 py-2 rounded-xl"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtros {hasActiveFilters && '• Ativos'}</span>
            </button>

            <span className="text-xs sm:text-sm font-semibold text-stone-600">
              Mostrando <strong className="text-stone-900">{filteredProducts.length}</strong> modelos disponíveis
            </span>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Limpar filtros</span>
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
            <span className="text-stone-500 font-medium">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 font-semibold text-stone-800 focus:outline-none focus:border-[#0c251d]"
            >
              <option value="relevance">Mais Vendidos / Destaques</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
          </div>
        </div>

        {/* Layout with Sidebar & Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Filter (Inspirado no layout de coleção da Euglasses!) */}
          <aside
            className={`lg:col-span-3 space-y-6 ${
              isMobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#c8a25a]" />
                  <span>Filtrar Armações</span>
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-stone-500 hover:text-stone-900 underline"
                  >
                    Resetar
                  </button>
                )}
              </div>

              {/* Filter 1: Formato */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
                  Formato da Armação
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'todos', label: 'Todos os formatos' },
                    { id: 'retangular', label: 'Retangular' },
                    { id: 'quadrado', label: 'Quadrado' },
                    { id: 'gatinho', label: 'Gatinho' },
                    { id: 'oval', label: 'Oval' },
                    { id: 'redondo', label: 'Redondo' },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-stone-50 text-stone-700 font-medium"
                    >
                      <input
                        type="radio"
                        name="format"
                        checked={selectedFormat === item.id}
                        onChange={() => setSelectedFormat(item.id)}
                        className="accent-[#0c251d]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter 2: Tipo de Aro */}
              <div className="pt-4 border-t border-stone-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
                  Tipo do Aro
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'todos', label: 'Todos os aros' },
                    { id: 'balgriff', label: 'Sem Aro (Balgriff / 3 Peças)' },
                    { id: 'fechado', label: 'Aro Fechado (Clássico)' },
                    { id: 'meio-aro', label: 'Meio Aro' },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-stone-50 text-stone-700 font-medium"
                    >
                      <input
                        type="radio"
                        name="rimType"
                        checked={selectedRimType === item.id}
                        onChange={() => setSelectedRimType(item.id)}
                        className="accent-[#0c251d]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter 3: Gênero */}
              <div className="pt-4 border-t border-stone-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
                  Público
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'masculino', label: 'Masc.' },
                    { id: 'feminino', label: 'Fem.' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedGender(item.id)}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition ${
                        selectedGender === item.id
                          ? 'bg-[#0c251d] text-[#c8a25a]'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 4: Faixa de Preço */}
              <div className="pt-4 border-t border-stone-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
                  Faixa de Preço
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'todos', label: 'Qualquer valor' },
                    { id: 'ate-100', label: 'Até R$ 100,00' },
                    { id: '100-140', label: 'De R$ 100 a R$ 140' },
                    { id: 'acima-140', label: 'Acima de R$ 140' },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-stone-50 text-stone-700 font-medium"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === item.id}
                        onChange={() => setSelectedPriceRange(item.id)}
                        className="accent-[#0c251d]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Consultor Callout (Inspirado no "Não conseguiu decidir?") */}
              <div className="pt-4 border-t border-stone-100 bg-amber-50/60 rounded-2xl p-4 border border-amber-200/60 text-xs">
                <strong className="text-amber-950 font-bold block mb-1">
                  Não sabe qual combina com seu rosto?
                </strong>
                <p className="text-amber-800 leading-snug mb-3">
                  Envie uma selfie ou sua receita no WhatsApp que nosso consultor óptico indica a melhor armação.
                </p>
                <button
                  onClick={() => onWhatsAppQuickAsk('Ajuda para escolher o modelo ideal')}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-2 px-3 rounded-xl transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Pedir Ajuda no Zap</span>
                </button>
              </div>

            </div>
          </aside>

          {/* Right Area: Products Grid */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4">
                <p className="text-stone-600 text-sm">
                  Nenhuma armação encontrada com os filtros selecionados.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#0c251d] text-[#c8a25a] font-bold text-xs px-5 py-2.5 rounded-xl"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const discount = Math.round(
                    ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
                  );

                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Preview with Badges */}
                        <div
                          onClick={() => onOpenProductDetail(product)}
                          className="relative aspect-[4/3] bg-stone-50 cursor-pointer overflow-hidden p-4 flex items-center justify-center"
                        >
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                            {product.isBestseller && (
                              <span className="bg-[#0c251d] text-[#c8a25a] font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                                Destaque
                              </span>
                            )}
                            {discount > 0 && (
                              <span className="bg-rose-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-full shadow-sm">
                                {discount}% OFF
                              </span>
                            )}
                          </div>

                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Quick view hover action */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                            <span className="bg-white text-stone-900 font-bold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5 text-[#c8a25a]" />
                              <span>Ver Medidas & Fotos</span>
                            </span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5">
                          {/* Frete tag as in reference */}
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-flex mb-2">
                            <Truck className="w-3 h-3 text-amber-600" />
                            <span>Entrega em até 7 dias úteis</span>
                          </div>

                          <h3
                            onClick={() => onOpenProductDetail(product)}
                            className="font-bold text-stone-900 text-base group-hover:text-[#0c251d] cursor-pointer transition line-clamp-1"
                          >
                            {product.name}
                          </h3>

                          <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                            {product.material}
                          </p>

                          {/* Color Swatches */}
                          <div className="flex items-center gap-1.5 mt-2.5">
                            <span className="text-[11px] text-stone-400 mr-1">Cores:</span>
                            {product.colors.map((c) => (
                              <span
                                key={c.name}
                                title={c.name}
                                className="w-3.5 h-3.5 rounded-full border border-black/20"
                                style={{ backgroundColor: c.hex }}
                              />
                            ))}
                            {product.colors.length > 2 && (
                              <span className="text-[10px] text-stone-400 font-medium">
                                + {product.colors.length - 2}
                              </span>
                            )}
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1 text-xs text-stone-500 mt-2">
                            <div className="flex items-center text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            </div>
                            <span className="font-semibold text-stone-700">{product.rating}</span>
                            <span>({product.reviewsCount} avaliações)</span>
                          </div>

                          {/* Price */}
                          <div className="mt-4 pt-3 border-t border-stone-100">
                            <span className="text-xs text-stone-400 line-through block">
                              De R$ {product.originalPrice.toFixed(2)}
                            </span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xl font-black text-[#0c251d]">
                                R$ {product.currentPrice.toFixed(2)}
                              </span>
                              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                                no PIX
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Buttons */}
                      <div className="p-5 pt-0 space-y-2">
                        <button
                          onClick={() => onOpenLensModal(product)}
                          className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition active:scale-95 uppercase tracking-wide"
                        >
                          <span>Comprar com Lentes</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenProductDetail(product)}
                          className="w-full flex items-center justify-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs py-2 px-3 rounded-xl transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-stone-500" />
                          <span>Ver Medidas & Detalhes</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
