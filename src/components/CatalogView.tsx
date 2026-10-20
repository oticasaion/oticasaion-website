import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import {
  MagnifyingGlass,
  Funnel,
  SlidersHorizontal,
  X,
  Star,
  Eye,
  ArrowLeft,
  Check,
} from '@phosphor-icons/react';
import { ImageWithFade } from './ImageWithFade';
import { WhatsAppIcon } from './WhatsAppIcon';

interface CatalogViewProps {
  products: Product[];
  onOpenProductDetail: (product: Product) => void;
  onOpenLensModal: (product: Product) => void;
  onWhatsAppClick: (customText?: string) => void;
  onBackToHome: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  onOpenProductDetail,
  onOpenLensModal,
  onWhatsAppClick,
  onBackToHome,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('todos');
  const [selectedGender, setSelectedGender] = useState('todos');
  const [selectedRimType, setSelectedRimType] = useState('todos');
  const [selectedPriceRange, setSelectedPriceRange] = useState('todos');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'rating'>('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search query
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchName = product.name.toLowerCase().includes(query);
          const matchMaterial = product.material.toLowerCase().includes(query);
          const matchShape = product.shape.toLowerCase().includes(query);
          const matchDesc = product.description.toLowerCase().includes(query);
          if (!matchName && !matchMaterial && !matchShape && !matchDesc) return false;
        }

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

