import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typo from './Typo';
import { colors } from '@/constants/theme';

interface InitialsAvatarProps {
  name?: string;
  size: number;
  email?: string;
}

// Generate consistent color based on name
const getColorFromName = (name: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#E76F51', '#2A9D8F'
  ];

  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return colors[Math.abs(hash) % colors.length];
};

// Get initials from name
const getInitials = (name?: string, email?: string): string => {
  if (name && name.trim()) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  if (email) {
    return email.substring(0, 2).toUpperCase();
  }

  return '??';
};

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({ name, email, size }) => {
  const initials = getInitials(name, email);
  const backgroundColor = getColorFromName(name || email || '');
  const fontSize = size * 0.4;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
      <Typo
        size={fontSize}
        fontWeight="600"
        color={colors.white}
      >
        {initials}
      </Typo>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
