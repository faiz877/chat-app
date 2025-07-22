import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { TMessageJSON, TParticipant } from '../types/api';
import DateSeparator from './DateSeperator';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: TMessageJSON[];
  participants: TParticipant[];
  myUuid: string;
  onLoadOlderMessages: () => void;
  isLoadingOlder: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  participants,
  myUuid,
  onLoadOlderMessages,
  isLoadingOlder,
}) => {
  const getParticipant = (uuid: string) => {
    return participants.find((p: TParticipant) => p.uuid === uuid);
  };

  return (
    <FlatList<TMessageJSON>
      data={messages}
      keyExtractor={(item: TMessageJSON) => item.uuid}
      renderItem={({ item, index }: { item: TMessageJSON; index: number }) => {
        const previousMessage = messages[index + 1];
        const isGrouped =
          previousMessage &&
          previousMessage.authorUuid === item.authorUuid &&
          (item.sentAt - previousMessage.sentAt < 60000);

        let showDateSeparator = false;
        if (!previousMessage || new Date(item.sentAt).toDateString() !== new Date(previousMessage.sentAt).toDateString()) {
          showDateSeparator = true;
        }

        return (
          <View>
            {showDateSeparator && (
              <DateSeparator date={item.sentAt} />
            )}
            <MessageItem
              message={item}
              participant={getParticipant(item.authorUuid)}
              isMyMessage={item.authorUuid === myUuid}
              isGrouped={isGrouped}
              participants={participants}
            />
          </View>
        );
      }}
      inverted
      contentContainerStyle={styles.contentContainer}
      onEndReached={onLoadOlderMessages}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoadingOlder ? (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 10,
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  loadingMoreContainer: {
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default React.memo(MessageList);