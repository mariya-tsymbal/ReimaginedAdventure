import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../types/navigation';
import { HomeStack } from './HomeStack';
import { CartScreen } from '../features/cart/screens/CartScreen';
import { useCartStore } from '../store/cartStore';

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
          title: 'Products',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 16 }}>{'[S]'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 16 }}>{'[C]'}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
