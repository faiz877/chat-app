import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native'; // <<< Import Image
import { TMessageJSON, TParticipant } from '../types/api';
import Avatar from './Avatar';

interface MessageItemProps {
  message: TMessageJSON;
  participant: TParticipant | undefined;
  isMyMessage: boolean;
  isGrouped: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  participant,
  isMyMessage,
  isGrouped,
}) => {
  const senderName = isMyMessage ? 'You' : (participant?.name || 'Unknown User');
  const messageTime = new Date(message.sentAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Get the first image attachment if it exists
  const imageAttachment = message.attachments?.find(
    (att) => att.type === 'image'
  );

  return (
    <View style={[
      styles.messageBubble,
      isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
      isGrouped && styles.groupedMessageBubble,
    ]}>
      {!isGrouped && (
        <View style={styles.messageHeader}>
          {!isMyMessage && (
            <Avatar uri={participant?.avatarUrl} name={participant?.name} size={30} />
          )}
          <Text style={[
            styles.messageSender,
            isMyMessage ? styles.myMessageSender : styles.otherMessageSender,
            !isMyMessage && { marginLeft: 8 }
          ]}>
            {senderName}
          </Text>
        </View>
      )}

      {imageAttachment && (
        <Image
          source={{ uri: imageAttachment.url }}
          style={[
            styles.messageImage,
            { aspectRatio: imageAttachment.width / imageAttachment.height || 1 },
          ]}
          resizeMode="contain"
        />
      )}

      <Text style={styles.messageText}>{message.text}</Text>
      {message.updatedAt > message.sentAt && (
        <Text style={styles.editedIndicator}> (edited)</Text>
      )}
      {message.reactions && message.reactions.length > 0 && (
        <View style={styles.reactionsContainer}>
          {message.reactions.map((reaction) => (
            <View key={reaction.uuid} style={styles.reactionBubble}>
              <Text style={styles.reactionText}>{reaction.value}</Text>
            </View>
          ))}
        </View>
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
  groupedMessageBubble: {
    marginTop: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 'bold',
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
  messageImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  editedIndicator: {
    fontSize: 10,
    color: '#AAAAAA',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 4,
    justifyContent: 'flex-start',
  },
  reactionBubble: {
    backgroundColor: '#444444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 4,
    marginBottom: 4,
  },
  reactionText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 10,
    color: '#BBBBBB',
    marginTop: 2,
    alignSelf: 'flex-end',
  },
});

export default React.memo(MessageItem);