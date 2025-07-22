import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TMessageJSON, TParticipant } from '../types/api';

interface MessageItemProps {
  message: TMessageJSON;
  participant: TParticipant | undefined;
  isMyMessage: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  participant,
  isMyMessage,
}) => {
  const senderName = isMyMessage ? 'You' : (participant?.name || 'Unknown User');
  const messageTime = new Date(message.sentAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[
      styles.messageBubble,
      isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
    ]}>
      <Text style={[
        styles.messageSender,
        isMyMessage ? styles.myMessageSender : styles.otherMessageSender,
      ]}>
        {senderName}
      </Text>
      <Text style={styles.messageText}>{message.text}</Text>
      {message.updatedAt > message.sentAt && (
        <Text style={styles.editedIndicator}> (edited)</Text>
      )}
      <Text style={styles.messageTime}>{messageTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 12, 
    maxWidth: '80%',
    minWidth: '20%',
  },
  myMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 2,
  },
  otherMessageBubble: {
    alignSelf: 'flex-start', 
    backgroundColor: '#333333',
    borderBottomLeftRadius: 2,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  myMessageSender: {
    color: '#E0E0E0', 
    textAlign: 'right',
  },
  otherMessageSender: {
    color: '#999999', 
    textAlign: 'left',
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF', 
    marginBottom: 4,
  },
  editedIndicator: {
    fontSize: 10,
    color: '#AAAAAA',
    fontStyle: 'italic',
    textAlign: 'right', 
  },
  messageTime: {
    fontSize: 10,
    color: '#BBBBBB', 
    marginTop: 2,
    alignSelf: 'flex-end',
  },
});

export default React.memo(MessageItem);