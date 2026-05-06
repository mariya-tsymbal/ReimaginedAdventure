import { useQuery } from '@tanstack/react-query';
import { fetchProducts, productKeys } from '../../../api/products';

export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: fetchProducts,
  });
}
