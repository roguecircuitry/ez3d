
import { IndexableFloatArray, lerp } from "./general.js";
import type { QuaternionLike } from "./quaternion.js";

export interface Vec2Like {
  x: number;
  y: number;
}
export function Vec2Write(v: Vec2Like, a: IndexableFloatArray, offset: number) {
  a[offset] = v.x;
  a[offset + 1] = v.y;
}

export interface Vec3Like extends Vec2Like {
  z: number;
}
export function Vec3Write(v: Vec3Like, a: IndexableFloatArray, offset: number) {
  a[offset] = v.x;
  a[offset + 1] = v.y;
  a[offset + 2] = v.z;
}

export interface VecSingleton {
  v: Vec3Like;
  arrayRef: IndexableFloatArray;
  arrayIndex: number;

  create(x?: number, y?: number, z?: number): Vec3Like;

  add(o: Vec3Like): VecSingleton;
  sub(o: Vec3Like): VecSingleton;
  mul(o: Vec3Like): VecSingleton;
  div(o: Vec3Like): VecSingleton;
  addScalar(s: number): VecSingleton;
  subScalar(s: number): VecSingleton;
  mulScalar(s: number): VecSingleton;
  divScalar(s: number): VecSingleton;
  copy(o: Vec3Like): VecSingleton;
  store(o: Vec3Like): VecSingleton;
  refArray(a: IndexableFloatArray): VecSingleton;
  outArray(autoIncrement?: boolean): VecSingleton;
  refIndex(): VecSingleton;
  setIndex(i: number): VecSingleton;
  cross(b: Vec3Like): VecSingleton;
  lerp(o: Vec3Like, by: number): VecSingleton;
  fromQuaternion(q: QuaternionLike): VecSingleton;
}

export const vec: VecSingleton = {
  v: { x: 0, y: 0, z: 0 } as Vec3Like,
  arrayRef: undefined as IndexableFloatArray,
  arrayIndex: 0,

  create(x = 0, y = 0, z = 0) {
    return { x, y, z };
  },

  add(o: Vec3Like) {
    vec.v.x += o.x;
    vec.v.y += o.y;
    vec.v.z += o.z;
    return vec;
  },
  sub(o: Vec3Like) {
    vec.v.x -= o.x;
    vec.v.y -= o.y;
    vec.v.z -= o.z;
    return vec;
  },
  mul(o: Vec3Like) {
    vec.v.x *= o.x;
    vec.v.y *= o.y;
    vec.v.z *= o.z;
    return vec;
  },
  div(o: Vec3Like) {
    vec.v.x /= o.x;
    vec.v.y /= o.y;
    vec.v.z /= o.z;
    return vec;
  },
  addScalar(s: number) {
    vec.v.x += s;
    vec.v.y += s;
    vec.v.z += s;
    return vec;
  },
  subScalar(s: number) {
    vec.v.x -= s;
    vec.v.y -= s;
    vec.v.z -= s;
    return vec;
  },
  mulScalar(s: number) {
    vec.v.x *= s;
    vec.v.y *= s;
    vec.v.z *= s;
    return vec;
  },
  divScalar(s: number) {
    vec.v.x /= s;
    vec.v.y /= s;
    vec.v.z /= s;
    return vec;
  },
  copy(o: Vec3Like) {
    vec.v.x = o.x;
    vec.v.y = o.y;
    vec.v.z = o.z;
    return vec;
  },
  store(o: Vec3Like) {
    o.x = vec.v.x;
    o.y = vec.v.y;
    o.z = vec.v.z;
    return vec;
  },
  refArray(a: IndexableFloatArray) {
    vec.arrayRef = a;
    return vec;
  },
  outArray(autoIncrement: boolean = true) {
    vec.arrayRef[0 + vec.arrayIndex] = vec.v.x;
    vec.arrayRef[1 + vec.arrayIndex] = vec.v.y;
    vec.arrayRef[2 + vec.arrayIndex] = vec.v.z;
    if (autoIncrement) vec.arrayIndex++;
    return vec;
  },
  setIndex(i: number) {
    vec.arrayIndex = i;
    return vec;
  },
  refIndex() {
    vec.v.x = vec.arrayRef[0 + vec.arrayIndex];
    vec.v.y = vec.arrayRef[1 + vec.arrayIndex];
    vec.v.z = vec.arrayRef[2 + vec.arrayIndex];
    return vec;
  },
  cross(b: Vec3Like) {
    let x = vec.v.y * b.z - vec.v.z * b.y;
    let y = vec.v.z * b.x - vec.v.x * b.z;
    let z = vec.v.x * b.y - vec.v.y * b.x;
    vec.v.x = x;
    vec.v.y = y;
    vec.v.z = z;
    return vec;
  },
  lerp(o: Vec3Like, by: number) {
    vec.v.x = lerp(vec.v.x, o.x, by);
    vec.v.y = lerp(vec.v.y, o.y, by);
    vec.v.z = lerp(vec.v.z, o.z, by);
    return vec;
  },
  fromQuaternion(q: QuaternionLike) {
    // Extract components from quaternion
    const x = q.x;
    const y = q.y;
    const z = q.z;
    const w = q.w;

    // Calculate Euler angles
    const sinr_cosp = 2 * (w * x + y * z);
    const cosr_cosp = 1 - 2 * (x * x + y * y);
    const roll = Math.atan2(sinr_cosp, cosr_cosp);

    const sinp = 2 * (w * y - z * x);
    let pitch: number;
    if (Math.abs(sinp) >= 1) {
      pitch = Math.sign(sinp) * Math.PI / 2; // use 90 degrees if out of range
    } else {
      pitch = Math.asin(sinp);
    }

    const siny_cosp = 2 * (w * z + x * y);
    const cosy_cosp = 1 - 2 * (y * y + z * z);
    const yaw = Math.atan2(siny_cosp, cosy_cosp);

    // Return Euler angles in XYZ order
    vec.v.x = roll;
    vec.v.y = pitch;
    vec.v.z = yaw;
    return vec;
  }
};
