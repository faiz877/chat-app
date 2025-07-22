import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TParticipant, TReaction } from '../types/api';
import Avatar from './Avatar';

interface ReactionsBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  reactions: TReaction[];
  participants: TParticipant[];
}

const ReactionsBottomSheet: React.FC<ReactionsBottomSheetProps> = ({
  isVisible,
  onClose,
  reactions,
  participants,
}) => {
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.value]) {
      acc[reaction.value] = [];
    }
    acc[reaction.value].push(reaction);
    return acc;
  }, {} as Record<string, TReaction[]>);

  const getParticipant = (uuid: string) => {
    return participants.find((p: TParticipant) => p.uuid === uuid);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Reactions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.reactionList}>
            {Object.entries(groupedReactions).map(([emoji, reactionGroup]) => (
              <View key={emoji} style={styles.reactionGroup}>
                <Text style={styles.emojiHeader}>{emoji} ({reactionGroup.length})</Text>
                {reactionGroup.map((reaction) => {
                  const participant = getParticipant(reaction.participantUuid);
                  return (
                    <View key={reaction.uuid} style={styles.participantRow}>
                      <Avatar uri={participant?.avatarUrl} name={participant?.name} size={28} />
                      <Text style={styles.participantName}>
                        {participant?.name || 'Unknown User'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
            {reactions.length === 0 && (
              <Text style={styles.noReactionsText}>No reactions yet.</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#BBBBBB',
  },
  reactionList: {
    paddingBottom: 20,
  },
  reactionGroup: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    paddingBottom: 10,
  },
  emojiHeader: {
    fontSize: 24,
    marginBottom: 10,
    color: '#FFFFFF',
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  participantName: {
    fontSize: 16,
    color: '#E0E0E0',
    marginLeft: 10,
  },
  noReactionsText: {
    fontSize: 16,
    color: '#BBBBBB',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ReactionsBottomSheet;