        // Price range
        if (selectedPriceRange === 'ate-100' && product.currentPrice > 100) return false;
        if (selectedPriceRange === '100-140' && (product.currentPrice < 100 || product.currentPrice > 140)) return false;
        if (selectedPriceRange === 'acima-140' && product.currentPrice < 140) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.currentPrice - b.currentPrice;
        if (sortBy === 'price-desc') return b.currentPrice - a.currentPrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [products, searchTerm, selectedFormat, selectedGender, selectedRimType, selectedPriceRange, sortBy]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedFormat('todos');
    setSelectedGender('todos');
    setSelectedRimType('todos');
    setSelectedPriceRange('todos');
  };

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedFormat !== 'todos' ||
    selectedGender !== 'todos' ||
    selectedRimType !== 'todos' ||
    selectedPriceRange !== 'todos';

  return (
    <div className="bg-[#faf8f5] text-stone-900 min-h-screen pb-24 animate-fadeIn">
      {/* Top Breadcrumb & Header Banner */}
      <div className="bg-[#0c251d] text-white py-10 sm:py-14 border-b border-[#c8a25a]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs text-[#c8a25a] hover:underline font-semibold mb-4 focus-visible:ring-2 focus-visible:ring-[#c8a25a]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao início</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-semibold text-[#c8a25a] block mb-1">
                Coleção de armações e lentes
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-brand text-balance">
                Catálogo de armações & lentes
              </h1>
              <p className="mt-2 text-sm text-stone-300 max-w-xl text-pretty leading-relaxed">
                Armações de alta durabilidade em titânio e TR-90 com montagem laboratorial digital. Escolha seu modelo e monte no WhatsApp com sua receita.
              </p>
            </div>

            {/* Quick WhatsApp helper */}
            <button
              onClick={() =>
                onWhatsAppClick('Olá! Gostaria de ajuda para escolher a armação ideal para o meu grau e formato de rosto.')
              }
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-full shadow-md transition self-start md:self-auto active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
              <span>Ajuda para escolher no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Catalog Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        
        {/* Search Bar & Controls */}
        <div className="bg-white rounded-2xl border border-stone-200 p-3 sm:p-4 mb-6 sm:mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <MagnifyingGlass className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por modelo, material ou formato..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#0c251d]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Actions (Mobile filter, result counter, sort) */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* Filter Toggle Mobile */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-[#0c251d] text-[#c8a25a] font-semibold text-xs px-3.5 py-2.5 rounded-xl active:scale-95 focus-visible:ring-2 focus-visible:ring-[#c8a25a]"
            >
              <Funnel className="w-3.5 h-3.5" />
              <span>Filtros {hasActiveFilters && '• (Ativo)'}</span>
            </button>

            <span className="text-xs sm:text-sm font-medium text-stone-500 whitespace-nowrap">
              <strong className="text-stone-900 font-bold">{filteredProducts.length}</strong> modelo(s)
            </span>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-500 hidden sm:inline">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-[#0c251d]"
              >
                <option value="relevance">Mais relevantes</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="rating">Melhor avaliação</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-5">
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#c8a25a]" />
                  <span>Filtros aplicados</span>
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-stone-500 hover:text-stone-900 underline"
                  >
                    Limpar todos
                  </button>
                )}
              </div>

              {/* Formato */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Formato da armação
                </label>
                <div className="space-y-1">
                  {[
                    { id: 'todos', label: 'Todos os formatos' },
                    { id: 'retangular', label: 'Retangular' },
                    { id: 'redondo', label: 'Redondo' },
                    { id: 'quadrado', label: 'Quadrado' },
                    { id: 'gatinho', label: 'Gatinho' },
                    { id: 'aviador', label: 'Aviador' },
                    { id: 'oval', label: 'Oval' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFormat(f.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                        selectedFormat === f.id
                          ? 'bg-[#0c251d] text-[#c8a25a] font-bold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span>{f.label}</span>
                      {selectedFormat === f.id && <Check className="w-3.5 h-3.5 text-[#c8a25a]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gênero */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Gênero
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'unissex', label: 'Unissex' },
                    { id: 'feminino', label: 'Feminino' },
                    { id: 'masculino', label: 'Masculino' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGender(g.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium text-center transition ${
                        selectedGender === g.id
                          ? 'bg-[#0c251d] text-[#c8a25a] font-bold'
                          : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo de Aro */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Tipo de aro
                </label>
                <div className="space-y-1">
                  {[
                    { id: 'todos', label: 'Todos os aros' },
                    { id: 'fechado', label: 'Aro fechado (Clássico)' },
                    { id: 'balgriff', label: 'Balgriff (Sem aro)' },
                    { id: 'meio-aro', label: 'Meio aro (Fio de nylon)' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRimType(r.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                        selectedRimType === r.id
                          ? 'bg-[#0c251d] text-[#c8a25a] font-bold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span>{r.label}</span>
                      {selectedRimType === r.id && <Check className="w-3.5 h-3.5 text-[#c8a25a]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Faixa de Preço */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Faixa de preço
                </label>
                <div className="space-y-1">
                  {[
                    { id: 'todos', label: 'Qualquer valor' },
                    { id: 'ate-100', label: 'Até R$ 100,00' },
                    { id: '100-140', label: 'R$ 100,00 a R$ 140,00' },
                    { id: 'acima-140', label: 'Acima de R$ 140,00' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPriceRange(p.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                        selectedPriceRange === p.id
                          ? 'bg-[#0c251d] text-[#c8a25a] font-bold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span>{p.label}</span>
                      {selectedPriceRange === p.id && <Check className="w-3.5 h-3.5 text-[#c8a25a]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 sm:p-16 border border-stone-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                  <MagnifyingGlass className="w-8 h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-serif-brand text-stone-900">
                  Nenhuma armação encontrada com esses filtros
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                  Tente alterar os termos de busca ou limpar os filtros para ver todas as opções disponíveis.
                </p>
                <div className="pt-2 flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={clearAllFilters}
                    className="bg-[#0c251d] text-[#c8a25a] text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm"
                  >
                    Limpar todos os filtros
                  </button>
                  <button
                    onClick={() =>
                      onWhatsAppClick(
                        `Olá! Procurei no catálogo por "${searchTerm || 'um modelo específico'}" e não encontrei. Vocês conseguem sob encomenda?`
                      )
                    }
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>Consultar encomenda no WhatsApp</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredProducts.map((product) => {
                  const pixPrice = product.currentPrice * (1 - product.pixDiscountPercent / 100);
                  const installmentVal = (product.currentPrice / 12).toFixed(2);

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                    >
                      {/* Product Image & Badges */}
                      <div className="relative bg-stone-50 p-4 sm:p-5 flex items-center justify-center overflow-hidden border-b border-stone-100">
                        {/* Badges in normalcase */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                          {product.isBestseller && (
                            <span className="bg-[#0c251d] text-[#c8a25a] text-xs font-medium px-2.5 py-0.5 rounded-full shadow-sm">
                              Mais vendido
                            </span>
                          )}
                          {product.isPromo && (
                            <span className="bg-rose-600 text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
                              Promoção
                            </span>
                          )}
                        </div>

                        {/* Image with gentle fade-in */}
                        <div
                          onClick={() => onOpenProductDetail(product)}
                          className="w-full h-48 sm:h-52 cursor-pointer flex items-center justify-center overflow-hidden rounded-xl"
                        >
                          <ImageWithFade
                            src={product.images[0]}
                            alt={product.name}
                            containerClassName="w-full h-full flex items-center justify-center"
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-xl"
                          />
                        </div>

                        {/* Floating Quick View Eye */}
                        <button
                          onClick={() => onOpenProductDetail(product)}
                          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md hover:bg-white text-stone-800 p-2 rounded-xl shadow-md transition active:scale-90"
                          title="Ver detalhes da armação"
                          aria-label={`Ver detalhes da armação ${product.name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          {/* Rating & Gender */}
                          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-semibold text-stone-700">{product.rating}</span>
                              <span className="text-xs text-stone-400">({product.reviewsCount})</span>
                            </div>
                            <span className="text-xs font-medium capitalize bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                              {product.gender}
                            </span>
                          </div>

                          {/* Product Title */}
                          <h3
                            onClick={() => onOpenProductDetail(product)}
                            className="font-serif-brand font-bold text-base sm:text-lg text-stone-900 group-hover:text-[#0c251d] transition cursor-pointer leading-snug line-clamp-1"
                          >
                            {product.name}
                          </h3>

                          {/* Material */}
                          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                            {product.material}
                          </p>

                          {/* Technical dimensions preview */}
                          <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                            <span>Aro: <strong>{product.dimensions.lensWidth}mm</strong></span>
                            <span>Ponte: <strong>{product.dimensions.bridgeWidth}mm</strong></span>
                            <span>Haste: <strong>{product.dimensions.templeLength}mm</strong></span>
                          </div>
                        </div>

                        {/* Pricing and Action Buttons */}
                        <div className="pt-2 border-t border-stone-100 space-y-3">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs text-stone-400 line-through">
                                R$ {product.originalPrice.toFixed(2)}
                              </span>
                              <span className="text-lg sm:text-xl font-black text-[#0c251d]">
                                R$ {pixPrice.toFixed(2)}
                              </span>
                              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                no PIX
                              </span>
                            </div>
                            <span className="text-xs text-stone-500 block mt-0.5">
                              ou 12x de R$ {installmentVal} sem juros
                            </span>
                          </div>

                          {/* Card Action Buttons (Direct to WhatsApp or Details) */}
                          <div className={product.lensesEnabled === false ? 'grid grid-cols-1' : 'grid grid-cols-2 gap-2'}>
                            <button
                              onClick={() => onOpenProductDetail(product)}
                              className="w-full flex items-center justify-center gap-1 border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold py-2.5 px-2 rounded-xl transition active:scale-95 text-center"
                            >
                              <span>Ver detalhes</span>
                            </button>

                            {product.lensesEnabled !== false && <button
                              onClick={() => onOpenLensModal(product)}
                              className="w-full flex items-center justify-center gap-1 bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white text-xs font-semibold py-2.5 px-2 rounded-xl transition shadow-md shadow-amber-700/20 active:scale-95 text-center focus-visible:ring-2 focus-visible:ring-amber-500"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                              <span>Pedir no Zap</span>
                            </button>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white ml-auto h-full p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#0c251d]" />
                  <span className="text-sm font-bold text-stone-900">
                    Filtrar catálogo
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-800"
                  aria-label="Fechar filtros"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Formato */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Formato da armação
                </label>
                <div className="space-y-1">
                  {[
                    { id: 'todos', label: 'Todos os formatos' },
                    { id: 'retangular', label: 'Retangular' },
                    { id: 'redondo', label: 'Redondo' },
                    { id: 'quadrado', label: 'Quadrado' },
                    { id: 'gatinho', label: 'Gatinho' },
                    { id: 'aviador', label: 'Aviador' },
                    { id: 'oval', label: 'Oval' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedFormat(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                        selectedFormat === item.id
                          ? 'bg-[#0c251d] text-[#c8a25a] font-bold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {selectedFormat === item.id && <Check className="w-3.5 h-3.5 text-[#c8a25a]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo do Aro */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Tipo do aro
                </label>
                <div className="space-y-1">
                  {[
                    { id: 'todos', label: 'Todos os aros' },
                    { id: 'balgriff', label: 'Sem aro (Balgriff / 3 peças)' },
                    { id: 'fechado', label: 'Aro fechado (Clássico)' },
                    { id: 'meio-aro', label: 'Meio aro' },
                  ].map((rim) => (
                    <button
                      key={rim.id}
                      onClick={() => setSelectedRimType(rim.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                        selectedRimType === rim.id
                          ? 'bg-[#0c251d] text-[#c8a25a] font-bold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span>{rim.label}</span>
                      {selectedRimType === rim.id && <Check className="w-3.5 h-3.5 text-[#c8a25a]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gênero */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Gênero
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'unissex', label: 'Unissex' },
                    { id: 'feminino', label: 'Feminino' },
                    { id: 'masculino', label: 'Masculino' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGender(g.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium text-center ${
                        selectedGender === g.id
                          ? 'bg-[#0c251d] text-[#c8a25a] font-bold'
                          : 'bg-stone-50 text-stone-700 border border-stone-200'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Faixa de Preço */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Faixa de preço
                </label>
                <div className="space-y-1">
                  {[
                    { id: 'todos', label: 'Qualquer valor' },
                    { id: 'ate-100', label: 'Até R$ 100,00' },
                    { id: '100-140', label: 'R$ 100,00 a R$ 140,00' },
                    { id: 'acima-140', label: 'Acima de R$ 140,00' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPriceRange(p.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                        selectedPriceRange === p.id
                          ? 'bg-[#0c251d] text-[#c8a25a] font-bold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span>{p.label}</span>
                      {selectedPriceRange === p.id && <Check className="w-3.5 h-3.5 text-[#c8a25a]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-[#0c251d] text-[#c8a25a] font-bold text-xs py-3 rounded-xl shadow-md text-center"
              >
                Ver {filteredProducts.length} resultados
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    clearAllFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full text-center text-xs font-medium text-rose-600 py-2 hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
