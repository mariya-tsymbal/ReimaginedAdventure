import { useQuery } from '@tanstack/react-query';
import { fetchProducts, productKeys } from '../../../api/products';
import type { Product } from '../../../types/product';

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: fetchProducts,
    select: (products: Product[]) => products.find(p => p.id === id),
  });
}
