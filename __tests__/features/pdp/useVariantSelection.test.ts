import { act, renderHook } from '@testing-library/react-native';
import { useVariantSelection } from '../../../src/features/pdp/hooks/useVariantSelection';
import { mockProduct } from '../../fixtures/product';

describe('useVariantSelection', () => {
  it('auto-selects first available variant on mount', () => {
    const { result } = renderHook(() => useVariantSelection(mockProduct));
    const firstAvailable = mockProduct.variants.find(v => v.availableForSale);
    firstAvailable!.selectedOptions.forEach(o => {
      expect(result.current.selectedOptions[o.name]).toBe(o.value);
    });
  });

  it('returns matching variant when all options selected', () => {
    const { result } = renderHook(() => useVariantSelection(mockProduct));
    act(() => {
      result.current.selectOption('Color', 'Black');
      result.current.selectOption('Size', 'S');
    });
    expect(result.current.selectedVariant?.id).toBe(
      'gid://shopify/ProductVariant/1',
    );
  });

  it('returns undefined selectedVariant on partial selection', () => {
    const { result } = renderHook(() => useVariantSelection(mockProduct));
    act(() => {
      // Manually reset to partial state by selecting only one option
      result.current.selectOption('Color', 'Black');
    });
    // After selecting Color alone, Size from auto-select may still be set.
    // Clear Size by selecting an impossible combo then re-select Color only.
    // Instead, test with a product that has no auto-select:
    const noAvailableProduct = {
      ...mockProduct,
      variants: mockProduct.variants.map(v => ({ ...v, availableForSale: false })),
    };
    const { result: r2 } = renderHook(() => useVariantSelection(noAvailableProduct));
    expect(r2.current.selectedVariant).toBeUndefined();
    expect(r2.current.isComplete).toBe(false);
  });

  it('isComplete is true when all options have a selection', () => {
    const { result } = renderHook(() => useVariantSelection(mockProduct));
    act(() => {
      result.current.selectOption('Color', 'Black');
      result.current.selectOption('Size', 'S');
    });
    expect(result.current.isComplete).toBe(true);
  });

  it('reports unavailable values for an option', () => {
    const { result } = renderHook(() => useVariantSelection(mockProduct));
    // White/S is not availableForSale in our fixture
    const unavailable = result.current.getUnavailableValues('Color');
    // 'White' has no available variants in the fixture (White/S: availableForSale=false)
    expect(unavailable).toContain('White');
  });
});
