import { useCartStore } from '../../../store/cartStore';

export function useCartActions() {
  const addItem = useCartStore(state => state.addItem);
  const incrementQuantity = useCartStore(state => state.incrementQuantity);
  return { addItem, incrementQuantity };
}
