import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ProductCard } from '../../../src/features/catalog/components/ProductCard';
import { mockProduct } from '../../fixtures/product';

describe('ProductCard', () => {
  it('renders the product title', () => {
    render(<ProductCard product={mockProduct} onPress={jest.fn()} />);
    expect(screen.getByText(mockProduct.title)).toBeTruthy();
  });

  it('renders the vendor name', () => {
    render(<ProductCard product={mockProduct} onPress={jest.fn()} />);
    expect(screen.getByText(mockProduct.vendor)).toBeTruthy();
  });

  it('has button accessibility role', () => {
    render(<ProductCard product={mockProduct} onPress={jest.fn()} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<ProductCard product={mockProduct} onPress={onPress} />);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
