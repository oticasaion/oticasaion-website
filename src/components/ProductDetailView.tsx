import React, { useEffect, useId, useRef, useState } from 'react';
import type { LensOption, Product } from '../types';
import { PRODUCTS } from '../data/products';
import { ArrowLeft, ArrowRight, Check, CreditCard, Eyeglasses, Package, Ruler, ShieldCheck, Star, Truck } from '@phosphor-icons/react';
import { ProductGallery } from './ProductGallery';
import { WhatsAppIcon } from './WhatsAppIcon';
import { currency, formatCep, normalizeCep, productInquiry, productPricing } from '../lib/productPresentation';

interface ProductDetailViewProps {
  product: Product;
  lensOptions?: LensOption[];
  allProducts?: Product[];
  onBackToCatalog: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenLensModal: (product: Product, colorIndex?: number) => void;
  onWhatsAppClick: (message?: string) => void;
}
const plainClick = (event: React.MouseEvent) => !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, lensOptions, allProducts = PRODUCTS, onBackToCatalog, onSelectProduct, onOpenLensModal, onWhatsAppClick }) => {
  const [colorIndex, setColorIndex] = useState(0);
  const [cep, setCep] = useState('');
  const [cepError, setCepError] = useState('');
  const cepInput = useRef<HTMLInputElement>(null);
  const uid = useId();
  const price = productPricing(product, lensOptions);
  const selectedColorIndex = product.colors[colorIndex] ? colorIndex : 0;
  const selectedColor = product.colors[selectedColorIndex];
  const related = allProducts.filter(p => p.id !== product.id)
    .sort((a,b) => Number(b.shape === product.shape) - Number(a.shape === product.shape)).slice(0,4);
  const measures = [
    ['Largura da lente', product.dimensions.lensWidth],
    ['Altura da lente', product.dimensions.lensHeight],
    ['Ponte', product.dimensions.bridgeWidth],
    ['Frente total', product.dimensions.totalFront],
    ['Comprimento da haste', product.dimensions.templeLength],
  ] as const;
  const specs = [
    ['Material da frente', product.specs.materialFront || product.material],
    ['Material das hastes', product.specs.materialTemple],
    ['Tipo de aro', product.rimType],
    ['Plaquetas nasais', product.specs.nosePads],
    ['Mola nas hastes', product.specs.springHinges],
    ['Estilo', product.specs.style],
  ].filter(([, value]) => value?.trim());

  useEffect(() => { setColorIndex(0); setCep(''); setCepError(''); }, [product.id]);

  const configure = () => onOpenLensModal(product, selectedColorIndex);
  const consultShipping = (event: React.FormEvent) => {
    event.preventDefault();
    if (normalizeCep(cep).length !== 8) {
      setCepError('Informe um CEP com 8 dígitos para consultar a entrega.');
      cepInput.current?.focus();
      return;
    }
    setCepError('');
    onWhatsAppClick(productInquiry(product, selectedColorIndex, 'shipping', cep));
  };

  return <article className="product-page bg-[#fcfbf9] text-[#18392d]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
      <nav aria-label="Caminho do produto" className="flex items-center gap-2 text-xs text-stone-500 min-w-0">
        <a href="#/catalogo" onClick={event => { if (plainClick(event)) { event.preventDefault(); onBackToCatalog(); } }} className="inline-flex items-center gap-2 hover:text-[#18392d] shrink-0"><ArrowLeft size={15} aria-hidden="true" /> Catálogo</a><span aria-hidden="true">/</span><span aria-current="page" className="truncate">{product.name || 'Produto'}</span>
      </nav>
      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-7 lg:gap-14 items-start mt-6">
        <div className="min-w-0 lg:sticky lg:top-28"><ProductGallery key={product.id} product={product} /><p className="text-[11px] leading-relaxed text-stone-500 mt-3">As cores podem variar conforme a iluminação e a tela. Confirme os detalhes com nosso atendimento.</p></div>
        <section className="min-w-0" aria-labelledby={'product-title-' + uid}>
          <div className="flex flex-wrap gap-2 items-center mb-4"><span className="text-[10px] tracking-[.18em] font-semibold uppercase text-[#7d6946]">Óticas Aion</span>{product.gender && <span className="text-[10px] capitalize rounded-full bg-[#eef0e8] px-2.5 py-1 text-[#5f7056]">{product.gender}</span>}</div>
          <h1 id={'product-title-' + uid} className="text-3xl sm:text-4xl lg:text-[2.5rem] font-semibold tracking-tight leading-[1.1] text-balance break-words">{product.name || 'Nome do produto'}</h1>
          <p className="text-sm text-stone-500 mt-4">{[product.material, product.shape].filter(Boolean).join(' · ')}</p>
          {product.reviewsCount > 0 ? <div className="flex items-center gap-2 mt-4 text-xs"><span className="flex gap-0.5 text-[#9e762f]" aria-hidden="true">{Array.from({length:5},(_,i) => <Star key={i} size={13} weight={i < Math.round(product.rating) ? 'fill' : 'regular'} />)}</span><span>{new Intl.NumberFormat('pt-BR',{maximumFractionDigits:1}).format(product.rating)} · {product.reviewsCount} avaliações</span></div> : <p className="text-xs text-stone-500 mt-4">Novo no catálogo</p>}
          <div className="mt-6 border-y border-stone-200 py-6">
            <p className="text-xs font-medium text-stone-500 mb-2">Somente a armação</p>
            {price.previous !== null && <p className="text-xs text-stone-400 mb-1"><span className="sr-only">Preço anterior: </span><del>{currency(price.previous)}</del></p>}
            <div className="flex flex-wrap items-end gap-3"><strong className="text-4xl sm:text-[2.65rem] font-semibold tracking-tight tabular-nums">{currency(price.pix)}</strong><span className="text-xs text-[#45613c] pb-1.5">no Pix{price.discount > 0 ? ' · ' + price.discount + '% de desconto' : ''}</span></div>
            <p className="text-xs text-stone-500 mt-3">{currency(price.frame)} antes do desconto Pix. Consulte as condições de parcelamento.</p>
            {price.completePix !== null && <div className="rounded-xl bg-[#eef1e8] px-4 py-3 mt-5 flex items-start gap-3"><Eyeglasses size={21} className="shrink-0 text-[#61754e]" aria-hidden="true" /><div><p className="text-xs font-medium">Armação + lentes com grau a partir de {currency(price.completePix)} no Pix</p><p className="text-[11px] text-stone-500 mt-1 leading-relaxed">O total depende da lente escolhida. Confira no configurador e envie sua receita para análise.</p></div></div>}
          </div>
          {product.colors.length > 0 && <fieldset className="mt-6"><legend className="text-xs font-medium mb-3">Cor: <span className="font-semibold">{selectedColor?.name}</span></legend><div className="flex flex-wrap gap-2">{product.colors.map((color,index) => <label key={color.name + index} className={'cursor-pointer flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs min-h-11 transition-colors ' + (index === selectedColorIndex ? 'border-[#173e2d] bg-[#eef1e8]' : 'border-stone-200 bg-white hover:border-stone-400')}><input type="radio" name={'product-color-' + uid} value={index} checked={index === selectedColorIndex} onChange={() => setColorIndex(index)} className="sr-only peer" /><span aria-hidden="true" className="w-4 h-4 rounded-full border border-black/15 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#a8843d]" style={{backgroundColor:color.hex}} /><span>{color.name}</span>{index === selectedColorIndex && <Check size={14} aria-hidden="true" />}</label>)}</div></fieldset>}
          <div className="mt-6 space-y-3">
            <button type="button" onClick={configure} className="product-primary w-full"><Eyeglasses size={21} aria-hidden="true" /> Escolher lentes e montar meus óculos <ArrowRight size={17} aria-hidden="true" /></button>
            <button type="button" onClick={() => onWhatsAppClick(productInquiry(product,selectedColorIndex,'frame'))} className="product-secondary w-full"><WhatsAppIcon className="w-4 h-4" /> Pedir somente a armação</button>
            <p className="text-[11px] text-stone-500 text-center leading-relaxed">Você confere tudo antes de concluir o pedido pelo WhatsApp.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-stone-200 text-center">{[
            {icon:ShieldCheck,title:'Adaptação',text:'Consulte as garantias'},
            {icon:Truck,title:'Envio nacional',text:'Prazo por endereço'},
            {icon:CreditCard,title:'Pagamento',text:'Pix ou cartão'},
          ].map(item => <div key={item.title} className="flex flex-col items-center"><item.icon size={20} className="text-[#7a8969] mb-2" aria-hidden="true" /><p className="text-[11px] font-medium">{item.title}</p><p className="text-[10px] text-stone-500 mt-1">{item.text}</p></div>)}</div>
          <form onSubmit={consultShipping} noValidate className="mt-7 p-4 rounded-2xl border border-stone-200 bg-white">
            <label htmlFor={'product-cep-' + uid} className="text-xs font-medium flex gap-2 items-center mb-3"><Truck size={16} aria-hidden="true" /> Consulte entrega para seu endereço</label>
            <div className="flex gap-2"><input ref={cepInput} id={'product-cep-' + uid} name="postal-code" autoComplete="postal-code" inputMode="numeric" maxLength={9} placeholder="00000-000" value={cep} onChange={e => { setCep(formatCep(e.target.value)); setCepError(''); }} aria-invalid={!!cepError} aria-describedby={'product-cep-help-' + uid} className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-[#fafbf8] px-3 py-2.5 text-base" /><button type="submit" className="rounded-xl bg-[#eef1e8] hover:bg-[#e2e8d9] text-[#25432e] px-4 text-xs font-semibold">Consultar</button></div>
            <p id={'product-cep-help-' + uid} className={'text-[11px] leading-relaxed mt-2 ' + (cepError ? 'text-red-700' : 'text-stone-500')} role={cepError ? 'alert' : undefined}>{cepError || 'O atendimento confirma o frete e o prazo pelo WhatsApp. Lentes com grau também passam pela etapa de confecção.'}</p>
          </form>
          <button type="button" onClick={() => onWhatsAppClick(productInquiry(product,selectedColorIndex,'help'))} className="mt-5 text-xs font-medium underline underline-offset-4 hover:text-[#8a6b36]">Precisa de ajuda com o modelo ou a receita?</button>
        </section>
      </div>

      <section aria-labelledby={'product-details-' + uid} className="mt-12 sm:mt-16 border-t border-stone-200 pt-9">
        <div className="mb-6"><p className="text-[10px] uppercase tracking-[.18em] text-[#7d6946] font-semibold">Conheça o modelo</p><h2 id={'product-details-' + uid} className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">Detalhes para escolher com confiança</h2></div>
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
          <div className="space-y-3">
            <details open className="product-disclosure"><summary><span>Sobre a armação</span><span aria-hidden="true">+</span></summary><div className="px-5 pb-5 text-sm text-stone-600 leading-relaxed whitespace-pre-line break-words">{product.description || 'A descrição deste modelo está em atualização. Fale com nosso atendimento para conhecer os detalhes.'}</div></details>
            {specs.length > 0 && <details className="product-disclosure"><summary><span>Ficha técnica</span><span aria-hidden="true">+</span></summary><dl className="px-5 pb-5 divide-y divide-stone-100">{specs.map(([label,value]) => <div key={label} className="grid grid-cols-2 gap-3 py-3 text-xs"><dt className="text-stone-500">{label}</dt><dd className="font-medium text-right break-words">{value}</dd></div>)}</dl></details>}
            {product.includedItems.length > 0 && <details className="product-disclosure"><summary><span>O que acompanha seu pedido</span><Package size={17} aria-hidden="true" /></summary><ul className="px-5 pb-5 space-y-3">{product.includedItems.map((item,index) => <li key={index} className="flex items-start gap-2 text-xs text-stone-600"><Check size={15} className="text-[#61754e] shrink-0" aria-hidden="true" />{item}</li>)}</ul></details>}
            <a href="#/politicas/garantia" className="flex items-center gap-2 text-xs text-stone-500 px-1 py-2 hover:text-[#18392d]"><ShieldCheck size={16} aria-hidden="true" /> Consulte trocas, garantias e condições de adaptação <ArrowRight size={14} aria-hidden="true" /></a>
          </div>
          <section className="rounded-2xl bg-[#f0f1e9] p-5 sm:p-7" aria-label="Medidas da armação">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Ruler size={18} aria-hidden="true" /> Encontre o encaixe ideal</h3><p className="text-xs text-stone-500 mt-2 leading-relaxed">Compare as medidas com uma armação que já veste bem em você. Todas as medidas abaixo estão em milímetros.</p>
            <svg viewBox="0 0 360 120" className="w-full max-w-sm mx-auto my-5 text-[#849070]" fill="none" aria-hidden="true"><path d="M37 47Q39 32 60 32H133Q150 32 150 48L146 78Q144 96 126 96H65Q47 96 43 78ZM210 48Q210 32 227 32H300Q321 32 323 47L317 78Q313 96 295 96H234Q216 96 214 78ZM150 48Q180 37 210 48M37 47L14 42M323 47L346 42" stroke="currentColor" strokeWidth="3" /><path d="M45 111H145M214 111H317M156 61H204" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" /></svg>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">{measures.filter(([,value]) => value > 0).map(([label,value]) => <div key={label} className="bg-white/70 rounded-xl p-3"><dt className="text-[10px] text-stone-500">{label}</dt><dd className="mt-2 text-xl font-semibold tabular-nums">{new Intl.NumberFormat('pt-BR').format(value)}<span className="text-[10px] font-normal text-stone-500 ml-1">mm</span></dd></div>)}</dl>
            {!measures.some(([,value]) => value > 0) && <p className="text-xs text-stone-500">Medidas ainda não informadas.</p>}
            <button type="button" onClick={() => onWhatsAppClick(productInquiry(product,selectedColorIndex,'help'))} className="mt-5 text-xs font-semibold underline underline-offset-4">Quero ajuda para conferir as medidas</button>
          </section>
        </div>
      </section>
      {related.length > 0 && <section className="mt-12 sm:mt-16 mb-8" aria-label="Outras armações"><div className="flex justify-between items-center gap-4 mb-5"><h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Outros modelos para conhecer</h2><a href="#/catalogo" onClick={event => { if (plainClick(event)) { event.preventDefault(); onBackToCatalog(); } }} className="text-xs font-medium shrink-0 hover:underline">Ver catálogo →</a></div><div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">{related.map(item => <a key={item.id} href={'#/produto?id=' + encodeURIComponent(item.id)} onClick={event => { if (plainClick(event)) { event.preventDefault(); onSelectProduct(item); } }} className="group min-w-0"><div className="bg-[#f1f1eb] rounded-2xl overflow-hidden aspect-[5/4] p-3 sm:p-5 border border-transparent group-hover:border-[#c3cbb7] transition-colors">{item.images[0] ? <img src={item.images[0]} width={400} height={320} loading="lazy" decoding="async" alt={item.name} className="w-full h-full object-contain" /> : <div className="h-full flex items-center justify-center text-xs text-stone-400">Foto em breve</div>}</div><h3 className="text-xs sm:text-sm font-medium mt-3 break-words">{item.name}</h3><p className="text-sm font-semibold mt-1">{currency(productPricing(item).pix)}<span className="text-[10px] text-stone-500 font-normal ml-1">no Pix</span></p></a>)}</div></section>}
    </div>
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 pt-3 product-mobile-buy">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3"><div className="min-w-0"><p className="text-[10px] text-stone-500">Armação no Pix</p><p className="text-lg font-semibold tabular-nums">{currency(price.pix)}</p></div><button type="button" onClick={configure} className="product-primary text-xs px-4 py-3">Escolher lentes <ArrowRight size={16} aria-hidden="true" /></button></div>
    </div>
  </article>;
};
