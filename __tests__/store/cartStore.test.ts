import { useCartStore } from '../../src/store/cartStore';
import { mockProduct } from '../fixtures/product';

const variant = mockProduct.variants[0];

const baseItem = {
  variantId: variant.id,
  productId: mockProduct.id,
  title: mockProduct.title,
  variantTitle: variant.title,
  price: variant.price,
  image: variant.image,
};

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe('cartStore', () => {
  it('addItem adds a new line item with quantity 1', () => {
    useCartStore.getState().addItem(baseItem);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
  });

  it('addItem increments quantity when same variant added again', () => {
    useCartStore.getState().addItem(baseItem);
    useCartStore.getState().addItem(baseItem);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('incrementQuantity increases quantity by 1', () => {
    useCartStore.getState().addItem(baseItem);
    useCartStore.getState().incrementQuantity(variant.id);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it('subtotal is sum of price × quantity across items', () => {
    useCartStore.getState().addItem(baseItem);
    useCartStore.getState().incrementQuantity(variant.id);
    const { items } = useCartStore.getState();
    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
      0,
    );
    expect(subtotal).toBeCloseTo(parseFloat(variant.price.amount) * 2);
  });
});
