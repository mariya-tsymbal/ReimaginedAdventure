import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Product } from '../../../types/product';
import { formatMoney } from '../../../utils/currency';

interface Props {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: Props) {
  const imageUri = product.images[0]?.url;
  const min = formatMoney(product.priceRange.minVariantPrice);
  const max = formatMoney(product.priceRange.maxVariantPrice);
  const price =
    product.priceRange.minVariantPrice.amount ===
    product.priceRange.maxVariantPrice.amount
      ? min
      : `${max} – ${min}`;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={product.title}
      android_ripple={{ color: '#e0e0e0' }}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={product.title}
          accessible
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.vendor}>{product.vendor}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  pressed: { opacity: 0.9 },
  image: { width: '100%', aspectRatio: 1 },
  imagePlaceholder: { backgroundColor: '#f0f0f0' },
  info: { padding: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 4 },
  vendor: { fontSize: 12, color: '#888', marginBottom: 6 },
  price: { fontSize: 15, fontWeight: '700', color: '#111' },
});
