import { ImageSourcePropType, ViewStyle } from 'react-native';

export interface AvatarProps {
  uri?: string | null;
  size?: number;
  style?: ViewStyle;
  rounded?: boolean;
  showEditButton?: boolean;
  onEditPress?: () => void;
}
