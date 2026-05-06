import type { Product } from '../types/product';
import { ProductSchema } from './schemas';
import { PRODUCTS_API_URL } from '../utils/constants';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
  ) {
    super(`HTTP ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

export const productKeys = {
  all: ['products'] as const,
  detail: (id: string) => ['products', id] as const,
};

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_API_URL);
  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }
  const json = await response.json();
  const raw = Array.isArray(json) ? json : [];
  return raw.flatMap(item => {
    const result = ProductSchema.safeParse(item);
    if (!result.success) {
      console.warn('Dropped product:', result.error.flatten());
      return [];
    }
    return [result.data];
  });
}
