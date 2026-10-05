import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Lock,
  RefreshCw,
  Eye,
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle,
} from 'lucide-react';

interface TermsAndPolicyViewProps {
  onBackToHome: () => void;
  onGoToCatalog: () => void;
  onWhatsAppClick: (customText?: string) => void;
}

type TabKey = 'privacidade' | 'termos' | 'garantia' | 'trocas' | 'receita';

export const TermsAndPolicyView: React.FC<TermsAndPolicyViewProps> = ({
  onBackToHome,
  onGoToCatalog,
  onWhatsAppClick,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('privacidade');

  return (
    <div className="bg-[#faf8f5] text-stone-900 min-h-screen pb-20 animate-fadeIn">
      {/* Top Banner Navigation */}
      <div className="bg-[#0c251d] text-white border-b border-[#c8a25a]/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs text-[#c8a25a] hover:underline font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Início</span>
            </button>
            <span className="text-stone-500">•</span>
            <button
              onClick={onGoToCatalog}
              className="text-xs text-stone-300 hover:text-white transition"
            >
              Catálogo de Armações
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#c8a25a]/20 border border-[#c8a25a]/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#c8a25a]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#c8a25a]">
                Transparência e Conformidade Jurídica
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-brand">
                Políticas, Termos & Garantias
              </h1>
            </div>
          </div>
          <p className="mt-3 text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            Na Óticas Aion, valorizamos sua saúde visual e a máxima proteção dos seus dados. Conheça abaixo todas as nossas diretrizes operacionais, termos de garantia e conformidade com a LGPD.
          </p>
        </div>
      </div>

      {/* Main Container with Nav Tabs and Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="md:col-span-4 space-y-2">
            <div className="bg-white rounded-2xl p-3 border border-stone-200 shadow-sm sticky top-24">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1 block">
                Selecione o Documento
              </span>

              <button
                onClick={() => setActiveTab('privacidade')}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
                  activeTab === 'privacidade'
                    ? 'bg-[#0c251d] text-[#c8a25a] shadow-sm'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Política de Privacidade (LGPD)</span>
                </div>
                {activeTab === 'privacidade' && <CheckCircle2 className="w-4 h-4 text-[#c8a25a]" />}
              </button>

              <button
                onClick={() => setActiveTab('termos')}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
                  activeTab === 'termos'
                    ? 'bg-[#0c251d] text-[#c8a25a] shadow-sm'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Termos de Uso do Site</span>
                </div>
                {activeTab === 'termos' && <CheckCircle2 className="w-4 h-4 text-[#c8a25a]" />}
              </button>

              <button
                onClick={() => setActiveTab('garantia')}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
                  activeTab === 'garantia'
                    ? 'bg-[#0c251d] text-[#c8a25a] shadow-sm'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Garantia & Adaptação (7 Dias)</span>
                </div>
                {activeTab === 'garantia' && <CheckCircle2 className="w-4 h-4 text-[#c8a25a]" />}
              </button>

              <button
                onClick={() => setActiveTab('trocas')}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
                  activeTab === 'trocas'
                    ? 'bg-[#0c251d] text-[#c8a25a] shadow-sm'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 shrink-0" />
                  <span>Trocas e Devoluções (CDC)</span>
                </div>
                {activeTab === 'trocas' && <CheckCircle2 className="w-4 h-4 text-[#c8a25a]" />}
              </button>

              <button
                onClick={() => setActiveTab('receita')}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
                  activeTab === 'receita'
                    ? 'bg-[#0c251d] text-[#c8a25a] shadow-sm'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 shrink-0" />
                  <span>Envio de Receitas & DNP</span>
                </div>
                {activeTab === 'receita' && <CheckCircle2 className="w-4 h-4 text-[#c8a25a]" />}
              </button>

              {/* WhatsApp Support Callout */}
              <div className="mt-4 pt-4 border-t border-stone-100 p-2">
                <span className="text-[11px] text-stone-500 block mb-2">Dúvidas sobre termos?</span>
                <button
                  onClick={() =>
                    onWhatsAppClick('Olá! Gostaria de esclarecer uma dúvida sobre os termos e garantias da Óticas Aion.')
                  }
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Atendimento WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Document Content View */}
          <div className="md:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm leading-relaxed text-stone-700">
            
            {/* TAB: POLÍTICA DE PRIVACIDADE & LGPD */}
            {activeTab === 'privacidade' && (
              <div className="space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0c251d] bg-[#0c251d]/10 px-2.5 py-1 rounded-md">
                    LGPD • Lei nº 13.709/2018
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-brand text-stone-900 mt-2">
                    Política de Privacidade e Proteção de Dados
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">Última atualização: Outubro de 2026</p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <p>
                    A <strong>Óticas Aion</strong> tem o compromisso inegociável de preservar a privacidade e a segurança das informações de todos os seus clientes. Esta política esclarece detalhadamente como coletamos, tratamos, protegemos e armazenamos seus dados pessoais.
                  </p>

                  <h3 className="text-sm sm:text-base font-bold text-stone-900 pt-2">
                    1. Dados de Saúde Visual e Receitas Médicas (Dados Sensíveis)
                  </h3>
                  <p>
                    Reconhecemos que receitas médicas oftálmicas contêm dados de saúde pessoal considerados sensíveis nos termos do Art. 5º, inciso II da LGPD. As fotos ou arquivos de receitas enviados por você via canal oficial de WhatsApp são utilizados <strong>exclusivamente</strong> pela nossa equipe técnica e laboratório óptico homologado para a finalidade estrita de aferição de dioptrias (grau), surfaçagem digital e montagem das lentes. Nenhum dado de saúde é comercializado, compartilhado com terceiros para fins de marketing ou utilizado para outros fins.
                  </p>

                  <h3 className="text-sm sm:text-base font-bold text-stone-900 pt-2">
                    2. Dados Cadastrais e de Entrega
                  </h3>
                  <p>
                    Coletamos nome completo, telefone (WhatsApp), endereço para entrega postal e número de CPF (necessário para emissão da Nota Fiscal Eletrônica e postagem segura pelos Correios ou transportadoras parceiras).
                  </p>

                  <h3 className="text-sm sm:text-base font-bold text-stone-900 pt-2">
                    3. Canais de Venda e Ausência de Coleta Bancária no Site
                  </h3>
                  <p>
                    O website da Óticas Aion opera como vitrine digital e catálogo de alta tecnologia. <strong>Nenhum número de cartão de crédito ou senha bancária é armazenado em nosso site</strong>. Todas as transações e orçamentos finais são concluídos diretamente através do atendimento humanizado no WhatsApp Oficial, garantindo total controle pelo consumidor.
                  </p>

                  <h3 className="text-sm sm:text-base font-bold text-stone-900 pt-2">
                    4. Direitos do Titular (Art. 18 da LGPD)
                  </h3>
                  <p>
                    A qualquer momento, o titular dos dados poderá solicitar a confirmação da existência de tratamento, a correção de dados incompletos ou a revogação de consentimento e exclusão dos seus registros cadastrais, bastando solicitar através do nosso atendimento oficial.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: TERMOS DE USO */}
            {activeTab === 'termos' && (
              <div className="space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0c251d] bg-[#0c251d]/10 px-2.5 py-1 rounded-md">
                    Condições Gerais de Uso
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-brand text-stone-900 mt-2">
                    Termos de Uso do Website
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">Vigência: 2026 / 2027</p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <p>
                    Ao acessar e navegar no portal da <strong>Óticas Aion</strong>, você concorda com as disposições e diretrizes estipuladas nestes Termos de Uso.
                  </p>

                  <h3 className="text-sm sm:text-base font-bold text-stone-900 pt-2">
                    1. Catálogo e Apresentação de Produtos
                  </h3>
                  <p>
                    Nos empenhamos para apresentar com máxima fidelidade as fotografias, medidas milimétricas (aro, ponte, haste), materiais (Titânio Aeroespacial, TR-90, Acetato) e cores das armações. Podem ocorrer pequenas variações cromáticas decorrentes da calibração de cor de diferentes monitores e telas de smartphones.
                  </p>

                  <h3 className="text-sm sm:text-base font-bold text-stone-900 pt-2">
                    2. Orçamento e Direcionamento ao WhatsApp
                  </h3>
                  <p>
                    A Óticas Aion adota um modelo de venda consultiva e humanizada: o carrinho e a configuração de lentes são direcionados ao nosso WhatsApp oficial para validação da receita médica e cálculo exato de espessura de lentes antes de qualquer cobrança.
                  </p>

                  <h3 className="text-sm sm:text-base font-bold text-stone-900 pt-2">
                    3. Propriedade Intelectual
                  </h3>
                  <p>
                    Todos os textos, logotipos, elementos gráficos, vídeos e estrutura visual do website são de titularidade da Óticas Aion, sendo vedada sua reprodução não autorizada para fins comerciais.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: GARANTIA & ADAPTAÇÃO */}
            {activeTab === 'garantia' && (
              <div className="space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                    Garantia Blindada Aion
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-brand text-stone-900 mt-2">
                    Política de Garantia e Adaptação Visual
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">Compromisso de satisfação garantida</p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-900 block font-bold">
                        Garantia de 7 Dias de Adaptação Incondicional
                      </strong>
                      <span className="text-emerald-800 text-xs">
                        Se você receber seus óculos e não se adaptar ao peso, estética no rosto ou lentes de grau, você tem até 7 dias corridos após o recebimento para solicitar ajuste, troca de modelo ou devolução sem burocracia.
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-stone-900 pt-2">
                    1. Garantia Legal de 90 Dias (Defeitos de Fabricação)
                  </h3>
                  <p>
                    Conforme prevê o Código de Defesa do Consumidor (CDC), todas as nossas armações contam com garantia legal de <strong>90 (noventa) dias</strong> contra defeitos de fabricação, incluindo descolamento de soldas, falhas de usinagem no titânio, defeitos nas molas das hastes ou descascamento anormal de banho de pintura.
                  </p>

                  <h3 className="text-sm sm:text-base font-bold text-stone-900 pt-2">
                    2. Garantia dos Tratamentos de Lentes
                  </h3>
                  <p>
                    Lentes com tratamento Antirreflexo Premium e Filtro Luz Azul possuem garantia contra trincas de revestimento ou manchas espontâneas na camada protetora que não decorram de quedas, riscos por atrito com superfícies ásperas ou contato com substâncias químicas abrasivas (álcool em gel, acetona, solventes).
                  </p>
                </div>
              </div>
            )}

            {/* TAB: TROCAS E DEVOLUÇÕES */}
            {activeTab === 'trocas' && (
              <div className="space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">
                    Código de Defesa do Consumidor • Art. 49
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-brand text-stone-900 mt-2">
                    Trocas, Devoluções e Reembolsos
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">Direito de arrependimento e logística reversa facilitada</p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <p>
                    Sabemos que comprar óculos pela internet requer confiança. Por isso, a Óticas Aion segue rigorosamente o Código de Defesa do Consumidor com processo simplificado:
                  </p>

                  <h3 className="text-sm sm:text-base font-bold text-stone-900 pt-2">
                    Como Solicitar Troca ou Devolução:
                  </h3>
                  <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm">
                    <li>
                      <strong>Contato via WhatsApp:</strong> Chame nossa equipe no WhatsApp em até 7 dias após a entrega informando o número do pedido e o motivo.
                    </li>
                    <li>
                      <strong>Código de Logística Reversa:</strong> Forneceremos uma autorização de postagem reversa sem custo de frete para devolução via agência dos Correios.
                    </li>
                    <li>
                      <strong>Conferência e Ressarcimento:</strong> Ao recebermos a armação com seu estojo e flanela originais, o reembolso integral (via PIX em até 24h ou estorno no cartão) ou envio da nova peça é processado imediatamente.
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB: RECEITA E DNP */}
            {activeTab === 'receita' && (
              <div className="space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0c251d] bg-[#0c251d]/10 px-2.5 py-1 rounded-md">
                    Processo Laboratorial de Precisão
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-brand text-stone-900 mt-2">
                    Envio de Receitas Médicas e Medição da DNP Digital
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">Qualidade oftálmica e precisão milimétrica</p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <p>
                    Para confeccionar óculos de grau completo, solicitamos uma foto nítida da receita emitida pelo seu médico oftalmologista ou optometrista dentro do prazo de validade (geralmente até 1 ano).
                  </p>

                  <h3 className="text-sm sm:text-base font-bold text-stone-900 pt-2">
                    Como Medimos Sua DNP (Distância Naso-Pupilar)?
                  </h3>
                  <p>
                    Caso a sua receita não contenha o valor da DNP anotado pelo médico, nosso time técnico realiza a medição digital via foto frontal com cartão de referência através do WhatsApp, garantindo que o centro óptico da lente fique perfeitamente alinhado com o eixo pupilar do seu olho.
                  </p>

                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#c8a25a] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 block font-bold text-xs">
                        Prazo de Confecção no Laboratório
                      </strong>
                      <span className="text-stone-600 text-xs">
                        Armações sem grau são despachadas em até 24h úteis. Óculos completos com lentes de grau passam pelo processo de surfaçagem digital e montagem em até 5 a 7 dias úteis antes do envio postal com código de rastreio.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
