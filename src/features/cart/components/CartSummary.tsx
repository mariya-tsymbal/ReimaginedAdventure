import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatMoney } from '../../../utils/currency';

interface Props {
  subtotalAmount: number;
  currencyCode: string;
}

export function CartSummary({ subtotalAmount, currencyCode }: Props) {
  const formatted = formatMoney({
    amount: String(subtotalAmount.toFixed(2)),
    currencyCode,
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{formatted}</Text>
      </View>
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatted}</Text>
      </View>
      <Text style={styles.note}>Taxes and shipping calculated at checkout</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#e0e0e0' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 15, color: '#555' },
  value: { fontSize: 15, color: '#111' },
  totalRow: { marginTop: 4 },
  totalLabel: { fontSize: 17, fontWeight: '700', color: '#111' },
  totalValue: { fontSize: 17, fontWeight: '700', color: '#111' },
  note: { fontSize: 12, color: '#999', marginTop: 8 },
});
