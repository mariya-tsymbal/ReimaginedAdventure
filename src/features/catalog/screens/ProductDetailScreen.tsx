import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ProductDetailScreenProps } from '../../../types/navigation';

export function ProductDetailScreen({ route }: ProductDetailScreenProps) {
  return (
    <View style={styles.container}>
      <Text>Product Detail: {route.params.productId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
