import type { Product } from '../../src/types/product';

export const mockProduct: Product = {
  id: 'gid://shopify/Product/1',
  title: 'Unisex Hoodie',
  description: 'A great hoodie',
  descriptionHtml: '<p>A great hoodie</p>',
  availableForSale: true,
  handle: 'unisex-hoodie',
  productType: 'Hoodie',
  tags: ['hoodies'],
  vendor: 'Printify',
  priceRange: {
    minVariantPrice: { amount: '28.52', currencyCode: 'CAD' },
    maxVariantPrice: { amount: '32.09', currencyCode: 'CAD' },
  },
  compareAtPriceRange: {
    minVariantPrice: { amount: '45.00', currencyCode: 'CAD' },
    maxVariantPrice: { amount: '45.00', currencyCode: 'CAD' },
  },
  images: [
    {
      id: 'gid://shopify/ProductImage/1',
      url: 'https://example.com/hoodie.jpg',
      altText: null,
    },
  ],
  options: [
    {
      id: 'gid://shopify/ProductOption/1',
      name: 'Color',
      values: ['Black', 'White'],
    },
    {
      id: 'gid://shopify/ProductOption/2',
      name: 'Size',
      values: ['S', 'M', 'L', 'XL'],
    },
  ],
  requiresSellingPlan: false,
  onlineStoreUrl: 'https://shop.example.com/products/unisex-hoodie',
  variants: [
    {
      id: 'gid://shopify/ProductVariant/1',
      title: 'Black / S',
      quantityAvailable: 10,
      availableForSale: true,
      currentlyNotInStock: false,
      price: { amount: '28.96', currencyCode: 'CAD' },
      compareAtPrice: { amount: '45.00', currencyCode: 'CAD' },
      sku: 'HOODIE-BLACK-S',
      selectedOptions: [
        { name: 'Color', value: 'Black' },
        { name: 'Size', value: 'S' },
      ],
      image: {
        id: 'gid://shopify/ProductImage/1',
        url: 'https://example.com/hoodie.jpg',
      },
    },
    {
      id: 'gid://shopify/ProductVariant/2',
      title: 'White / S',
      quantityAvailable: 0,
      availableForSale: false,
      currentlyNotInStock: false,
      price: { amount: '28.52', currencyCode: 'CAD' },
      compareAtPrice: { amount: '45.00', currencyCode: 'CAD' },
      sku: 'HOODIE-WHITE-S',
      selectedOptions: [
        { name: 'Color', value: 'White' },
        { name: 'Size', value: 'S' },
      ],
      image: null,
    },
  ],
  collections: ['all-products', 'hoodies'],
};

export const mockProducts: Product[] = [mockProduct];
