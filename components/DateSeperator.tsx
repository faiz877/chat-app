import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DateSeparatorProps {
  date: number;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dateObj = new Date(date);
  let dateString = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (dateObj.toDateString() === today.toDateString()) {
    dateString = 'Today';
  } else if (dateObj.toDateString() === yesterday.toDateString()) {
    dateString = 'Yesterday';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{dateString}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateText: {
    backgroundColor: '#333333',
    color: '#E0E0E0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default React.memo(DateSeparator);