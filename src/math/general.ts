
export const RAD2DEG = 57.29578;
export const DEG2RAD = 0.01745329;

export function lerp(from: number, to: number, by: number): number {
  return (1 - by) * from + by * to;
}

export const inverseLerp = (from: number, to: number, value: number): number => {
  if (to - from === 0) return value;
  return (value - from) / (to - from);
}

export type IndexableFloatArray = Float32Array|Array<number>|Uint16Array;
