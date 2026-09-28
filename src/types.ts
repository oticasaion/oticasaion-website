export interface ProductSpecs {
  materialFront: string;
  materialTemple: string;
  rimType: 'Aro Fechado' | 'Meio Aro' | 'Sem Aro (Balgriff)';
  nosePads: 'Sim (Silicone Anatômico)' | 'Não (Injetada)';
  springHinges: 'Sim (Mola 180°)' | 'Sim (Flexível)' | 'Não';
  style: string;
}

export interface ProductDimensions {
  lensWidth: number; // Largura do aro (ex: 54mm)
  lensHeight: number; // Altura da lente (ex: 34mm)
  bridgeWidth: number; // Ponte (ex: 18mm)
  totalFront: number; // Frente total (ex: 130mm)
  templeLength: number; // Hastes (ex: 145mm)
}

export interface Product {
  id: string;
  name: string;
  material: string;
  shape: 'quadrado' | 'redondo' | 'gatinho' | 'retangular' | 'aviador' | 'oval';
  gender: 'unissex' | 'masculino' | 'feminino';
  rimType: 'Aro Fechado' | 'Meio Aro' | 'Sem Aro (Balgriff)';
  originalPrice: number;
  currentPrice: number;
  pixDiscountPercent: number;
  rating: number;
  reviewsCount: number;
  isBestseller?: boolean;
  isPromo?: boolean;
  images: string[];
  clientPhotos?: string[];
  colors: { name: string; hex: string }[];
  dimensions: ProductDimensions;
  specs: ProductSpecs;
  description: string;
  includedItems: string[];
}

export interface LensOption {
  id: string;
  name: string;
  subtitle: string;
  material: string;
  features: string[];
  recommendedDegrees: string;
  price: number;
  thicknessBadge: string;
  highlight?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  comment: string;
  rating: number;
  model: string;
  date: string;
  verified: boolean;
  photo?: string;
}
