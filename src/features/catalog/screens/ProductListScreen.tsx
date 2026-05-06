import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ProductListScreenProps } from '../../../types/navigation';

export function ProductListScreen(_props: ProductListScreenProps) {
  return (
    <View style={styles.container}>
      <Text>Product List</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
