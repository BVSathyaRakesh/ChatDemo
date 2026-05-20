import React, { ReactNode } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
import { colors } from '@/constants/theme';
import Typo from './Typo';

export interface ButtonProps {
  title?: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  children?: ReactNode;
}

export const Button = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  children,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {children ? (
        children
      ) : (
        <Typo
          size={18}
          fontWeight="600"
          color={colors.text}
          style={[styles.buttonText, textStyle]}
        >
          {title}
        </Typo>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonText: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
