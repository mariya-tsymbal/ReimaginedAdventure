import type { z } from 'zod';
import type {
  MoneyV2Schema,
  ProductImageSchema,
  SelectedOptionSchema,
  ProductOptionSchema,
  ProductVariantSchema,
  PriceRangeSchema,
  ProductSchema,
} from '../api/schemas';

export type MoneyV2 = z.infer<typeof MoneyV2Schema>;
export type ProductImage = z.infer<typeof ProductImageSchema>;
export type SelectedOption = z.infer<typeof SelectedOptionSchema>;
export type ProductOption = z.infer<typeof ProductOptionSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type PriceRange = z.infer<typeof PriceRangeSchema>;
export type Product = z.infer<typeof ProductSchema>;
