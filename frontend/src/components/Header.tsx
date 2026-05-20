import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'phosphor-react-native';
import { HeaderProps } from '@/src/types/header.types';
import Typo from './Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { useRouter } from 'expo-router';

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
  style,
  titleStyle,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
       router.back();
    }
  };

  const handleLeftPress = () => {
    if (onLeftPress) {
      onLeftPress();
    } else {
      handleBackPress();
    }
  };

  const renderLeftIcon = () => {
    if (leftIcon) {
      return (
        <TouchableOpacity
          style={styles.leftButton}
          onPress={handleLeftPress}
          activeOpacity={0.7}
        >
          {leftIcon}
        </TouchableOpacity>
      );
    }
    if (showBackButton) {
      return (
        <TouchableOpacity
          style={styles.leftButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.neutral800} weight="bold" />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderRightIcon = () => {
    if (rightIcon) {
      return (
        <TouchableOpacity
          style={styles.rightContainer}
          onPress={onRightPress}
          activeOpacity={0.7}
        >
          {rightIcon}
        </TouchableOpacity>
      );
    }
    if (rightComponent) {
      return <View style={styles.rightContainer}>{rightComponent}</View>;
    }
    return null;
  };

  return (
    <View style={[styles.container, style]}>
      {renderLeftIcon()}
      <View style={styles.titleContainer}>
        <Typo
          size={20}
          fontWeight="600"
          color={colors.neutral800}
          style={titleStyle}
        >
          {title}
        </Typo>
      </View>
      {renderRightIcon()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingX._20,
    position: 'relative',
  },
  leftButton: {
    position: 'absolute',
    left: spacingX._20,
    zIndex: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    position: 'absolute',
    right: spacingX._20,
    zIndex: 1,
  },
});
