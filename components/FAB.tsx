import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/useStore';
import { theme } from '../theme';

export default function FAB() {
  const addNote = useStore((s) => s.addNote);
  const pan = useStore((s) => s.pan);
  const zoom = useStore((s) => s.zoom);

  const handleAdd = () => {
    // Add note at center of viewport
    addNote({
      x: (-pan.x + 180) / zoom,
      y: (-pan.y + 320) / zoom,
      content: 'New note',
    });
  };

  return (
    <View style={styles.fabContainer} pointerEvents="box-none">
      <TouchableOpacity style={styles.fab} onPress={handleAdd} activeOpacity={0.8}>
        <Ionicons name="add" size={28} color={theme.colors.fabIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    zIndex: 10,
  },
  fab: {
    backgroundColor: theme.colors.fab,
    borderRadius: 32,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
});