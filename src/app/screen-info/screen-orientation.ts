export const SCREEN_ORIENTATION = {
  PORTRAIT: 1,
  LANDSCAPE: 2,
} as const;

export type ScreenOrientation =
  typeof SCREEN_ORIENTATION[keyof typeof SCREEN_ORIENTATION];
