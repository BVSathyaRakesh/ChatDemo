export const getAvatarPath = (avatar?: string | null) => {
  if (avatar) {
    return { uri: avatar };
  }
  return require('@/assets/images/defaultAvatar.png');
};

export const getGroupAvatarPath = (avatar?: string | null) => {
  if (avatar) {
    return { uri: avatar };
  }
  return require('@/assets/images/defaultGroupAvatar.png');
};
