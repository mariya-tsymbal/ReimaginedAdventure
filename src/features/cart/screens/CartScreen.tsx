import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { CartScreenProps } from '../../../types/navigation';
import type { CartLineItem } from '../../../types/cart';
import { useCart } from '../hooks/useCart';
import { useCartActions } from '../hooks/useCartActions';
import { CartLineItem as CartLineItemComponent } from '../components/CartLineItem';
import { CartSummary } from '../components/CartSummary';
import { EmptyCart } from '../components/EmptyCart';

export function CartScreen(_props: CartScreenProps) {
  const { items, subtotalAmount, currencyCode } = useCart();
  const { incrementQuantity } = useCartActions();

  if (!items.length) {
    return <EmptyCart />;
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={items}
        keyExtractor={(item: CartLineItem) => item.variantId}
        renderItem={({ item }: { item: CartLineItem }) => (
          <CartLineItemComponent
            item={item}
            onIncrement={() => incrementQuantity(item.variantId)}
          />
        )}
        ListFooterComponent={
          <CartSummary subtotalAmount={subtotalAmount} currencyCode={currencyCode} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
