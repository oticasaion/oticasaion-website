import React from 'react';
import { Product } from '../../types';
import { AdminView } from './AdminView';

// Compatibility entry point: all access goes through the same protected panel.
interface Props {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductsUpdated: (products: Product[]) => void;
  onPreviewProduct: (product: Product) => void;
}
export const AdminAuthModal: React.FC<Props> = ({ isOpen, onClose, products, onProductsUpdated, onPreviewProduct }) =>
  isOpen ? <AdminView products={products} onProductsUpdated={onProductsUpdated} onBackToStore={onClose} onPreviewProduct={onPreviewProduct} /> : null;
