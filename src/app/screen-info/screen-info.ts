import { SCREEN_ORIENTATION, ScreenOrientation } from './screen-orientation';
import { SCREEN_SIZE, ScreenSize } from './screen-size';

export class ScreenInfo {
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly dpr: number,
  ) {}

  //
  // ---------- ADDED VALUE STUFF ----------
  //

  get isSmallPortrait(): boolean {
    return this.isSmall && this.isPortrait;
  }

  //
  // ---------- BASIC GEOMETRY ----------
  //

  /** The smaller of width/height — stable across rotation */
  get minDimension(): number {
    return Math.min(this.width, this.height);
  }

  /** The larger of width/height */
  get maxDimension(): number {
    return Math.max(this.width, this.height);
  }

  //
  // ---------- ORIENTATION ----------
  //

  get orientation(): ScreenOrientation {
    return this.width < this.height ? SCREEN_ORIENTATION.PORTRAIT : SCREEN_ORIENTATION.LANDSCAPE;
  }

  get isPortrait(): boolean {
    return this.orientation === SCREEN_ORIENTATION.PORTRAIT;
  }

  get isLandscape(): boolean {
    return this.orientation === SCREEN_ORIENTATION.LANDSCAPE;
  }

  //
  // ---------- SIZE CATEGORY ----------
  //
  // These thresholds use *minDimension*, not width, so a phone
  // NEVER changes category when rotated — exactly as we discussed.
  //

  get sizeCategory(): ScreenSize {
    const d = this.minDimension;

    if (d < 480) return SCREEN_SIZE.SMALL;
    if (d < 840) return SCREEN_SIZE.MEDIUM;
    return SCREEN_SIZE.LARGE;
  }

  get isSmall(): boolean {
    return this.sizeCategory === SCREEN_SIZE.SMALL;
  }

  get isMedium(): boolean {
    return this.sizeCategory === SCREEN_SIZE.MEDIUM;
  }

  get isLarge(): boolean {
    return this.sizeCategory === SCREEN_SIZE.LARGE;
  }

  //
  // ---------- KEYBOARD DETECTION ----------
  //
  // A simple heuristic: if the height is MUCH smaller than the width-based
  // expectation, we infer the keyboard is present. This is optional and you
  // may refine it later.
  //

  /**
   * True if viewport height is suspiciously small for this device size.
   * (Tunable heuristic — but perfectly fine for now.)
   */
  get keyboardVisible(): boolean {
    // A height reduction of > 150px is almost always keyboard
    return this.maxDimension - this.height > 150;
  }

  /** Estimated keyboard height */
  get keyboardHeight(): number | null {
    if (!this.keyboardVisible) return null;
    // Rough estimate: compare height to expected portrait height
    return this.maxDimension - this.height;
  }

}
