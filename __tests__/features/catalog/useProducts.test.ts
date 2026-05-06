import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '../../../src/features/catalog/hooks/useProducts';
import { mockProducts } from '../../fixtures/product';

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}

describe('useProducts', () => {
  afterEach(() => jest.restoreAllMocks());

  it('starts in loading state', () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    } as Response);

    const { result } = renderHook(() => useProducts(), {
      wrapper: makeWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });

  it('returns products on success', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    } as Response);

    const { result } = renderHook(() => useProducts(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockProducts);
  });

  it('sets isError on failed fetch', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    const { result } = renderHook(() => useProducts(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
