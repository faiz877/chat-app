import React from 'react';
import { Button, Platform, StyleSheet, TextInput, View } from 'react-native';

interface InputBarProps {
  inputText: string;
  onChangeText: (text: string) => void;
  onSendMessage: () => void;
}

const InputBar: React.FC<InputBarProps> = ({
  inputText,
  onChangeText,
  onSendMessage,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor="#BBBBBB"
        value={inputText}
        onChangeText={onChangeText}
        multiline
        keyboardAppearance="dark"
      />
      <Button
        title="Send"
        onPress={onSendMessage}
        color={Platform.OS === 'ios' ? '#007AFF' : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end', 
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#222222', 
    backgroundColor: '#1C1C1E',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, 
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    minHeight: 40,
    maxHeight: 120, 
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default React.memo(InputBar);