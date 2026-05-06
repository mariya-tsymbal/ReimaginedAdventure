import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../types/navigation';
import { HomeStack } from './HomeStack';
import { CartScreen } from '../features/cart/screens/CartScreen';
import { useCartStore } from '../store/cartStore';
import HomeSvg from '../../assets/home.svg';
import CartSvg from '../../assets/cart.svg';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootTabs() {
  const totalItems = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HomeSvg width={size} height={size} fill={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
          tabBarIcon: ({ color, size }) => (
            <CartSvg width={size} height={size} stroke={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
