import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { TMessageJSON, TParticipant } from '../types/api';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: TMessageJSON[];
  participants: TParticipant[];
  myUuid: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  participants,
  myUuid,
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

        return (
          <MessageItem
            message={item}
            participant={getParticipant(item.authorUuid)}
            isMyMessage={item.authorUuid === myUuid}
            isGrouped={isGrouped}
          />
        );
      }}
      inverted
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 10,
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
});

export default React.memo(MessageList);