import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  onPress: () => void;
  disabled: boolean;
  label?: string;
}

export function AddToCartButton({
  onPress,
  disabled,
  label = 'Add to Cart',
}: Props) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#ccc' },
  label: { fontSize: 16, fontWeight: '700', color: '#fff' },
  labelDisabled: { color: '#999' },
});
