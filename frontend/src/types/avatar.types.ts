import { ImageSourcePropType, ViewStyle } from 'react-native';

export interface AvatarProps {
  uri?: string | null;
  name?: string;
  email?: string;
  size?: number;
  style?: ViewStyle;
  rounded?: boolean;
  isGroup?: boolean,
  showEditButton?: boolean;
  onEditPress?: () => void;
}
