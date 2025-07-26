import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Canvas as SkiaCanvas, useValue, useTouchHandler, Group, Rect, Skia, Paint, useDrawCallback } from '@shopify/react-native-skia';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import { useStore } from '../store/useStore';
import NoteCard from './NoteCard';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');
const GRID_SIZE = 48;

export default function Canvas() {
  const notes = useStore((s) => s.notes);
  const pan = useStore((s) => s.pan);
  const zoom = useStore((s) => s.zoom);
  const setPan = useStore((s) => s.setPan);
  const setZoom = useStore((s) => s.setZoom);

  // Gesture state
  const lastPan = React.useRef({ x: pan.x, y: pan.y });
  const lastZoom = React.useRef(zoom);

  const onPanGestureEvent = React.useCallback((event) => {
    if (event.nativeEvent.state === 2) { // BEGAN
      lastPan.current = { x: pan.x, y: pan.y };
    }
    if (event.nativeEvent.state === 4 || event.nativeEvent.state === 5) { // END/CANCEL
      return;
    }
    if (event.nativeEvent.translationX !== undefined) {
      setPan(
        lastPan.current.x + event.nativeEvent.translationX,
        lastPan.current.y + event.nativeEvent.translationY
      );
    }
  }, [setPan, pan]);

  const onPinchGestureEvent = React.useCallback((event) => {
    if (event.nativeEvent.state === 2) { // BEGAN
      lastZoom.current = zoom;
    }
    if (event.nativeEvent.state === 4 || event.nativeEvent.state === 5) { // END/CANCEL
      return;
    }
    if (event.nativeEvent.scale !== undefined) {
      let newZoom = Math.max(0.5, Math.min(2.5, lastZoom.current * event.nativeEvent.scale));
      setZoom(newZoom);
    }
  }, [setZoom, zoom]);

  // Draw grid
  const drawGrid = useDrawCallback((canvas, info) => {
    const paint = Skia.Paint();
    paint.setColor(Skia.Color(theme.colors.grid));
    paint.setStrokeWidth(1);
    const step = GRID_SIZE * zoom;
    for (let x = pan.x % step; x < width; x += step) {
      canvas.drawLine(x, 0, x, height, paint);
    }
    for (let y = pan.y % step; y < height; y += step) {
      canvas.drawLine(0, y, width, y, paint);
    }
  }, [pan, zoom]);

  return (
    <PanGestureHandler onGestureEvent={onPanGestureEvent} minDist={2} avgTouches>
      <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
        <SkiaCanvas style={styles.canvas} onDraw={drawGrid}>
          {/* Render notes */}
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} pan={pan} zoom={zoom} />
          ))}
        </SkiaCanvas>
      </PinchGestureHandler>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.background,
  },
});