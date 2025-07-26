import React, { useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Markdown from 'react-native-markdown-display';
import { useStore, Note } from '../store/useStore';
import { theme } from '../theme';

const CARD_WIDTH = 200;
const CARD_HEIGHT = 120;

export default function NoteCard({ note, pan, zoom }: { note: Note; pan: { x: number; y: number }; zoom: number }) {
  const updateNote = useStore((s) => s.updateNote);
  const lastPos = useRef({ x: note.x, y: note.y });

  const onGestureEvent = (event) => {
    if (event.nativeEvent.state === 2) { // BEGAN
      lastPos.current = { x: note.x, y: note.y };
    }
    if (event.nativeEvent.state === 4 || event.nativeEvent.state === 5) { // END/CANCEL
      return;
    }
    if (event.nativeEvent.translationX !== undefined) {
      updateNote(note.id, {
        x: lastPos.current.x + event.nativeEvent.translationX / zoom,
        y: lastPos.current.y + event.nativeEvent.translationY / zoom,
      });
    }
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <View
        style={[
          styles.card,
          {
            left: pan.x + note.x * zoom,
            top: pan.y + note.y * zoom,
            width: CARD_WIDTH * zoom,
            height: CARD_HEIGHT * zoom,
            transform: [{ scale: zoom }],
          },
        ]}
      >
        <Markdown style={markdownStyles}>{note.content}</Markdown>
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    shadowColor: theme.colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

const markdownStyles = {
  body: {
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
  },
};