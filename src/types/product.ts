export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  quantityAvailable: number;
  availableForSale: boolean;
  currentlyNotInStock: boolean;
  price: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  sku: string;
  selectedOptions: SelectedOption[];
  image?: ProductImage | null;
}

export interface PriceRange {
  maxVariantPrice: MoneyV2;
  minVariantPrice: MoneyV2;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  handle: string;
  productType: string;
  tags: string[];
  vendor: string;
  priceRange: PriceRange;
  compareAtPriceRange: PriceRange;
  images: ProductImage[];
  options: ProductOption[];
  requiresSellingPlan: boolean;
  onlineStoreUrl: string;
  variants: ProductVariant[];
  collections: string[];
}
