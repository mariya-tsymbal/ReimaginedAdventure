import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductListScreen } from '../../../src/features/catalog/screens/ProductListScreen';
import { mockProducts } from '../../fixtures/product';

const mockNavigation = { navigate: jest.fn(), setOptions: jest.fn() } as any;
const mockRoute = { key: 'test', name: 'ProductList' as const, params: undefined } as any;

function renderScreen(queryClient?: QueryClient) {
  const client =
    queryClient ??
    new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <ProductListScreen navigation={mockNavigation} route={mockRoute} />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ProductListScreen', () => {
  it('shows loading state initially', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as any;
    renderScreen();
    expect(screen.getByLabelText('Loading')).toBeTruthy();
  });

  it('renders product titles after fetch resolves', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      }),
    ) as any;

    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('Unisex Hoodie')).toBeTruthy();
    });
  });

  it('shows error state on fetch failure', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 500, statusText: 'Server Error' }),
    ) as any;

    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('Failed to load products.')).toBeTruthy();
    });
  });
});
