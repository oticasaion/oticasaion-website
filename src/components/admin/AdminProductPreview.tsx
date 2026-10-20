import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Product } from '../../types';
import { ProductDetailView } from '../ProductDetailView';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { LensSelectorModal } from '../LensSelectorModal';
import { ArrowsIn, ArrowsOut, Desktop, DeviceMobile, Eye, X } from '@phosphor-icons/react';

const emptyImage = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450"><rect width="100%" height="100%" fill="#f0f1ec"/><text x="50%" y="50%" text-anchor="middle" fill="#7b8478" font-family="sans-serif" font-size="20">Adicione uma foto do produto</text></svg>');
const frameHtml = '<!doctype html><html lang="pt-BR"><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Prévia do produto</title></head><body style="margin:0"><div id="product-preview-root"></div></body></html>';
export type PreviewDevice = 'mobile' | 'desktop';
export const previewViewport = (device: PreviewDevice) => device === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 900 };

function ProductPageFrame({ product, device, interactive = false, onEscape }: { product: Product; device: PreviewDevice; interactive?: boolean; onEscape?: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const iframe = useRef<HTMLIFrameElement>(null);
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [scale, setScale] = useState(.2);
  const [lensOpen, setLensOpen] = useState(false);
  const [lensColor, setLensColor] = useState(0);
  const [notice, setNotice] = useState(false);
  const viewport = previewViewport(device);
  const safeProduct = { ...product, name: product.name || 'Nome do produto', images: product.images.length ? product.images : [emptyImage] };

  useLayoutEffect(() => {
    const element = container.current;
    if (!element) return;
    const measure = () => setScale(Math.max(.01, Math.min(element.clientWidth / viewport.width, element.clientHeight / viewport.height, 1)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [viewport.width, viewport.height]);

  useEffect(() => {
    if (!interactive || !root) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (root.ownerDocument.querySelector('dialog[open]')) return;
      event.preventDefault();
      if (lensOpen) setLensOpen(false); else onEscape?.();
    };
    root.ownerDocument.addEventListener('keydown', keydown);
    return () => root.ownerDocument.removeEventListener('keydown', keydown);
  }, [root, interactive, lensOpen, onEscape]);

  const load = () => {
    const doc = iframe.current?.contentDocument;
    if (!doc) return;
    const base = doc.createElement('base');
    base.href = document.baseURI;
    doc.head.appendChild(base);
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach(source => {
      const clone = source.cloneNode(true) as HTMLElement;
      if (source instanceof HTMLLinkElement) (clone as HTMLLinkElement).href = source.href;
      doc.head.appendChild(clone);
    });
    setRoot(doc.getElementById('product-preview-root'));
  };
  const simulate = () => setNotice(true);
  return <div ref={container} className="w-full h-full flex items-center justify-center overflow-hidden">
    <div style={{ width: viewport.width * scale, height: viewport.height * scale, flexShrink: 0, position: 'relative' }} inert={!interactive}>
      <iframe ref={iframe} srcDoc={frameHtml} onLoad={load} title={'Página real do produto — ' + (device === 'mobile' ? 'celular' : 'computador')} tabIndex={interactive ? 0 : -1} aria-hidden={!interactive} className="border-0 bg-white rounded-lg" style={{ width: viewport.width, height: viewport.height, maxWidth: 'none', transform: 'scale(' + scale + ')', transformOrigin: 'top left', position: 'absolute', inset: 0, pointerEvents: interactive ? 'auto' : 'none' }} />
    </div>
    {root && createPortal(<div onClickCapture={event => {
      if ((event.target as HTMLElement).closest('a')) { event.preventDefault(); simulate(); }
    }}>
      {notice && interactive && <div role="status" className="fixed top-0 inset-x-0 z-[80] bg-amber-50 border-b border-amber-200 p-3 text-xs text-amber-900 flex justify-between items-center gap-3">Prévia: navegação e atendimento externo estão desativados.<button type="button" onClick={() => setNotice(false)} aria-label="Fechar aviso" className="p-2"><X size={16} /></button></div>}
      <Header currentView="product-detail" onNavigate={simulate} onWhatsAppClick={simulate} />
      <ProductDetailView product={safeProduct} allProducts={[safeProduct]} onBackToCatalog={simulate} onSelectProduct={simulate} onOpenLensModal={(_product, index = 0) => { setLensColor(index); setLensOpen(true); }} onWhatsAppClick={simulate} />
      <Footer onNavigate={simulate} onWhatsAppClick={simulate} />
      <LensSelectorModal key={lensColor + '-' + lensOpen} initialColorIndex={lensColor} analyticsEnabled={false} product={safeProduct} isOpen={interactive && lensOpen} onClose={() => setLensOpen(false)} onConfirmWhatsApp={() => { setLensOpen(false); simulate(); }} />
    </div>, root)}
  </div>;
}

export const AdminProductPreview: React.FC<{ product: Product }> = ({ product }) => {
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [fullScreen, setFullScreen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const close = () => { setOpen(false); setFullScreen(false); };
  const show = (value: PreviewDevice, button: HTMLButtonElement) => { opener.current = button; setDevice(value); setOpen(true); };

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    return () => { element?.close(); document.body.style.overflow = overflow; opener.current?.focus(); };
  }, [open]);

  return <>
    <section className="admin-card p-5" aria-label="Miniaturas da página do produto">
      <div className="flex items-center gap-2"><Eye size={18} className="text-[#6b886d]" /><h2 className="font-semibold text-sm">Prévia da página</h2></div>
      <p className="text-xs text-stone-500 mt-2 leading-relaxed">Clique em uma miniatura para abrir a página real em um modal. Os dados acompanham o formulário.</p>
      <div className="grid grid-cols-2 gap-3 mt-5">{(['desktop','mobile'] as const).map(mode => <div key={mode}>
        <div className="relative h-48 sm:h-56 bg-[#e9ece5] rounded-xl p-2 overflow-hidden">
          <ProductPageFrame product={product} device={mode} />
          <button type="button" onClick={e => show(mode, e.currentTarget)} className="absolute inset-0 rounded-xl hover:bg-[#173e2d]/5 focus-visible:outline-2 focus-visible:outline-[#a8843d]" aria-label={'Abrir prévia ' + (mode === 'mobile' ? 'no celular' : 'no computador')}><span className="absolute bottom-2 right-2 bg-white rounded-lg shadow-sm p-2"><ArrowsOut size={16} /></span></button>
        </div>
        <p className="flex items-center justify-center gap-2 text-xs font-medium mt-3">{mode === 'desktop' ? <Desktop size={16} /> : <DeviceMobile size={16} />}{mode === 'desktop' ? 'Computador · 1440 px' : 'Celular · 390 px'}</p>
      </div>)}</div>
    </section>
    {open && typeof document !== 'undefined' && createPortal(<dialog ref={dialog} onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }} aria-labelledby="product-preview-title" className={'product-preview-dialog ' + (fullScreen ? 'product-preview-dialog-full' : '')}>
      <div className="h-full flex flex-col bg-[#e9ece5]">
        <header className="bg-white border-b border-stone-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div><h2 id="product-preview-title" className="text-sm font-semibold text-[#18392d]">Prévia real do produto</h2><p className="text-xs text-stone-500 mt-1">{device === 'desktop' ? 'Computador · 1440 × 900' : 'Celular · 390 × 844'} · ajustada à sua tela</p></div>
          <div className="flex items-center gap-1 text-[#18392d]">
            <button type="button" className={'admin-icon ' + (device === 'desktop' ? 'bg-[#e6eee5]' : '')} onClick={() => setDevice('desktop')} aria-label="Visualizar no computador" aria-pressed={device === 'desktop'}><Desktop size={20} /></button>
            <button type="button" className={'admin-icon ' + (device === 'mobile' ? 'bg-[#e6eee5]' : '')} onClick={() => setDevice('mobile')} aria-label="Visualizar no celular" aria-pressed={device === 'mobile'}><DeviceMobile size={20} /></button>
            <button type="button" className="admin-icon" onClick={() => setFullScreen(!fullScreen)} aria-label={fullScreen ? 'Sair da tela cheia' : 'Expandir para tela cheia'}>{fullScreen ? <ArrowsIn size={20} /> : <ArrowsOut size={20} />}</button>
            <button type="button" className="admin-icon" onClick={close} aria-label="Fechar prévia"><X size={21} /></button>
          </div>
        </header>
        <div className="flex-1 min-h-0 p-3 sm:p-5"><ProductPageFrame key={device} product={product} device={device} interactive onEscape={close} /></div>
      </div>
    </dialog>, document.body)}
  </>;
};
