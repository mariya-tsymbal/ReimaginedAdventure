import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

const insets = { top: 0, right: 0, bottom: 0, left: 0 };
const frame = { x: 0, y: 0, width: 320, height: 640 };

export const SafeAreaInsetsContext = createContext(insets);
export const SafeAreaFrameContext = createContext(frame);

export const SafeAreaProvider = ({ children }: { children?: ReactNode }) => (
  <SafeAreaFrameContext.Provider value={frame}>
    <SafeAreaInsetsContext.Provider value={insets}>
      {children}
    </SafeAreaInsetsContext.Provider>
  </SafeAreaFrameContext.Provider>
);

export const SafeAreaView = ({ children }: { children?: ReactNode }) => <>{children}</>;

export const useSafeAreaInsets = () => useContext(SafeAreaInsetsContext);
export const useSafeAreaFrame = () => useContext(SafeAreaFrameContext);

export const SafeAreaConsumer = SafeAreaInsetsContext.Consumer;
export const SafeAreaContext = SafeAreaInsetsContext;

export const initialWindowMetrics = { frame, insets };

export function withSafeAreaInsets<T>(WrappedComponent: React.ComponentType<T>) {
  return (props: T) => <WrappedComponent {...(props as any)} insets={insets} />;
}
