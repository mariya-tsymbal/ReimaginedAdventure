import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProductDetailScreen } from '../../../src/features/catalog/screens/ProductDetailScreen';
import { useCartStore } from '../../../src/store/cartStore';
import { mockProducts, mockProduct } from '../../fixtures/product';

const Stack = createNativeStackNavigator();

function renderPDP() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity, gcTime: Infinity } },
  });
  queryClient.setQueryData(['products'], mockProducts);

  return {
    ...require('@testing-library/react-native').render(
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen
                  name="ProductDetail"
                  component={ProductDetailScreen}
                  initialParams={{ productId: mockProduct.id, handle: mockProduct.handle }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>,
    ),
    queryClient,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  useCartStore.setState({ items: [] });
});

describe('ProductDetailScreen', () => {
  it('renders product title from cached data', async () => {
    renderPDP();
    await waitFor(() => {
      expect(screen.getByText(mockProduct.title)).toBeTruthy();
    });
  });

  it('auto-selects first available variant and enables Add to Cart', async () => {
    renderPDP();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeTruthy();
    });
  });

  it('pressing Add to Cart adds item to store', async () => {
    renderPDP();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeTruthy();
    });

    fireEvent.press(screen.getByRole('button', { name: 'Add to Cart' }));
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].variantId).toBe(mockProduct.variants[0].id);
  });
});
