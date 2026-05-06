import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../../../types/navigation';

export function EmptyCart() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your cart is empty</Text>
      <Text style={styles.subtext}>Add items to get started</Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Home', { screen: 'ProductList' })}
        accessibilityRole="button"
        accessibilityLabel="Browse products">
        <Text style={styles.buttonText}>Browse Products</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  heading: { fontSize: 20, fontWeight: '700', color: '#111', marginBottom: 8 },
  subtext: { fontSize: 15, color: '#888', marginBottom: 24 },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: '#111',
    borderRadius: 12,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
