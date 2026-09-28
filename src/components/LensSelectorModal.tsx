import React, { useState } from 'react';
import { Product, LensOption } from '../types';
import { LENS_OPTIONS } from '../data/lenses';
import { X, Check, ShieldCheck, Sparkles, MessageCircle, HelpCircle, Layers } from 'lucide-react';
import { trackBeginCheckout } from '../firebase';

interface LensSelectorModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmWhatsApp: (message: string) => void;
}

export const LensSelectorModal: React.FC<LensSelectorModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirmWhatsApp,
}) => {
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const [selectedLensId, setSelectedLensId] = useState<string>('fina-poly');

  if (!isOpen || !product) return null;

  const currentLens = LENS_OPTIONS.find((l) => l.id === selectedLensId) || LENS_OPTIONS[1];
  const totalPrice = product.currentPrice + currentLens.price;
  const pixPrice = totalPrice * (1 - product.pixDiscountPercent / 100);

  const handleWhatsAppCheckout = () => {
    trackBeginCheckout(product.name, currentLens.name, pixPrice);
    const colorName = product.colors[selectedColor]?.name || 'Padrão';
    const message = `*Olá, Óticas Aion!* 👋\n\nGostaria de encomendar este óculos de grau completo:\n\n👓 *Armação:* ${product.name}\n🎨 *Cor escolhida:* ${colorName}\n🔬 *Lente escolhida:* ${currentLens.name} (${currentLens.subtitle})\n💰 *Valor estimado:* R$ ${pixPrice.toFixed(2)} à vista no PIX (ou R$ ${totalPrice.toFixed(2)} parcelado)\n\nTenho minha receita em mãos e gostaria de enviar a foto para conferência técnica e medição da DNP. Como procedemos?`;
    onConfirmWhatsApp(message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#0c251d] text-white p-5 sm:px-8 sm:py-6 flex items-center justify-between border-b border-[#c8a25a]/30">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#c8a25a] font-semibold">Configurador de Grau</span>
            <h3 className="text-xl sm:text-2xl font-serif-brand font-bold">{product.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-full transition"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8 divide-y divide-stone-100">
          
          {/* Step 1: Frame review & Color selection */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex flex-col items-center justify-center">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-44 object-cover rounded-xl"
              />
              <div className="w-full mt-3 pt-3 border-t border-stone-200 text-xs text-stone-600 flex justify-between">
                <span>Material: <strong>{product.material}</strong></span>
                <span>Aro: <strong>{product.dimensions.lensWidth}mm</strong></span>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  1. Selecione a Cor da Armação:
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color, index) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(index)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        selectedColor === index
                          ? 'border-[#0c251d] bg-[#0c251d] text-white shadow-sm'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Garantia de 7 Dias:</strong> Se a armação não vestir perfeitamente no seu rosto ou você não se adaptar ao grau, efetuamos a troca sem complicação.
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Choose Lenses (Reproducing the Euglasses design from reference photo!) */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#c8a25a]" />
                  <span>2. Escolha suas Lentes Oftálmicas</span>
                </h4>
                <p className="text-xs text-stone-500">Selecione o índice ideal para a sua receita médica</p>
              </div>
            </div>

            <div className="space-y-3">
              {LENS_OPTIONS.map((lens) => {
                const isSelected = selectedLensId === lens.id;
                return (
                  <div
                    key={lens.id}
                    onClick={() => setSelectedLensId(lens.id)}
                    className={`relative cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all ${
                      isSelected
                        ? 'border-[#c8a25a] bg-gradient-to-r from-[#c8a25a]/10 via-[#c8a25a]/5 to-transparent shadow-md'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Left: Info */}
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                            isSelected
                              ? 'bg-[#0c251d] border-[#0c251d] text-[#c8a25a]'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-stone-900 text-sm sm:text-base">
                              {lens.name}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                              {lens.thicknessBadge}
                            </span>
                            {lens.highlight && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                Mais Escolhida
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-[#0c251d] font-medium">{lens.subtitle}</p>
                          
                          <p className="text-xs text-stone-500">{lens.recommendedDegrees}</p>

                          <ul className="pt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-stone-600">
                            {lens.features.slice(0, 3).map((feat, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right: Price Badge */}
                      <div className="sm:text-right shrink-0 pl-9 sm:pl-0">
                        <div className="inline-block bg-stone-50 border border-stone-200/80 px-4 py-2 rounded-xl text-center">
                          <span className="text-xs text-stone-500 block">Adicional</span>
                          <span className="text-base sm:text-lg font-bold text-stone-900">
                            {lens.price === 0 ? 'Grátis' : `+ R$ ${lens.price.toFixed(2)}`}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Informational Callout (from reference) */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-xs text-stone-600 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-[#c8a25a] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-stone-800">Dica sobre a espessura das lentes:</p>
                <p className="mt-0.5 leading-relaxed">
                  A principal diferença entre os índices está na espessura e peso final. Lentes mais finas (1.67 e 1.74) proporcionam maior conforto, leveza e não distorcem o tamanho dos olhos. Em caso de dúvidas, envie sua receita no WhatsApp que nosso consultor óptico analisa na hora!
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer / Checkout Bar */}
        <div className="bg-stone-50 border-t border-stone-200 p-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto text-center sm:text-left">
            <span className="text-xs text-stone-500 block">Total do Pedido (Armação + Lentes):</span>
            <div className="flex items-baseline justify-center sm:justify-start gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0c251d]">
                R$ {pixPrice.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                no PIX (5% OFF)
              </span>
            </div>
            <span className="text-xs text-stone-500">ou R$ {totalPrice.toFixed(2)} em até 12x no cartão</span>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-[#25D366]/25 transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Concluir no WhatsApp com Receita</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
