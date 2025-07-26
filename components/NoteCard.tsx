import React, { useRef, useState } from 'react';
import { StyleSheet, View, Modal, TextInput, TouchableWithoutFeedback } from 'react-native';
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import Markdown from 'react-native-markdown-display';
import { useStore, Note } from '../store/useStore';
import { theme } from '../theme';

const CARD_WIDTH = 200;
const CARD_HEIGHT = 120;

type NoteCardProps = {
  note: Note;
  pan: { x: number; y: number };
  zoom: number;
  highlight?: boolean;
};

export default function NoteCard({ note, pan, zoom, highlight }: NoteCardProps) {
  const updateNote = useStore((s) => s.updateNote);
  const lastPos = useRef({ x: note.x, y: note.y });
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(note.content);

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

  const handleTap = () => {
    setEditValue(note.content);
    setEditing(true);
  };

  const handleSave = () => {
    updateNote(note.id, { content: editValue });
    setEditing(false);
  };

  return (
    <TapGestureHandler onActivated={handleTap}>
      <View style={{ position: 'absolute', left: pan.x + note.x * zoom, top: pan.y + note.y * zoom }}>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <View
            style={[
              styles.card,
              highlight && styles.highlight,
              {
                width: CARD_WIDTH * zoom,
                height: CARD_HEIGHT * zoom,
                transform: [{ scale: zoom }],
              },
            ]}
          >
            <Markdown style={markdownStyles}>{note.content}</Markdown>
          </View>
        </PanGestureHandler>
        <Modal
          visible={editing}
          transparent
          animationType="fade"
          onRequestClose={() => setEditing(false)}
        >
          <TouchableWithoutFeedback onPress={() => setEditing(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              value={editValue}
              onChangeText={setEditValue}
              autoFocus
              multiline
              onBlur={handleSave}
              onSubmitEditing={handleSave}
              placeholder="Edit note..."
              placeholderTextColor={theme.colors.text + '66'}
            />
          </View>
        </Modal>
      </View>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
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
  highlight: {
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#0006',
  },
  modalContent: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  input: {
    minHeight: 80,
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
  },
});

const markdownStyles = {
  body: {
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
  },
};