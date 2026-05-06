import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CartScreen } from '../../../src/features/cart/screens/CartScreen';
import { useCartStore } from '../../../src/store/cartStore';
import { mockProduct } from '../../fixtures/product';

const Stack = createNativeStackNavigator();

const variant = mockProduct.variants[0];
const baseItem = {
  variantId: variant.id,
  productId: mockProduct.id,
  title: mockProduct.title,
  variantTitle: variant.title,
  price: variant.price,
  image: variant.image,
};

function renderCartScreen() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Cart" component={CartScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>,
  );
}

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe('CartScreen', () => {
  it('shows empty state when cart has no items', () => {
    renderCartScreen();
    expect(screen.getByText('Your cart is empty')).toBeTruthy();
  });

  it('renders line item when cart has items', () => {
    useCartStore.setState({ items: [{ ...baseItem, quantity: 1 }] });
    renderCartScreen();
    expect(screen.getByText(mockProduct.title)).toBeTruthy();
  });

  it('incrementing quantity updates store', () => {
    useCartStore.setState({ items: [{ ...baseItem, quantity: 1 }] });
    renderCartScreen();
    fireEvent.press(screen.getByRole('button', { name: /Increase/i }));
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });
});
