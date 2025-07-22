import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 40 }) => {
  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (uri) {
    return <Image source={{ uri }} style={[styles.avatar, avatarStyle]} />;
  }

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : '?';

  return (
    <View style={[styles.placeholder, avatarStyle]}>
      <Text style={styles.placeholderText}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#CCCCCC',
    overflow: 'hidden',
  },
  placeholder: {
    backgroundColor: '#444444',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default React.memo(Avatar);