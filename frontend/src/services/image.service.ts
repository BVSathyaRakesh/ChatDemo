
export const getAvatarPath = (file: any, isGroup  = false) => {

      if (file && typeof file == 'string') return false

      if (file && typeof file == 'object') return false

      if (isGroup)  return require('../assets/images/defaultGroupAvatar.png');

      return require('assets/images/defaultAvatar.png')
}