import React, { useCallback, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { ProductDetailScreenProps } from '../../../types/navigation';
import { useProduct } from '../hooks/useProduct';
import { useVariantSelection } from '../../pdp/hooks/useVariantSelection';
import { ImageCarousel } from '../../pdp/components/ImageCarousel';
import { OptionSelector } from '../../pdp/components/OptionSelector';
import { VariantPriceDisplay } from '../../pdp/components/VariantPriceDisplay';
import { AddToCartButton } from '../../pdp/components/AddToCartButton';
import { StockBadge } from '../../pdp/components/StockBadge';
import { LoadingView } from '../../../components/LoadingView';
import { ErrorView } from '../../../components/ErrorView';
import { useCartActions } from '../../cart/hooks/useCartActions';

export function ProductDetailScreen({ route, navigation }: ProductDetailScreenProps) {
  const { productId } = route.params;
  const { data: product, isLoading, isError, refetch } = useProduct(productId);

  useEffect(() => {
    if (product) {
      navigation.setOptions({ title: product.title });
    }
  }, [product, navigation]);

  if (isLoading) {
    return <LoadingView />;
  }

  if (isError) {
    return <ErrorView message="Failed to load product." onRetry={refetch} />;
  }

  if (!product) {
    return <ErrorView message="Product not found." onRetry={refetch} />;
  }

  return <ProductDetailContent product={product} />;
}

function ProductDetailContent({
  product,
}: {
  product: NonNullable<ReturnType<typeof useProduct>['data']>;
}) {
  const { selectedOptions, selectedVariant, isComplete, selectOption, getUnavailableValues } =
    useVariantSelection(product);
  const { addItem } = useCartActions();

  const handleAddToCart = useCallback(() => {
    if (!selectedVariant || !isComplete) {
      return;
    }
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      title: product.title,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      image: selectedVariant.image ?? product.images[0],
    });
  },[selectedVariant, isComplete, addItem, product]);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ImageCarousel images={product.images} productTitle={product.title} />

        <View style={styles.body}>
          <Text style={styles.vendor}>{product.vendor}</Text>
          <Text style={styles.title}>{product.title}</Text>

          {selectedVariant && (
            <VariantPriceDisplay
              price={selectedVariant.price}
              compareAtPrice={selectedVariant.compareAtPrice}
            />
          )}

          {selectedVariant && (
            <StockBadge
              availableForSale={selectedVariant.availableForSale}
              currentlyNotInStock={selectedVariant.currentlyNotInStock}
            />
          )}

          {product.options.map(option => (
            <OptionSelector
              key={option.id}
              option={option}
              selectedValue={selectedOptions[option.name]}
              onSelect={value => selectOption(option.name, value)}
              unavailableValues={getUnavailableValues(option.name)}
            />
          ))}

          <AddToCartButton
            onPress={handleAddToCart}
            disabled={!isComplete || !selectedVariant?.availableForSale}
            label={
              !isComplete
                ? 'Select options'
                : !selectedVariant?.availableForSale
                ? 'Unavailable'
                : 'Add to Cart'
            }
          />

          {product.description ? (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionHeading}>Details</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  body: { padding: 16 },
  vendor: { fontSize: 13, color: '#888', marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 12 },
  descriptionSection: { marginTop: 8 },
  descriptionHeading: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 6,
  },
  description: { fontSize: 14, color: '#555', lineHeight: 22 },
});
