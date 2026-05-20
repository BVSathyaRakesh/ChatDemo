export const getAvatarPath = (avatar?: string | null) => {
  // Check if avatar is a valid non-empty string
  if (avatar && typeof avatar === 'string' && avatar.trim() !== '') {
    // Only return URI if it's a valid HTTP/HTTPS URL or local file (for preview)
    if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('file://')) {
      return { uri: avatar };
    }
  }
  // Return default avatar for null, undefined, empty string, or invalid URLs
  return require('@/assets/images/defaultAvatar.png');
};

export const getGroupAvatarPath = (avatar?: string | null) => {
  if (avatar) {
    return { uri: avatar };
  }
  return require('@/assets/images/defaultGroupAvatar.png');
};
