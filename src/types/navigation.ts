import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type HomeStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: string; handle: string };
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Cart: undefined;
};

export type ProductListScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'ProductList'
>;
export type ProductDetailScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'ProductDetail'
>;
export type CartScreenProps = BottomTabScreenProps<RootTabParamList, 'Cart'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
