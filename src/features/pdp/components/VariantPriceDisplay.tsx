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

  return (
    <View style={styles.container}>
      <Text style={styles.price}>{formatMoney(price)}</Text>
      {showCompare && (
        <Text style={styles.compareAt}>{formatMoney(compareAtPrice!)}</Text>
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
