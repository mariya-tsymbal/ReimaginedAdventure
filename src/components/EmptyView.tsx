import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  message: string;
  subtext?: string;
}

export function EmptyView({ message, subtext }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  message: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  subtext: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center' },
});
