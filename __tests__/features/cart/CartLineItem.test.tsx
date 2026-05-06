import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { CartLineItem } from '../../../src/features/cart/components/CartLineItem';
import { mockProduct } from '../../fixtures/product';

const variant = mockProduct.variants[0];

const mockItem = {
  variantId: variant.id,
  productId: mockProduct.id,
  title: mockProduct.title,
  variantTitle: variant.title,
  price: variant.price,
  image: variant.image,
  quantity: 2,
};

describe('CartLineItem', () => {
  it('renders the product title', () => {
    render(
      <CartLineItem item={mockItem} onIncrement={jest.fn()}/>,
    );
    expect(screen.getByText(mockProduct.title)).toBeTruthy();
  });

  it('renders current quantity', () => {
    render(
      <CartLineItem item={mockItem} onIncrement={jest.fn()} />,
    );
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('calls onIncrement when + is pressed', () => {
    const onIncrement = jest.fn();
    render(
      <CartLineItem item={mockItem} onIncrement={onIncrement} />,
    );
    fireEvent.press(screen.getByRole('button', { name: /Increase/i }));
    expect(onIncrement).toHaveBeenCalledTimes(1);
  });

  it('+ button has correct accessibilityLabel', () => {
    render(
      <CartLineItem item={mockItem} onIncrement={jest.fn()} />,
    );
    expect(
      screen.getByRole('button', { name: `Increase quantity of ${mockProduct.title}` }),
    ).toBeTruthy();
  });
});
