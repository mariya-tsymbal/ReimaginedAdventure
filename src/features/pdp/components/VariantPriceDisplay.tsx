import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { MoneyV2 } from '../../../types/product';
import { formatMoney } from '../../../utils/currency';

interface Props {
  price: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}

export function VariantPriceDisplay({ price, compareAtPrice }: Props) {
  const showCompare =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  const priceText = formatMoney(price);
  const compareText = showCompare ? formatMoney(compareAtPrice!) : null;

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={
        compareText ? `${priceText}, was ${compareText}` : priceText
      }>
      <Text style={styles.price}>{priceText}</Text>
      {showCompare && (
        <Text style={styles.compareAt} importantForAccessibility="no">
          {compareText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { fontSize: 22, fontWeight: '700', color: '#111' },
  compareAt: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
});
