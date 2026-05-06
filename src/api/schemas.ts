import { z } from 'zod';

export const MoneyV2Schema = z.object({
  amount: z.string(),
  currencyCode: z.string(),
});

export const ProductImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  altText: z.string().nullable().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const SelectedOptionSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const ProductOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  values: z.array(z.string()),
});

export const ProductVariantSchema = z.object({
  id: z.string(),
  title: z.string(),
  quantityAvailable: z.number(),
  availableForSale: z.boolean(),
  currentlyNotInStock: z.boolean(),
  price: MoneyV2Schema,
  compareAtPrice: MoneyV2Schema.nullable(),
  sku: z.string(),
  selectedOptions: z.array(SelectedOptionSchema),
  image: ProductImageSchema.nullable().optional(),
});

export const PriceRangeSchema = z.object({
  maxVariantPrice: MoneyV2Schema,
  minVariantPrice: MoneyV2Schema,
});

export const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  descriptionHtml: z.string(),
  availableForSale: z.boolean(),
  handle: z.string(),
  productType: z.string(),
  tags: z.array(z.string()),
  vendor: z.string(),
  priceRange: PriceRangeSchema,
  compareAtPriceRange: PriceRangeSchema,
  images: z.array(ProductImageSchema),
  options: z.array(ProductOptionSchema),
  requiresSellingPlan: z.boolean(),
  onlineStoreUrl: z.string(),
  variants: z.array(ProductVariantSchema),
  collections: z.array(z.string()),
});

export const ProductsResponseSchema = z.array(ProductSchema);
