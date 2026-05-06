import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootTabs } from './RootTabs';

export function RootNavigator() {
  return (
    <NavigationContainer>
      <RootTabs />
    </NavigationContainer>
  );
}
