import { lerp } from "./general.js";
/**Modified from ChatGPT's generation*/
export function hsvToRgb(hsv, out) {
  let r, g, b;
  let {
    h,
    s,
    v
  } = hsv;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }
  out.r = r;
  out.g = g;
  out.b = b;
}
export function RGBAWrite(v, a, offset) {
  a[offset] = v.r;
  a[offset + 1] = v.g;
  a[offset + 2] = v.b;
  a[offset + 3] = v.a;
}
export function RGBALerp(a, b, by, out) {
  out.r = lerp(a.r, b.r, by);
  out.g = lerp(a.g, b.g, by);
  out.b = lerp(a.b, b.b, by);
  out.a = lerp(a.a, b.a, by);
}