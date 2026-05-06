import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface Props {
  availableForSale: boolean;
  currentlyNotInStock: boolean;
}

export function StockBadge({ availableForSale, currentlyNotInStock }: Props) {
  if (!availableForSale) {
    return (
      <Text
        style={[styles.badge, styles.outOfStock]}
        accessibilityRole="text"
        accessibilityLiveRegion="polite">
        Out of stock
      </Text>
    );
  }
  if (currentlyNotInStock) {
    return (
      <Text
        style={[styles.badge, styles.backorder]}
        accessibilityRole="text"
        accessibilityLiveRegion="polite">
        Ships when available
      </Text>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  badge: { fontSize: 13, fontWeight: '500', marginBottom: 12 },
  outOfStock: { color: '#c0392b' },
  backorder: { color: '#e67e22' },
});
