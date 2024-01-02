export {};

declare global {
  /**
   * An implementation of the Weiler Atherton algorithm for clipping polygons.
   * This currently only handles combinations that will not result in any holes.
   * Support may be added for holes in the future.
   *
   * This algorithm is faster than the Clipper library for this task because it relies on the unique properties of the
   * circle, ellipse, or convex simple clip object.
   * It is also more precise in that it uses the actual intersection points between the circle/ellipse and polygon,
   * instead of relying on the polygon approximation of the circle/ellipse to find the intersection points.
   *
   * For more explanation of the underlying algorithm, see:
   * https://en.wikipedia.org/wiki/Weiler%E2%80%93Atherton_clipping_algorithm
   * https://www.geeksforgeeks.org/weiler-atherton-polygon-clipping-algorithm
   * https://h-educate.in/weiler-atherton-polygon-clipping-algorithm/
   */
  class WeilerAthertonClipper {
    /**
     * Construct a WeilerAthertonClipper instance used to perform the calculation.
     * @param polygon       - Polygon to clip
     * @param clipObject    - Object used to clip the polygon
     * @param clipType      - Type of clip to use
     * @param clipOpts      - Object passed to the clippingObject methods toPolygon and pointsBetween
     */
    constructor(polygon: PIXI.Polygon, clipObject: PIXI.Rectangle | PIXI.Circle, clipType: number, clipOpts: object);

    /**
     * The supported clip types.
     * Values are equivalent to those in ClipperLib.ClipType.
     */
    static readonly CLIP_TYPES: Readonly<{
      INTERSECT: 0;
      UNION: 1;
    }>;

    /**
     * The supported intersection types.
     */
    static readonly INTERSECTION_TYPES: Readonly<{
      OUT_IN: -1;
      IN_OUT: 1;
      TANGENT: 0;
    }>;

    polygon: PIXI.Polygon;

    clipObject: PIXI.Rectangle | PIXI.Circle;

    /**
     * Configuration settings
     * @param clipType  - One of CLIP_TYPES
     * @param clipOpts  - Object passed to the clippingObject methods
     *                    toPolygon and pointsBetween
     * @defaultValue `{}`
     */
    config: {
      clipType?: typeof WeilerAthertonClipper.CLIP_TYPES;
      clipOpts?: Record<string, unknown>;
    };

    /**
     * Union a polygon and clipObject using the Weiler Atherton algorithm.
     * @param polygon       - Polygon to clip
     * @param clipObject    - Object to clip against the polygon
     * @param clipOpts      - Options passed to the clipping object
     *                        methods toPolygon and pointsBetween
     */
    static union(
      polygon: PIXI.Polygon,
      clipObject: PIXI.Rectangle | PIXI.Circle,
      clipOpts: Record<string, unknown>,
    ): PIXI.Polygon[];

    /**
     * Intersect a polygon and clipObject using the Weiler Atherton algorithm.
     * @param polygon       - Polygon to clip
     * @param clipObject    - Object to clip against the polygon
     * @param clipOpts      - Options passed to the clipping object
     *                        methods toPolygon and pointsBetween
     */
    static intersect(
      polygon: PIXI.Polygon,
      clipObject: PIXI.Rectangle | PIXI.Circle,
      clipOpts: Record<string, unknown>,
    ): PIXI.Polygon[];

    /**
     * Clip a given clipObject using the Weiler-Atherton algorithm.
     *
     * At the moment, this will return a single PIXI.Polygon in the array unless clipType is a union and the polygon
     * and clipObject do not overlap, in which case the [polygon, clipObject.toPolygon()] array will be returned.
     * If this algorithm is expanded in the future to handle holes, an array of polygons may be returned.
     *
     * @param polygon       - Polygon to clip
     * @param clipObject    - Object to clip against the polygon
     * @param clipType      - One of CLIP_TYPES
     * @param canMutate     - If the WeilerAtherton constructor could mutate or not the subject polygon points
     * @param clipOpts      - Options passed to the WeilerAthertonClipper constructor
     * @returns Array of polygons and clipObjects
     */
    static combine(
      polygon: PIXI.Polygon,
      clipObject: PIXI.Rectangle | PIXI.Circle,
      {
        clipType,
        canMutate,
        ...clipOpts
      }?: { clipType: typeof WeilerAthertonClipper.CLIP_TYPES; canMutate: boolean; clipOpts: Record<string, unknown> },
    ): PIXI.Polygon[];

    /**
     * Test if one shape envelops the other. Assumes the shapes do not intersect.
     *  1. Polygon is contained within the clip object. Union: clip object; Intersect: polygon
     *  2. Clip object is contained with polygon. Union: polygon; Intersect: clip object
     *  3. Polygon and clip object are outside one another. Union: both; Intersect: null
     * @param polygon       - Polygon to clip
     * @param clipObject    - Object to clip against the polygon
     * @param clipType      - One of CLIP_TYPES
     * @param clipOpts      - Clip options which are forwarded to toPolygon methods
     * @returns Returns the polygon, the clipObject.toPolygon(), both, or neither.
     */
    static testForEnvelopment(
      polygon: PIXI.Polygon,
      clipObject: PIXI.Rectangle | PIXI.Circle,
      clipType: typeof WeilerAthertonClipper.CLIP_TYPES,
      clipOpts: Record<string, unknown>,
    ): PIXI.Polygon[];
  }
}