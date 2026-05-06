import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import type { CartLineItem } from '../types/cart';

const mmkv = createMMKV({ id: 'cart-storage' });

const mmkvStorage = {
  getItem: (key: string) => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string) => mmkv.set(key, value),
  removeItem: (key: string) => mmkv.remove(key),
};

interface CartStore {
  items: CartLineItem[];
  addItem: (item: Omit<CartLineItem, 'quantity'>) => void;
  incrementQuantity: (variantId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: item => {
        const existing = get().items.find(i => i.variantId === item.variantId);
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            ),
          }));
        } else {
          set(state => ({ items: [...state.items, { ...item, quantity: 1 }] }));
        }
      },

      incrementQuantity: variantId => {
        set(state => ({
          items: state.items.map(i =>
            i.variantId === variantId ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        }));
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
