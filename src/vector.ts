
export const RAD2DEG = 57.29578;
export const DEG2RAD = 0.01745329;

export function lerp(from: number, to: number, by: number): number {
  return (1 - by) * from + by * to;
}

export const inverseLerp = (from: number, to: number, value: number): number => {
  if (to - from === 0) return value;
  return (value - from) / (to - from);
}

export interface Vec2Like {
  x: number;
  y: number;
}
export function Vec2Write (v: Vec2Like, a: Array<number>, offset: number) {
  a[offset] = v.x;
  a[offset+1] = v.y;
}

export interface Vec3Like extends Vec2Like {
  z: number;
}
export function Vec3Write (v: Vec3Like, a: Array<number>, offset: number) {
  a[offset] = v.x;
  a[offset+1] = v.y;
  a[offset+2] = v.z;
}

export interface RGBALike {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface HSVLike {
  h: number;
  s: number;
  v: number;
}

/**Modified from ChatGPT's generation*/
export function hsvToRgb(hsv: HSVLike, out: RGBALike) {
  let r: number, g: number, b: number;
  let {h,s,v} = hsv;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  out.r = r;
  out.g = g;
  out.b = b;
}


export function RGBAWrite (v: RGBALike, a: Array<number>, offset: number) {
  a[offset] = v.r;
  a[offset+1] = v.g;
  a[offset+2] = v.b;
  a[offset+3] = v.a;
}
export function RGBALerp (a: RGBALike, b: RGBALike, by: number, out: RGBALike) {
  out.r = lerp(a.r, b.r, by);
  out.g = lerp(a.g, b.g, by);
  out.b = lerp(a.b, b.b, by);
  out.a = lerp(a.a, b.a, by);
}

export const vec = {
  v: {x: 0, y: 0, z: 0} as Vec3Like,
  arrayRef: undefined as Array<number>,
  arrayIndex: 0,
  
  add (o: Vec3Like) {
    vec.v.x += o.x;
    vec.v.y += o.y;
    vec.v.z += o.z;
    return vec;
  },
  sub (o: Vec3Like) {
    vec.v.x -= o.x;
    vec.v.y -= o.y;
    vec.v.z -= o.z;
    return vec;
  },
  mul (o: Vec3Like) {
    vec.v.x *= o.x;
    vec.v.y *= o.y;
    vec.v.z *= o.z;
    return vec;
  },
  div (o: Vec3Like) {
    vec.v.x /= o.x;
    vec.v.y /= o.y;
    vec.v.z /= o.z;
    return vec;
  },
  addScalar (s: number) {
    vec.v.x += s;
    vec.v.y += s;
    vec.v.z += s;
    return vec;
  },
  subScalar (s: number) {
    vec.v.x -= s;
    vec.v.y -= s;
    vec.v.z -= s;
    return vec;
  },
  mulScalar (s: number) {
    vec.v.x *= s;
    vec.v.y *= s;
    vec.v.z *= s;
    return vec;
  },
  divScalar (s: number) {
    vec.v.x /= s;
    vec.v.y /= s;
    vec.v.z /= s;
    return vec;
  },
  copy (o: Vec3Like) {
    vec.v.x = o.x;
    vec.v.y = o.y;
    vec.v.z = o.z;
    return vec;
  },
  store (o: Vec3Like) {
    o.x = vec.v.x;
    o.y = vec.v.y;
    o.z = vec.v.z;
    return vec;
  },
  refArray (a: Array<number>) {
    vec.arrayRef = a;
    return vec;
  },
  outArray () {
    vec.arrayRef[0 + vec.arrayIndex] = vec.v.x;
    vec.arrayRef[1 + vec.arrayIndex] = vec.v.y;
    vec.arrayRef[2 + vec.arrayIndex] = vec.v.z;
    vec.arrayIndex ++;
    return vec;
  },
  refIndex () {
    vec.v.x = vec.arrayRef[0 + vec.arrayIndex];
    vec.v.y = vec.arrayRef[1 + vec.arrayIndex];
    vec.v.z = vec.arrayRef[2 + vec.arrayIndex];
    return vec;
  },
  cross (b: Vec3Like) {
    let x = vec.v.y * b.z - vec.v.z * b.y;
    let y = vec.v.z * b.x - vec.v.x * b.z;
    let z = vec.v.x * b.y - vec.v.y * b.x;
    vec.v.x = x;
    vec.v.y = y;
    vec.v.z = z;
    return vec;
  },
  lerp (o: Vec3Like, by: number) {
    vec.v.x = lerp(vec.v.x, o.x, by);
    vec.v.y = lerp(vec.v.y, o.y, by);
    vec.v.z = lerp(vec.v.z, o.z, by);
    return vec;
  }
};
