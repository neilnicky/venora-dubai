// Minimal types for the parts of opentype.js 2.0 used by build-wordmark.ts (the package ships none).
declare module "opentype.js" {
  type Command = { type: string; x?: number; y?: number; x1?: number; y1?: number; x2?: number; y2?: number };
  interface BoundingBox {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }
  export interface Path {
    commands: Command[];
    getBoundingBox(): BoundingBox;
    toPathData(options?: { decimalPlaces?: number }): string;
  }
  interface Glyph {
    advanceWidth?: number;
    getPath(x: number, y: number, fontSize: number): Path;
  }
  interface Font {
    unitsPerEm: number;
    charToGlyph(char: string): Glyph;
  }
  const opentype: { parse(buffer: ArrayBuffer): Font; Path: Path };
  export default opentype;
}
