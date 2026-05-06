import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Product, ProductVariant } from '../../../types/product';

interface VariantSelection {
  selectedOptions: Record<string, string>;
  selectedVariant: ProductVariant | undefined;
  isComplete: boolean;
  selectOption: (name: string, value: string) => void;
  getUnavailableValues: (optionName: string) => string[];
}

export function useVariantSelection(product: Product): VariantSelection {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Auto-select first available variant on mount
  useEffect(() => {
    const first = product.variants.find(v => v.availableForSale);
    if (first) {
      const initial: Record<string, string> = {};
      first.selectedOptions.forEach(o => {
        initial[o.name] = o.value;
      });
      setSelectedOptions(initial);
    }
  }, [product]);

  const selectedVariant = useMemo(
    () =>
      product.variants.find(v =>
        v.selectedOptions.every(o => selectedOptions[o.name] === o.value),
      ),
    [product.variants, selectedOptions],
  );

  const isComplete = useMemo(
    () => product.options.every(o => selectedOptions[o.name] !== undefined),
    [product.options, selectedOptions],
  );

  const selectOption = useCallback(
    (name: string, value: string) => {
      setSelectedOptions(prev => {
        const next = { ...prev, [name]: value };
        // If no variant satisfies the new combination, keep only the new selection
        const hasMatch = product.variants.some(v =>
          v.selectedOptions.every(o => next[o.name] === o.value),
        );
        return hasMatch ? next : { [name]: value };
      });
    },
    [product.variants],
  );

  // Returns values for an option that have no available variant given current selections
  const getUnavailableValues = useCallback(
    (optionName: string): string[] => {
      const otherSelections = Object.fromEntries(
        Object.entries(selectedOptions).filter(([k]) => k !== optionName),
      );
      const option = product.options.find(o => o.name === optionName);
      if (!option) {
        return [];
      }
      return option.values.filter(value => {
        const candidate = { ...otherSelections, [optionName]: value };
        return !product.variants.some(
          v =>
            v.availableForSale &&
            v.selectedOptions.every(
              o => candidate[o.name] === undefined || candidate[o.name] === o.value,
            ),
        );
      });
    },
    [product.options, product.variants, selectedOptions],
  );

  return { selectedOptions, selectedVariant, isComplete, selectOption, getUnavailableValues };
}
