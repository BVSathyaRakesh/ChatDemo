import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import Typo from './Typo';
import { colors, spacingY } from '@/constants/theme';

interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  style?: ViewStyle;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'large',
  color = colors.primary,
  text,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Typo
          size={14}
          color={colors.neutral600}
          style={styles.text}
        >
          {text}
        </Typo>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacingY._20,
  },
  text: {
    marginTop: spacingY._10,
  },
});
