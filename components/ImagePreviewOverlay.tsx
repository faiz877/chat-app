import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TMessageAttachment } from '../types/api';

interface ImagePreviewOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  imageAttachment: TMessageAttachment | undefined;
}

const ImagePreviewOverlay: React.FC<ImagePreviewOverlayProps> = ({
  isVisible,
  onClose,
  imageAttachment,
}) => {
  if (!imageAttachment) {
    return null;
  }

  // Suitable image dimensions to fit screen while maintaining aspect ratio
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const aspectRatio = imageAttachment.width / imageAttachment.height;

  let imageWidth = screenWidth * 0.9;
  let imageHeight = imageWidth / aspectRatio;

  if (imageHeight > screenHeight * 0.8) {
    imageHeight = screenHeight * 0.8;
    imageWidth = imageHeight * aspectRatio;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        {imageAttachment.url && (
          <Image
            source={{ uri: imageAttachment.url }}
            style={{ width: imageWidth, height: imageHeight, borderRadius: 8 }}
            contentFit="contain"
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ImagePreviewOverlay;