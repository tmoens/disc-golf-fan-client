export const SCREEN_SIZE = {
  SMALL: 1,
  MEDIUM: 2,
  LARGE: 3,
} as const;

export type ScreenSize = typeof SCREEN_SIZE[keyof typeof SCREEN_SIZE];
