export {};

declare global {
  /**
   * Creates a gloomy ring of pure darkness.
   */
  class MagicalGloomDarknessShader extends AdaptiveDarknessShader {
    static override fragmentShader: string | ((...args: any[]) => string);
  }
}