import React, { useState } from 'react';
import { Product } from '../../types';
import {
  saveProduct,
  deleteProduct,
  resetProductsToDefaults,
  SUPABASE_PRODUCTS_SQL,
} from '../../services/productService';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Copy,
  LogOut,
  Sparkles,
  Database,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';

interface AdminProductManagerProps {
  products: Product[];
  onProductsUpdated: (updatedList: Product[]) => void;
  onClose: () => void;
  onLogout: () => void;
  userEmail?: string;
  onPreviewProduct: (product: Product) => void;
}

export const AdminProductManager: React.FC<AdminProductManagerProps> = ({
  products,
  onProductsUpdated,
  onClose,
  onLogout,
  userEmail,
  onPreviewProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create_edit' | 'sql'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form states for Create / Edit
  const [formName, setFormName] = useState('');
  const [formMaterial, setFormMaterial] = useState('');
  const [formShape, setFormShape] = useState<Product['shape']>('retangular');
  const [formGender, setFormGender] = useState<Product['gender']>('unissex');
  const [formRimType, setFormRimType] = useState<Product['rimType']>('Aro Fechado');
  const [formOriginalPrice, setFormOriginalPrice] = useState('189.90');
  const [formCurrentPrice, setFormCurrentPrice] = useState('75.05');
  const [formPixDiscount, setFormPixDiscount] = useState('5');
  const [formIsPromo, setFormIsPromo] = useState(true);
  const [formIsBestseller, setFormIsBestseller] = useState(false);
  const [formImages, setFormImages] = useState('');
  const [formColors, setFormColors] = useState('Dourado Nobre:#c8a25a, Preto Fosco:#1a1a1a');
  const [formLensWidth, setFormLensWidth] = useState('54');
  const [formBridgeWidth, setFormBridgeWidth] = useState('18');
  const [formTempleLength, setFormTempleLength] = useState('145');
  const [formDescription, setFormDescription] = useState('');

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormName('');
    setFormMaterial('TR-90 Ultraleve com Hastes em Titânio');
    setFormShape('retangular');
    setFormGender('unissex');
    setFormRimType('Aro Fechado');
    setFormOriginalPrice('189.90');
    setFormCurrentPrice('75.05');
    setFormPixDiscount('5');
    setFormIsPromo(true);
    setFormIsBestseller(false);
    setFormImages('https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80');
    setFormColors('Dourado Nobre:#c8a25a, Preto Fosco:#1a1a1a');
    setFormLensWidth('54');
    setFormBridgeWidth('18');
    setFormTempleLength('145');
    setFormDescription('Armação com encaixe anatômico e alta durabilidade.');
    setActiveTab('create_edit');
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormMaterial(p.material);
    setFormShape(p.shape);
    setFormGender(p.gender);
    setFormRimType(p.rimType);
    setFormOriginalPrice(p.originalPrice.toString());
    setFormCurrentPrice(p.currentPrice.toString());
    setFormPixDiscount(p.pixDiscountPercent.toString());
    setFormIsPromo(!!p.isPromo);
    setFormIsBestseller(!!p.isBestseller);
    setFormImages(p.images.join('\n'));
    setFormColors(p.colors.map((c) => `${c.name}:${c.hex}`).join(', '));
    setFormLensWidth(p.dimensions.lensWidth.toString());
    setFormBridgeWidth(p.dimensions.bridgeWidth.toString());
    setFormTempleLength(p.dimensions.templeLength.toString());
    setFormDescription(p.description);
    setActiveTab('create_edit');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showNotification('O nome do produto é obrigatório.', 'error');
      return;
    }

    // Parse images
    const imageList = formImages
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (imageList.length === 0) {
      imageList.push('https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80');
    }

    // Parse colors
    const colorList = formColors
      .split(',')
      .map((item) => {
        const parts = item.split(':');
        return {
          name: (parts[0] || 'Cor').trim(),
          hex: (parts[1] || '#000000').trim(),
        };
      })
      .filter((c) => c.name.length > 0);

    const productId = editingProduct
      ? editingProduct.id
      : `aion-${formName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const productPayload: Product = {
      id: productId,
      name: formName.trim(),
      material: formMaterial.trim() || 'Titânio Aeroespacial',
      shape: formShape,
      gender: formGender,
      rimType: formRimType,
      originalPrice: parseFloat(formOriginalPrice) || 199,
      currentPrice: parseFloat(formCurrentPrice) || 89,
      pixDiscountPercent: parseFloat(formPixDiscount) || 5,
      rating: editingProduct?.rating ?? 5.0,
      reviewsCount: editingProduct?.reviewsCount ?? 12,
      isBestseller: formIsBestseller,
      isPromo: formIsPromo,
      images: imageList,
      clientPhotos: editingProduct?.clientPhotos || [],
      colors: colorList.length > 0 ? colorList : [{ name: 'Preto Clássico', hex: '#111111' }],
      dimensions: {
        lensWidth: parseInt(formLensWidth) || 54,
        lensHeight: editingProduct?.dimensions.lensHeight ?? 34,
        bridgeWidth: parseInt(formBridgeWidth) || 18,
        totalFront: editingProduct?.dimensions.totalFront ?? 135,
        templeLength: parseInt(formTempleLength) || 145,
      },
      specs: {
        materialFront: formMaterial,
        materialTemple: formMaterial,
        rimType: formRimType,
        nosePads: 'Sim (Silicone Anatômico)',
        springHinges: 'Sim (Flexível)',
        style: 'Executivo Contemporâneo',
      },
      description: formDescription.trim() || 'Armação de alta qualidade com lentes oftálmicas digitais.',
      includedItems: editingProduct?.includedItems || [
        '1x Armação Óticas Aion Original',
        '1x Estojo Rígido de Proteção',
        '1x Flanela Especial de Limpeza',
        '1x Certificado de Garantia de 7 Dias',
      ],
    };

    const res = await saveProduct(productPayload);
    if (res.success) {
      // Update local state list
      const idx = products.findIndex((p) => p.id === productPayload.id);
      let updated: Product[];
      if (idx >= 0) {
        updated = [...products];
        updated[idx] = productPayload;
      } else {
        updated = [productPayload, ...products];
      }
      onProductsUpdated(updated);

      showNotification(
        res.savedInSupabase
          ? 'Produto salvo no Supabase com sucesso!'
          : 'Produto salvo no catálogo local com sucesso!',
        'success'
      );
      setActiveTab('list');
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Tem certeza que deseja remover "${productName}" do catálogo?`)) {
      return;
    }
    const res = await deleteProduct(productId);
    if (res.success) {
      const updated = products.filter((p) => p.id !== productId);
      onProductsUpdated(updated);
      showNotification('Produto removido com sucesso.', 'success');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Tem certeza que deseja restaurar a lista padrão de fábrica de produtos?')) {
      const defaults = resetProductsToDefaults();
      onProductsUpdated(defaults);
      showNotification('Catálogo restaurado para os produtos padrão.', 'success');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_PRODUCTS_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
    showNotification('Script SQL copiado para a área de transferência!', 'success');
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden border border-stone-200">
        
        {/* Top Header */}
        <div className="bg-[#0c251d] text-white p-4 sm:px-6 sm:py-5 flex items-center justify-between border-b border-[#c8a25a]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c8a25a]/20 border border-[#c8a25a]/40 flex items-center justify-center text-[#c8a25a]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-[#c8a25a]">
                  Painel de Gestão
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Autenticado Supabase
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-bold font-serif-brand">
                Gerenciador de Armações & Catálogo
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white bg-white/10 hover:bg-rose-600/30 px-3 py-1.5 rounded-lg transition"
              title="Encerrar sessão"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-full transition"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Subheader / Tabs bar */}
        <div className="bg-stone-50 border-b border-stone-200 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'list'
                  ? 'bg-[#0c251d] text-[#c8a25a]'
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              Lista de Produtos ({products.length})
            </button>
            <button
              onClick={handleOpenCreate}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                activeTab === 'create_edit' && !editingProduct
                  ? 'bg-[#0c251d] text-[#c8a25a]'
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Produto</span>
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                activeTab === 'sql'
                  ? 'bg-[#0c251d] text-[#c8a25a]'
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Configuração Supabase SQL</span>
            </button>
          </div>

          <div className="text-[11px] text-stone-500 hidden sm:block">
            {userEmail ? `Logado como: ${userEmail}` : 'Sessão Ativa'}
          </div>
        </div>

        {/* Notification Alert */}
        {notification && (
          <div
            className={`px-4 py-2.5 text-xs font-bold flex items-center justify-between shrink-0 ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 1: PRODUCT LIST */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {/* Filter and Actions Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filtrar por nome ou material..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#0c251d]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleResetDefaults}
                    className="text-stone-500 hover:text-stone-800 text-xs font-semibold px-2.5 py-2 rounded-lg hover:bg-stone-100 transition flex items-center gap-1"
                    title="Restaurar produtos padrão"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restaurar Padrão</span>
                  </button>
                  <button
                    onClick={handleOpenCreate}
                    className="bg-[#0c251d] text-[#c8a25a] text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Armação</span>
                  </button>
                </div>
              </div>

              {/* Product Cards Table */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-200">
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500">
                    Nenhum produto encontrado.
                  </div>
                ) : (
                  filtered.map((product) => {
                    const pixVal = product.currentPrice * (1 - product.pixDiscountPercent / 100);
                    return (
                      <div
                        key={product.id}
                        className="p-3 sm:p-4 bg-white hover:bg-stone-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-xl border border-stone-200 shrink-0 bg-stone-100"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-stone-900">{product.name}</h4>
                              {product.isBestseller && (
                                <span className="bg-[#0c251d] text-[#c8a25a] text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  Mais Vendido
                                </span>
                              )}
                              {product.isPromo && (
                                <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  Promoção
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5">
                              {product.material} • Aro: {product.dimensions.lensWidth}mm
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs">
                              <span className="text-stone-400 line-through">
                                R$ {product.originalPrice.toFixed(2)}
                              </span>
                              <strong className="text-emerald-700 font-bold">
                                R$ {pixVal.toFixed(2)} (PIX)
                              </strong>
                              <span className="text-stone-600">
                                / R$ {product.currentPrice.toFixed(2)} (12x)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => {
                              onPreviewProduct(product);
                              onClose();
                            }}
                            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                            title="Ver detalhes na loja"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-2 text-[#0c251d] hover:bg-stone-100 rounded-lg transition flex items-center gap-1 text-xs font-bold"
                            title="Editar produto"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Editar</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center gap-1 text-xs font-bold"
                            title="Excluir produto"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Excluir</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CREATE / EDIT PRODUCT */}
          {activeTab === 'create_edit' && (
            <form onSubmit={handleSaveProduct} className="space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="font-bold text-base font-serif-brand text-stone-900">
                  {editingProduct ? `Editar Armação: ${editingProduct.name}` : 'Cadastrar Nova Armação'}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="text-xs text-stone-500 hover:text-stone-800"
                >
                  Cancelar e Voltar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                    Nome da Armação *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Óculos de Grau Bangkok"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0c251d]"
                  />
                </div>

                {/* Material */}
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                    Material da Armação *
                  </label>
                  <input
                    type="text"
                    required
                    value={formMaterial}
                    onChange={(e) => setFormMaterial(e.target.value)}
                    placeholder="Ex: Titânio Puro Hipoalergênico"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0c251d]"
                  />
                </div>

                {/* Formato */}
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                    Formato da Armação
                  </label>
                  <select
                    value={formShape}
                    onChange={(e) => setFormShape(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0c251d]"
                  >
                    <option value="retangular">Retangular</option>
                    <option value="redondo">Redondo</option>
                    <option value="quadrado">Quadrado</option>
                    <option value="gatinho">Gatinho</option>
                    <option value="aviador">Aviador</option>
                    <option value="oval">Oval</option>
                  </select>
                </div>

                {/* Gênero */}
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                    Gênero
                  </label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0c251d]"
                  >
                    <option value="unissex">Unissex</option>
                    <option value="feminino">Feminino</option>
                    <option value="masculino">Masculino</option>
                  </select>
                </div>

                {/* Tipo de Aro */}
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                    Tipo de Aro
                  </label>
                  <select
                    value={formRimType}
                    onChange={(e) => setFormRimType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0c251d]"
                  >
                    <option value="Aro Fechado">Aro Fechado</option>
                    <option value="Sem Aro (Balgriff)">Sem Aro (Balgriff)</option>
                    <option value="Meio Aro">Meio Aro (Nylon)</option>
                  </select>
                </div>

                {/* Preço Original */}
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                    Preço Original (R$) De
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0c251d]"
                  />
                </div>

                {/* Preço Atual */}
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                    Preço Promocional (R$) Por
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formCurrentPrice}
                    onChange={(e) => setFormCurrentPrice(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0c251d]"
                  />
                </div>

                {/* Desconto PIX */}
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                    Desconto no PIX (%)
                  </label>
                  <input
                    type="number"
                    value={formPixDiscount}
                    onChange={(e) => setFormPixDiscount(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0c251d]"
                  />
                </div>

                {/* Badges */}
                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsPromo}
                      onChange={(e) => setFormIsPromo(e.target.checked)}
                      className="rounded text-[#0c251d]"
                    />
                    <span>Selo Promoção</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsBestseller}
                      onChange={(e) => setFormIsBestseller(e.target.checked)}
                      className="rounded text-[#0c251d]"
                    />
                    <span>Selo Mais Vendido</span>
                  </label>
                </div>

                {/* Medidas milimétricas */}
                <div className="sm:col-span-2 pt-2 border-t border-stone-100">
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-2">
                    Dimensões da Peça (mm)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-[11px] text-stone-500">Aro (largura)</span>
                      <input
                        type="number"
                        value={formLensWidth}
                        onChange={(e) => setFormLensWidth(e.target.value)}
                        placeholder="54"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500">Ponte nasal</span>
                      <input
                        type="number"
                        value={formBridgeWidth}
                        onChange={(e) => setFormBridgeWidth(e.target.value)}
                        placeholder="18"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500">Haste</span>
                      <input
                        type="number"
                        value={formTempleLength}
                        onChange={(e) => setFormTempleLength(e.target.value)}
                        placeholder="145"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Cores */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                    Cores Disponíveis (formato Nome:Hex separado por vírgula)
                  </label>
                  <input
                    type="text"
                    value={formColors}
                    onChange={(e) => setFormColors(e.target.value)}
                    placeholder="Dourado:#c8a25a, Preto:#1a1a1a, Prata:#cfcfcf"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0c251d]"
                  />
                </div>

                {/* URLs de Imagens */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                    URLs das Imagens (uma por linha)
                  </label>
                  <textarea
                    rows={3}
                    value={formImages}
                    onChange={(e) => setFormImages(e.target.value)}
                    placeholder="https://exemplo.com/foto1.jpg&#10;https://exemplo.com/foto2.jpg"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#0c251d]"
                  />
                </div>

                {/* Descrição */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                    Descrição Detalhada do Modelo
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Descreva o conforto, ergonomia e estilo da armação..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0c251d]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#0c251d] text-[#c8a25a] px-5 py-2.5 rounded-xl text-xs font-bold shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? 'Salvar Alterações' : 'Cadastrar Armação'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SUPABASE SQL CONFIGURATION */}
          {activeTab === 'sql' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <strong className="block font-bold">
                    Sincronização em Nuvem com o Banco de Dados Supabase
                  </strong>
                  <p>
                    As alterações de produtos já estão salvas localmente e persistidas no seu navegador. Caso você queira que os produtos sejam sincronizados em tempo real para todos os clientes em qualquer dispositivo pelo banco do Supabase, basta copiar e rodar o script SQL abaixo no <strong>SQL Editor</strong> do painel do Supabase.
                  </p>
                </div>
              </div>

              <div className="bg-stone-900 rounded-2xl p-4 text-stone-100 font-mono text-xs overflow-x-auto relative shadow-inner">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 text-stone-400">
                  <span>supabase_schema.sql</span>
                  <button
                    onClick={handleCopySql}
                    className="flex items-center gap-1 text-[11px] text-[#c8a25a] hover:underline bg-white/10 px-2 py-1 rounded"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedSql ? 'Copiado!' : 'Copiar SQL'}</span>
                  </button>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed text-[11px] text-stone-300">
                  {SUPABASE_PRODUCTS_SQL}
                </pre>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={handleCopySql}
                  className="bg-[#0c251d] text-[#c8a25a] text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-md"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedSql ? 'Copiado com Sucesso!' : 'Copiar Script SQL Completo'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
