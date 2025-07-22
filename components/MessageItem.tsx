import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TMessageJSON, TParticipant } from '../types/api';
import Avatar from './Avatar';
import ReactionsBottomSheet from './ReactionsBottomSheet';

interface MessageItemProps {
  message: TMessageJSON;
  participant: TParticipant | undefined;
  isMyMessage: boolean;
  isGrouped: boolean;
  participants: TParticipant[];
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  participant,
  isMyMessage,
  isGrouped,
  participants,
}) => {
  const [isReactionsSheetVisible, setReactionsSheetVisible] = React.useState(false);
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
          contentFit="contain"
        />
      )}

      {message.replyToMessage && (
        <View style={styles.replyContainer}>
          <Text style={styles.replySender}>
            {message.replyToMessage.authorUuid === 'you' ? 'You' : (participant?.name || 'Unknown User')}
          </Text>
          <Text style={styles.replyText} numberOfLines={1}>
            {message.replyToMessage.text}
          </Text>
        </View>
      )}

      <Text style={styles.messageText}>{message.text}</Text>
      {message.updatedAt > message.sentAt && (
        <Text style={styles.editedIndicator}> (edited)</Text>
      )}

      {message.reactions && message.reactions.length > 0 && (
        <TouchableOpacity
          onPress={() => setReactionsSheetVisible(true)}
          style={styles.reactionsContainer}
        >
          {message.reactions.map((reaction) => (
            <View key={reaction.uuid} style={styles.reactionBubble}>
              <Text style={styles.reactionText}>{reaction.value}</Text>
            </View>
          ))}
        </TouchableOpacity>
      )}

      <Text style={styles.messageTime}>{messageTime}</Text>

      <ReactionsBottomSheet
        isVisible={isReactionsSheetVisible}
        onClose={() => setReactionsSheetVisible(false)}
        reactions={message.reactions || []}
        participants={participants}
      />
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
  replyContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#BBBBBB',
  },
  replySender: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#BBBBBB',
    marginBottom: 2,
  },
  replyText: {
    fontSize: 14,
    color: '#E0E0E0',
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