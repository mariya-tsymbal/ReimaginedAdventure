import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { CartLineItem as CartLineItemType } from '../../../types/cart';
import { formatMoney } from '../../../utils/currency';

interface Props {
  item: CartLineItemType;
  onIncrement: () => void;
}

export function CartLineItem({ item, onIncrement }: Props) {
  const rowTotal = formatMoney({
    amount: String(parseFloat(item.price.amount) * item.quantity),
    currencyCode: item.price.currencyCode,
  });

  return (
    <View style={styles.container}>
      {item.image?.url ? (
        <Image
          source={{ uri: item.image.url }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={item.title}
          accessible
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.variant}>{item.variantTitle}</Text>
        <Text style={styles.unitPrice}>{formatMoney(item.price)}</Text>

        <View style={styles.stepper}>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <Pressable
            style={styles.stepperButton}
            onPress={onIncrement}
            accessibilityRole="button"
            accessibilityLabel={`Increase quantity of ${item.title}`}>
            <Text style={styles.stepperIcon}>+</Text>
          </Pressable>
          <Text style={styles.rowTotal}>{rowTotal}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  image: { width: 80, height: 80, borderRadius: 8 },
  imagePlaceholder: { backgroundColor: '#f0f0f0' },
  info: { flex: 1, marginLeft: 12 },
  title: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 2 },
  variant: { fontSize: 12, color: '#888', marginBottom: 4 },
  unitPrice: { fontSize: 13, color: '#555' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperIcon: { fontSize: 16, color: '#111', lineHeight: 20 },
  quantity: { fontSize: 15, fontWeight: '600', color: '#111', minWidth: 20, textAlign: 'center' },
  rowTotal: { marginLeft: 'auto', fontSize: 14, fontWeight: '700', color: '#111' },
});
