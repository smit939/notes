import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import TopBar from './components/TopBar';
import Canvas from './components/Canvas';
import FAB from './components/FAB';
import { theme } from './theme';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <TopBar />
      <View style={styles.canvasContainer}>
        <Canvas />
        <FAB />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  canvasContainer: {
    flex: 1,
    position: 'relative',
  },
});