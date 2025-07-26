import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { useStore } from '../store/useStore';

export default function TopBar() {
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pastel Canvas</Text>
      <TextInput
        style={styles.search}
        placeholder="Search notes..."
        placeholderTextColor={theme.colors.text + '66'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grid,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.headingWeight,
    fontSize: 20,
    color: theme.colors.text,
    flex: 1,
  },
  search: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    minWidth: 120,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
});