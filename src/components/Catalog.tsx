import React, { useState } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import {
  Star,
  Eye,
  SlidersHorizontal,
  ArrowRight,
  Funnel,
  X,
  Truck,
} from '@phosphor-icons/react';
import { ImageWithFade } from './ImageWithFade';
import { WhatsAppIcon } from './WhatsAppIcon';

interface CatalogProps {
  products?: Product[];
  onOpenProductDetail: (product: Product) => void;
  onOpenLensModal: (product: Product) => void;
  onWhatsAppQuickAsk: (productName: string) => void;
  title?: string;
  subtitle?: string;
}

export const Catalog: React.FC<CatalogProps> = ({
  products = PRODUCTS,
  onOpenProductDetail,
  onOpenLensModal,
  onWhatsAppQuickAsk,
  title = 'Óculos de grau completo',
  subtitle = 'Selecione um modelo para ver fotos e medidas.',
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('todos');
  const [selectedGender, setSelectedGender] = useState<string>('todos');
  const [selectedRimType, setSelectedRimType] = useState<string>('todos');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters logic
  const listToFilter = products && products.length > 0 ? products : PRODUCTS;
  const filteredProducts = listToFilter.filter((product) => {
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
    <section id="catalogo" className="py-16 sm:py-20 lg:py-24 bg-[#faf8f5] text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Clean, editorial, without redundant AI badge */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0c251d] font-serif-brand tracking-tight text-balance">
            {title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 px-2 text-pretty leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Results Bar (Filter trigger & sorting) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-3 sm:p-4 mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-[#0c251d] text-[#c8a25a] font-semibold text-xs px-3.5 py-2 rounded-xl active:scale-95 focus-visible:ring-2 focus-visible:ring-[#c8a25a]"
            >
              <Funnel className="w-3.5 h-3.5" />
              <span>Filtrar {hasActiveFilters && '• (Ativo)'}</span>
            </button>

            <span className="text-xs sm:text-sm font-medium text-stone-600">
              <strong className="text-stone-900 font-bold">{filteredProducts.length}</strong> modelos disponíveis
            </span>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Limpar filtros</span>
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-stone-500 font-medium">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-[#0c251d]"
            >
              <option value="relevance">Mais relevantes</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout (Sidebar Filters + Products Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Desktop Left Sidebar Filter */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#c8a25a]" />
                  <span>Filtrar armações</span>
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-stone-500 hover:text-stone-900 underline"
                  >
                    Redefinir
                  </button>
                )}
              </div>

              {/* Filter 1: Formato */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2.5">
                  Formato da armação
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
                        name="desktop-format"
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
                <label className="block text-xs font-semibold text-stone-700 mb-2.5">
                  Tipo do aro
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'todos', label: 'Todos os aros' },
                    { id: 'balgriff', label: 'Sem aro (Balgriff / 3 peças)' },
                    { id: 'fechado', label: 'Aro fechado (Clássico)' },
                    { id: 'meio-aro', label: 'Meio aro' },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-stone-50 text-stone-700 font-medium"
                    >
                      <input
                        type="radio"
                        name="desktop-rimType"
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
                <label className="block text-xs font-semibold text-stone-700 mb-2.5">
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
                <label className="block text-xs font-semibold text-stone-700 mb-2.5">
                  Faixa de preço
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
                        name="desktop-priceRange"
                        checked={selectedPriceRange === item.id}
                        onChange={() => setSelectedPriceRange(item.id)}
                        className="accent-[#0c251d]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Consultor Callout */}
              <div className="pt-4 border-t border-stone-100 bg-amber-50/60 rounded-2xl p-4 border border-amber-200/60 text-xs">
                <strong className="text-amber-950 font-bold block mb-1">
                  Dúvida sobre o modelo ideal?
                </strong>
                <p className="text-amber-800 leading-snug mb-3">
                  Envie uma foto ou sua receita no WhatsApp que nosso consultor óptico recomenda a armação ideal.
                </p>
                <button
                  onClick={() => onWhatsAppQuickAsk('Ajuda para escolher o modelo ideal')}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold py-2.5 px-3 rounded-xl transition shadow-sm active:scale-95"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Pedir ajuda no WhatsApp</span>
                </button>
              </div>

            </div>
          </aside>

          {/* Right Area: Products Grid - 2 columns on mobile, 3 on desktop */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center space-y-4">
                <p className="text-stone-600 text-sm">
                  Nenhuma armação encontrada com os filtros selecionados.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#0c251d] text-[#c8a25a] font-semibold text-xs px-5 py-2.5 rounded-xl"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {filteredProducts.map((product) => {
                  const discount = Math.round(
                    ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
                  );

                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl sm:rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Preview with Badges */}
                        <div
                          onClick={() => onOpenProductDetail(product)}
                          className="relative aspect-square sm:aspect-[4/3] bg-stone-50 cursor-pointer overflow-hidden p-2 sm:p-4 flex items-center justify-center"
                        >
                          {/* Badges in normal case */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                            {product.isBestseller && (
                              <span className="bg-[#0c251d] text-[#c8a25a] font-medium text-[9px] sm:text-xs px-2 py-0.5 rounded-full shadow-sm">
                                Mais vendido
                              </span>
                            )}
                            {discount > 0 && (
                              <span className="bg-rose-600 text-white font-medium text-[9px] sm:text-xs px-2 py-0.5 rounded-full shadow-sm">
                                {discount}% OFF
                              </span>
                            )}
                          </div>

                          <ImageWithFade
                            src={product.images[0]}
                            alt={product.name}
                            containerClassName="w-full h-full flex items-center justify-center"
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Quick view hover action on desktop */}
                          <div className="hidden sm:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-2 p-4">
                            <span className="bg-white text-stone-900 font-semibold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5 text-[#c8a25a]" />
                              <span>Ver fotos e medidas</span>
                            </span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-3 sm:p-5">
                          {/* Delivery info */}
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md inline-flex mb-2 truncate max-w-full">
                            <Truck className="w-3 h-3 text-amber-600 shrink-0" />
                            <span className="truncate">Entrega em até 7 dias<span className="hidden sm:inline"> úteis</span></span>
                          </div>

                          <h3
                            onClick={() => onOpenProductDetail(product)}
                            className="font-bold text-stone-900 text-xs sm:text-base group-hover:text-[#0c251d] cursor-pointer transition line-clamp-1"
                          >
                            {product.name}
                          </h3>

                          <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 line-clamp-1">
                            {product.material}
                          </p>

                          {/* Color Swatches */}
                          <div className="flex items-center gap-1 mt-2">
                            {product.colors.map((c) => (
                              <span
                                key={c.name}
                                title={c.name}
                                className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border border-black/20"
                                style={{ backgroundColor: c.hex }}
                              />
                            ))}
                            {product.colors.length > 2 && (
                              <span className="text-[10px] text-stone-400 font-medium">
                                +{product.colors.length - 2}
                              </span>
                            )}
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-stone-500 mt-2">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                            <span className="font-semibold text-stone-700">{product.rating}</span>
                            <span className="hidden xs:inline">({product.reviewsCount} avaliações)</span>
                          </div>

                          {/* Price */}
                          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-stone-100">
                            <span className="text-xs text-stone-400 line-through block">
                              De R$ {product.originalPrice.toFixed(2)}
                            </span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="text-base sm:text-xl font-black text-[#0c251d]">
                                R$ {product.currentPrice.toFixed(2)}
                              </span>
                              <span className="text-[10px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                                no PIX
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Buttons */}
                      <div className="p-2.5 sm:p-5 pt-0 space-y-1.5 sm:space-y-2">
                        <button
                          onClick={() => onOpenLensModal(product)}
                          className="w-full flex items-center justify-center gap-1 bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-bold text-[11px] xs:text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-3 rounded-xl shadow-md transition active:scale-95 text-center focus-visible:ring-2 focus-visible:ring-amber-500 whitespace-nowrap"
                        >
                          <span>Comprar com grau</span>
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                        </button>

                        <button
                          onClick={() => onOpenProductDetail(product)}
                          className="w-full flex items-center justify-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-[11px] xs:text-xs py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl transition"
                        >
                          <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-500 shrink-0" />
                          <span>Ver detalhes</span>
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

      {/* Mobile Filters Drawer / Bottom Sheet */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#c8a25a]" />
                <span>Filtrar modelos</span>
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200"
                aria-label="Fechar filtros"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Format Filter */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Formato da armação
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'todos', label: 'Todos os formatos' },
                  { id: 'retangular', label: 'Retangular' },
                  { id: 'quadrado', label: 'Quadrado' },
                  { id: 'gatinho', label: 'Gatinho' },
                  { id: 'oval', label: 'Oval' },
                  { id: 'redondo', label: 'Redondo' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedFormat(item.id)}
                    className={`py-2 px-3 rounded-xl font-semibold text-left transition ${
                      selectedFormat === item.id
                        ? 'bg-[#0c251d] text-[#c8a25a]'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Rim Filter */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Tipo do aro
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'todos', label: 'Todos os aros' },
                  { id: 'balgriff', label: 'Sem aro (Balgriff / 3 peças)' },
                  { id: 'fechado', label: 'Aro fechado (Clássico)' },
                  { id: 'meio-aro', label: 'Meio aro' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedRimType(item.id)}
                    className={`w-full py-2 px-3 rounded-xl font-semibold text-left transition ${
                      selectedRimType === item.id
                        ? 'bg-[#0c251d] text-[#c8a25a]'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Gender Filter */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Público
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'masculino', label: 'Masc.' },
                  { id: 'feminino', label: 'Fem.' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedGender(item.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition text-center ${
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

            {/* Mobile Price Range Filter */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Faixa de preço
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'todos', label: 'Qualquer valor' },
                  { id: 'ate-100', label: 'Até R$ 100,00' },
                  { id: '100-140', label: 'De R$ 100 a R$ 140' },
                  { id: 'acima-140', label: 'Acima de R$ 140' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPriceRange(item.id)}
                    className={`w-full py-2 px-3 rounded-xl font-semibold text-left transition ${
                      selectedPriceRange === item.id
                        ? 'bg-[#0c251d] text-[#c8a25a]'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="pt-2 flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 px-4 rounded-xl border border-stone-300 font-semibold text-xs text-stone-700"
                >
                  Limpar
                </button>
              )}
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0c251d] text-[#c8a25a] font-bold text-xs shadow-md text-center"
              >
                Ver {filteredProducts.length} resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
