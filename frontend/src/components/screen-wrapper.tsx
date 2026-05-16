import React from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  flex?: number;
  useSafeArea?: boolean;
  isModal?: boolean;
  showPattern?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  flex = 1,
  useSafeArea = true,
  isModal = false,
  showPattern = true
}) => {
  let paddingTop = 0;
  let paddingBottom = 0;

  if (isModal) {
    paddingTop = Platform.OS === "ios" ? height * 0.02 : 45;
    paddingBottom = height * 0.02;
  }

  const contentView = useSafeArea ? (
        <SafeAreaView style={[styles.container, { flex, paddingTop, paddingBottom }, style]}>
          {children}
        </SafeAreaView>
      ) : (
        <View style={[styles.container, { flex, paddingTop, paddingBottom }, style]}>
          {children}
        </View>
  );

  if (showPattern) {
    return (
      <ImageBackground
        source={require('@/assets/images/bgPattern.png')}
        style={[styles.background, { flex }]}
        resizeMode="cover"
      >
        {contentView}
      </ImageBackground>
  );
  }

  return <View style={[styles.background, { flex }]}>{contentView}</View>;
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
  },
  container: {
    // flex is now dynamic via props
  },
});
