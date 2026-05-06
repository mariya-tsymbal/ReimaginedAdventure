import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { CartScreenProps } from '../../../types/navigation';

export function CartScreen(_props: CartScreenProps) {
  return (
    <View style={styles.container}>
      <Text>Cart</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
