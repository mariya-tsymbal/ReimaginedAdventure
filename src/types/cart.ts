import type { MoneyV2, ProductImage } from './product';

export interface CartLineItem {
  variantId: string;
  productId: string;
  title: string;
  variantTitle: string;
  price: MoneyV2;
  image?: ProductImage | null;
  quantity: number;
}

export interface CartState {
  items: CartLineItem[];
}
