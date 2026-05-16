import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import React, { useRef } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, Animated } from 'react-native';

interface InputFieldProps extends TextInputProps {
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const InputField = ({ icon, disabled = false, ...props }: InputFieldProps) => {
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    if (disabled) return;
    Animated.timing(borderColorAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    if (disabled) return;
    Animated.timing(borderColorAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    props.onBlur?.(e);
  };

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', colors.primary],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { borderColor },
        disabled && styles.disabledContainer
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <TextInput
        style={[styles.input, disabled && styles.disabledInput]}
        placeholderTextColor={colors.neutral400}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={!disabled}
        {...props}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral100,
    borderRadius: 100,
    paddingHorizontal: spacingX._20,
    height: verticalScale(56),
    borderWidth: 1,
  },
  disabledContainer: {
    backgroundColor: colors.neutral200,
  },
  iconContainer: {
    marginRight: spacingX._12,
  },
  input: {
    flex: 1,
    fontSize: verticalScale(16),
    color: colors.text,
  },
  disabledInput: {
    color: colors.neutral500,
  },
});
