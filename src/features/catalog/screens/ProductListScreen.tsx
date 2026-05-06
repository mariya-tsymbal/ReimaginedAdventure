import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { ProductListScreenProps } from '../../../types/navigation';
import type { Product } from '../../../types/product';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { LoadingView } from '../../../components/LoadingView';
import { ErrorView } from '../../../components/ErrorView';
import { EmptyView } from '../../../components/EmptyView';

export function ProductListScreen({ navigation }: ProductListScreenProps) {
  const { data: products, isLoading, isError, refetch } = useProducts();

  if (isLoading) {
    return <LoadingView />;
  }

  if (isError) {
    return (
      <ErrorView message="Failed to load products." onRetry={refetch} />
    );
  }

  if (!products?.length) {
    return <EmptyView message="No products available." />;
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={products}
        keyExtractor={(item: Product) => item.id}
        renderItem={({ item }: { item: Product }) => (
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate('ProductDetail', {
                productId: item.id,
                handle: item.handle,
              })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { paddingVertical: 8 },
});
