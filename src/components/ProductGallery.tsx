import React, { useEffect, useRef, useState } from 'react';
import type { Product } from '../types';
import { ArrowsOut, CaretLeft, CaretRight, ImageSquare, X } from '@phosphor-icons/react';

function Photo({ src, alt, priority = false, className = '' }: { src: string; alt: string; priority?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) return <div className="flex flex-col items-center justify-center gap-3 text-stone-400 w-full h-full min-h-32"><ImageSquare size={35} aria-hidden="true" /><span className="text-xs">Foto indisponível</span></div>;
  return <img src={src} alt={alt} width={1000} height={800} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" onError={() => setFailed(true)} className={'w-full h-full object-contain ' + className} />;
}

export const ProductGallery: React.FC<{ product: Product }> = ({ product }) => {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const photos = [...product.images.map(src => ({ src, client: false })), ...(product.clientPhotos || []).map(src => ({ src, client: true }))].filter(photo => !!photo.src);
  const currentIndex = Math.min(index, Math.max(0, photos.length - 1));
  const current = photos[currentIndex];
  const move = (direction: number) => { if (photos.length > 1) setIndex(value => (value + direction + photos.length) % photos.length); };

  useEffect(() => { setIndex(0); setExpanded(false); }, [product.id]);
  useEffect(() => {
    if (!expanded) return;
    const element = dialog.current;
    if (!element) return;
    const body = element.ownerDocument.body;
    const previous = body.style.overflow;
    body.style.overflow = 'hidden';
    element.showModal();
    return () => { element.close(); body.style.overflow = previous; opener.current?.focus(); };
  }, [expanded]);

  const arrow = (direction: number, modal = false) => <button type="button" onClick={() => move(direction)} className={'product-gallery-arrow ' + (modal ? 'bg-white/90' : 'bg-white')} aria-label={direction < 0 ? 'Foto anterior' : 'Próxima foto'}>{direction < 0 ? <CaretLeft size={19} /> : <CaretRight size={19} />}</button>;

  return <section aria-label="Fotos do produto" className="min-w-0">
    <div className="relative bg-[#f1f1eb] rounded-3xl border border-[#e7e7df] overflow-hidden aspect-[5/4] sm:aspect-[4/3]">
      <div className="absolute top-4 left-4 z-10 flex gap-2">{product.isBestseller && <span className="rounded-full bg-[#173e2d] text-[#e4c889] px-3 py-1 text-[10px] font-semibold">Mais vendido</span>}{product.isPromo && <span className="rounded-full bg-white text-[#173e2d] px-3 py-1 text-[10px] font-semibold">Em promoção</span>}</div>
      <button ref={opener} type="button" disabled={!current} onClick={() => setExpanded(true)} className="w-full h-full p-5 sm:p-10 disabled:cursor-default" aria-label={'Ampliar foto de ' + product.name}>
        {current ? <Photo key={current.src} src={current.src} alt={product.name + ' — foto ' + (currentIndex + 1)} priority /> : <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-400"><ImageSquare size={40} /><span className="text-sm">Fotos em breve</span></div>}
      </button>
      {!!current && <span className="absolute bottom-4 right-4 bg-white/95 p-2 rounded-full pointer-events-none text-[#173e2d]"><ArrowsOut size={19} aria-hidden="true" /></span>}
      {photos.length > 1 && <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none"><span className="pointer-events-auto">{arrow(-1)}</span><span className="pointer-events-auto">{arrow(1)}</span></div>}
    </div>
    {photos.length > 0 && <div className="flex justify-between items-center mt-3 text-[11px] text-stone-500"><p>{current?.client ? 'Foto de cliente' : 'Fotos do modelo'} · clique para ampliar</p><p aria-live="polite">{currentIndex + 1} / {photos.length}</p></div>}
    {photos.length > 1 && <div className="flex gap-3 overflow-x-auto py-3" aria-label="Selecionar foto">{photos.map((photo, photoIndex) => <button type="button" key={photo.src + photoIndex} onClick={() => setIndex(photoIndex)} aria-label={'Ver foto ' + (photoIndex + 1) + (photo.client ? ' de cliente' : '')} aria-pressed={currentIndex === photoIndex} className={'shrink-0 rounded-xl border-2 bg-[#f5f5f0] p-1.5 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden ' + (currentIndex === photoIndex ? 'border-[#8a6b36]' : 'border-transparent hover:border-stone-300')}><Photo src={photo.src} alt="" /> </button>)}</div>}
    {expanded && <dialog ref={dialog} aria-label={'Fotos de ' + product.name} className="product-gallery-dialog" onCancel={event => { event.preventDefault(); setExpanded(false); }} onClick={event => { if (event.target === event.currentTarget) setExpanded(false); }} onKeyDown={event => { if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } if (event.key === 'ArrowRight') { event.preventDefault(); move(1); } }}>
      <div className="h-full flex flex-col"><div className="flex justify-between items-center gap-4 p-4 sm:px-6 border-b border-stone-100"><div className="min-w-0"><h2 className="text-sm font-semibold truncate">{product.name}</h2><p className="text-xs text-stone-500 mt-1">{currentIndex + 1} de {photos.length} · use as setas para navegar</p></div><button type="button" onClick={() => setExpanded(false)} aria-label="Fechar fotos" className="product-gallery-arrow"><X size={21} /></button></div><div className="flex-1 min-h-0 relative bg-[#f5f5ef] p-5 sm:p-10"><Photo key={current?.src} src={current?.src || ''} alt={product.name + ' — foto ampliada ' + (currentIndex + 1)} priority />{photos.length > 1 && <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none"><span className="pointer-events-auto">{arrow(-1,true)}</span><span className="pointer-events-auto">{arrow(1,true)}</span></div>}</div></div>
    </dialog>}
  </section>;
};
