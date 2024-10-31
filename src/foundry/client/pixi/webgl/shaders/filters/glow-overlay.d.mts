export {};

declare abstract class AnyGlowOverlayFilter extends GlowOverlayFilter {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace GlowOverlayFilter {
    type AnyConstructor = typeof AnyGlowOverlayFilter;
  }

  /**
   * A filter which implements an inner or outer glow around the source texture.
   * Inspired from https://github.com/pixijs/filters/tree/main/filters/glow
   * @remarks MIT License
   */
  class GlowOverlayFilter extends AbstractBaseFilter {
    /**
     * @defaultValue `6`
     */
    override padding: number;

    /**
     * The inner strength of the glow.
     * @defaultValue `3`
     */
    innerStrength: number;

    /**
     * The outer strength of the glow.
     * @defaultValue `3`
     */
    outerStrength: number;

    /**
     * Should this filter auto-animate?
     * @defaultValue `true`
     */
    animated: boolean;

    /**
     * @defaultValue
     * ```js
     * {
     *   distance: 10,
     *   glowColor: [1, 1, 1, 1],
     *   quality: 0.1,
     *   time: 0,
     *   knockout: true,
     *   alpha: 1
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Dynamically create the fragment shader used for filters of this type.
     */
    static createFragmentShader(quality: number, distance: number): string;

    static override vertexShader: string;

    //todo: figure out why this can't be `extends GlowOverlayFilter` https://i.imgur.com/ztywGFf.png
    static override create<ThisType extends AbstractBaseFilter.AnyConstructor>(
      this: ThisType,
      initialUniforms?: AbstractBaseShader.Uniforms,
    ): InstanceType<ThisType>;

    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clear: PIXI.CLEAR_MODES,
    ): void;
  }
}
