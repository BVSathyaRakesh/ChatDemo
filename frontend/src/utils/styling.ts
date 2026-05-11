import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

// Base height for scaling (iPhone 11 Pro)
const BASE_HEIGHT = 812;

/**
 * Scales a value based on screen height
 * @param size - The size to scale
 * @returns Scaled size based on screen height
 */
export const verticalScale = (size: number): number => {
  return (height / BASE_HEIGHT) * size;
};

/**
 * Scales a value based on screen width
 * @param size - The size to scale
 * @returns Scaled size based on screen width
 */
export const horizontalScale = (size: number): number => {
  const { width } = Dimensions.get('window');
  const BASE_WIDTH = 375; // iPhone 11 Pro width
  return (width / BASE_WIDTH) * size;
};

/**
 * Moderate scaling - scales with a factor
 * @param size - The size to scale
 * @param factor - The scaling factor (default: 0.5)
 * @returns Moderately scaled size
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (horizontalScale(size) - size) * factor;
};
