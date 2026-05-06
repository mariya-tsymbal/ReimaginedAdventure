import React, { useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../types/navigation';
import { HomeStack } from './HomeStack';
import { CartScreen } from '../features/cart/screens/CartScreen';
import { useCartStore } from '../store/cartStore';
import HomeSvg from '../../assets/home.svg';
import CartSvg from '../../assets/cart.svg';

const Tab = createBottomTabNavigator<RootTabParamList>();

function HomeIcon({ color, size }: { color: string; size: number }) {
  return <HomeSvg width={size} height={size} fill={color} />;
}

function CartIcon({ color, size }: { color: string; size: number }) {
  return <CartSvg width={size} height={size} stroke={color} />;
}

export function RootTabs() {
  const totalItems = useCartStore(
    useCallback(
      (state: { items: { quantity: number }[] }) =>
        state.items.reduce((sum, item) => sum + item.quantity, 0),
      [],
    ),
  );

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
          tabBarIcon: CartIcon,
        }}
      />
    </Tab.Navigator>
  );
}
