import React from 'react';
import { Product } from '../../types';
import { AdminView } from './AdminView';
import type { HomeSettings } from '../../services/homeSettings';

// Compatibility entry point: all access goes through the same protected panel.
interface Props {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductsUpdated: (products: Product[]) => void;
  onHomeSettingsUpdated?: (settings: HomeSettings) => void;
  onPreviewProduct: (product: Product) => void;
}
export const AdminAuthModal: React.FC<Props> = ({ isOpen, onClose, products, onProductsUpdated, onHomeSettingsUpdated, onPreviewProduct }) =>
  isOpen ? <AdminView products={products} onProductsUpdated={onProductsUpdated} onHomeSettingsUpdated={onHomeSettingsUpdated || (() => {})} onBackToStore={onClose} onPreviewProduct={onPreviewProduct} /> : null;
