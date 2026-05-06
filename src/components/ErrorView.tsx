import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorView({ message, onRetry }: Props) {
  return (
    <View
      style={styles.container}
      accessibilityLiveRegion="assertive">
      <Text style={styles.message}>{message}</Text>
      <Pressable
        style={styles.button}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Try again">
        <Text style={styles.buttonText}>Try Again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  message: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 16 },
  button: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#000', borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
