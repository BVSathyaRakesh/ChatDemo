import { TextProps, TextStyle } from 'react-native';

export interface TypoProps {
  size?: number;
  color?: string;
  fontWeight?: '400' | '500' | '600' | '700' | 'bold' | 'normal';
  children: React.ReactNode;
  style?: TextStyle;
  textProps?: TextProps;
}

export * from './avatar.types';
export * from './header.types';
