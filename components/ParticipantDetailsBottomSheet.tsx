import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TParticipant } from '../types/api';
import Avatar from './Avatar';

interface ParticipantDetailsBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  participant: TParticipant | undefined;
}

const ParticipantDetailsBottomSheet: React.FC<ParticipantDetailsBottomSheetProps> = ({
  isVisible,
  onClose,
  participant,
}) => {
  if (!participant) {
    return null;
  }

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
            <Text style={styles.title}>Participant Info</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.detailsContent}>
            <View style={styles.avatarContainer}>
              <Avatar uri={participant.avatarUrl} name={participant.name} size={100} />
              <Text style={styles.participantName}>{participant.name}</Text>
            </View>

            {participant.bio && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bio:</Text>
                <Text style={styles.detailText}>{participant.bio}</Text>
              </View>
            )}
            {participant.jobTitle && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Job Title:</Text>
                <Text style={styles.detailText}>{participant.jobTitle}</Text>
              </View>
            )}
            {participant.email && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailText}>{participant.email}</Text>
              </View>
            )}
            {participant.createdAt && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Joined:</Text>
                <Text style={styles.detailText}>
                  {new Date(participant.createdAt).toLocaleDateString()}
                </Text>
              </View>
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
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  detailsContent: {
    paddingBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  participantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#BBBBBB',
    width: 90,
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    color: '#E0E0E0',
  },
});

export default ParticipantDetailsBottomSheet;