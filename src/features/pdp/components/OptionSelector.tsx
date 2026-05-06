import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ProductOption } from '../../../types/product';

interface Props {
  option: ProductOption;
  selectedValue: string | undefined;
  onSelect: (value: string) => void;
  unavailableValues?: string[];
}

export function OptionSelector({
  option,
  selectedValue,
  onSelect,
  unavailableValues = [],
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {option.name}
        {selectedValue ? (
          <Text style={styles.selectedLabel}>{'  '}{selectedValue}</Text>
        ) : null}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}>
        {option.values.map(value => {
          const isSelected = value === selectedValue;
          const isUnavailable = unavailableValues.includes(value);
          return (
            <Pressable
              key={value}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
                isUnavailable && styles.chipUnavailable,
              ]}
              onPress={() => onSelect(value)}
              accessibilityRole="radio"
              accessibilityLabel={value}
              accessibilityState={{
                selected: isSelected,
                disabled: isUnavailable,
              }}
              accessibilityHint="Double tap to select">
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                  isUnavailable && styles.chipTextUnavailable,
                ]}>
                {value}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 8 },
  selectedLabel: { fontWeight: '400', color: '#555' },
  chips: { gap: 8, paddingHorizontal: 16 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  chipSelected: { borderColor: '#111', backgroundColor: '#111' },
  chipUnavailable: { opacity: 0.35 },
  chipText: { fontSize: 14, color: '#111' },
  chipTextSelected: { color: '#fff' },
  chipTextUnavailable: { textDecorationLine: 'line-through' },
});
