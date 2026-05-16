import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PencilSimple } from 'phosphor-react-native';
import { AvatarProps } from '@/src/types/avatar.types';
import { getAvatarPath } from '@/src/utils/getAvatarPath';
import { colors } from '@/constants/theme';

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 100,
  style,
  rounded = true,
  showEditButton = false,
  onEditPress,
}) => {
  const avatarSource = getAvatarPath(uri);

  return (
    <View style={[styles.container, style]}>
      <Image
        source={avatarSource}
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: rounded ? size / 2 : 0,
          },
        ]}
      />
      {showEditButton && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditPress}
          activeOpacity={0.7}
        >
          <PencilSimple size={18} color={colors.neutral800} weight="bold" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: colors.neutral200,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
