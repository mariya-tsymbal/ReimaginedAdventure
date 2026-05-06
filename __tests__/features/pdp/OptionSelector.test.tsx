import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { OptionSelector } from '../../../src/features/pdp/components/OptionSelector';
import { mockProduct } from '../../fixtures/product';

const colorOption = mockProduct.options[0]; // { name: 'Color', values: ['Black', 'White'] }

describe('OptionSelector', () => {
  it('renders all option values', () => {
    render(
      <OptionSelector
        option={colorOption}
        selectedValue={undefined}
        onSelect={jest.fn()}
      />,
    );
    expect(screen.getByText('Black')).toBeTruthy();
    expect(screen.getByText('White')).toBeTruthy();
  });

  it('calls onSelect with the tapped value', () => {
    const onSelect = jest.fn();
    render(
      <OptionSelector
        option={colorOption}
        selectedValue={undefined}
        onSelect={onSelect}
      />,
    );
    fireEvent.press(screen.getByText('Black'));
    expect(onSelect).toHaveBeenCalledWith('Black');
  });

  it('marks selected value with selected accessibilityState', () => {
    render(
      <OptionSelector
        option={colorOption}
        selectedValue="Black"
        onSelect={jest.fn()}
      />,
    );
    expect(
      screen.getByRole('radio', { name: 'Black' }).props.accessibilityState
        .selected,
    ).toBe(true);
  });

  it('marks unavailable values as disabled', () => {
    render(
      <OptionSelector
        option={colorOption}
        selectedValue={undefined}
        onSelect={jest.fn()}
        unavailableValues={['White']}
      />,
    );
    expect(
      screen.getByRole('radio', { name: 'White' }).props.accessibilityState
        .disabled,
    ).toBe(true);
  });
});
