import { useCartStore } from '../../../store/cartStore';

export function useCart() {
  const items = useCartStore(state => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalAmount = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0,
  );
  const currencyCode = items[0]?.price.currencyCode ?? 'CAD';
  return { items, totalItems, subtotalAmount, currencyCode };
}
