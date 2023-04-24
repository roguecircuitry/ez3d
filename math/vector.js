import { lerp } from "./general.js";
export function Vec2Write(v, a, offset) {
  a[offset] = v.x;
  a[offset + 1] = v.y;
}
export function Vec3Write(v, a, offset) {
  a[offset] = v.x;
  a[offset + 1] = v.y;
  a[offset + 2] = v.z;
}
export const vec = {
  v: {
    x: 0,
    y: 0,
    z: 0
  },
  arrayRef: undefined,
  arrayIndex: 0,
  create(x = 0, y = 0, z = 0) {
    return {
      x,
      y,
      z
    };
  },
  add(o) {
    vec.v.x += o.x;
    vec.v.y += o.y;
    vec.v.z += o.z;
    return vec;
  },
  sub(o) {
    vec.v.x -= o.x;
    vec.v.y -= o.y;
    vec.v.z -= o.z;
    return vec;
  },
  mul(o) {
    vec.v.x *= o.x;
    vec.v.y *= o.y;
    vec.v.z *= o.z;
    return vec;
  },
  div(o) {
    vec.v.x /= o.x;
    vec.v.y /= o.y;
    vec.v.z /= o.z;
    return vec;
  },
  addScalar(s) {
    vec.v.x += s;
    vec.v.y += s;
    vec.v.z += s;
    return vec;
  },
  subScalar(s) {
    vec.v.x -= s;
    vec.v.y -= s;
    vec.v.z -= s;
    return vec;
  },
  mulScalar(s) {
    vec.v.x *= s;
    vec.v.y *= s;
    vec.v.z *= s;
    return vec;
  },
  divScalar(s) {
    vec.v.x /= s;
    vec.v.y /= s;
    vec.v.z /= s;
    return vec;
  },
  copy(o) {
    vec.v.x = o.x;
    vec.v.y = o.y;
    vec.v.z = o.z;
    return vec;
  },
  store(o) {
    o.x = vec.v.x;
    o.y = vec.v.y;
    o.z = vec.v.z;
    return vec;
  },
  refArray(a) {
    vec.arrayRef = a;
    return vec;
  },
  outArray(autoIncrement = true) {
    vec.arrayRef[0 + vec.arrayIndex] = vec.v.x;
    vec.arrayRef[1 + vec.arrayIndex] = vec.v.y;
    vec.arrayRef[2 + vec.arrayIndex] = vec.v.z;
    if (autoIncrement) vec.arrayIndex++;
    return vec;
  },
  setIndex(i) {
    vec.arrayIndex = i;
    return vec;
  },
  refIndex() {
    vec.v.x = vec.arrayRef[0 + vec.arrayIndex];
    vec.v.y = vec.arrayRef[1 + vec.arrayIndex];
    vec.v.z = vec.arrayRef[2 + vec.arrayIndex];
    return vec;
  },
  cross(b) {
    let x = vec.v.y * b.z - vec.v.z * b.y;
    let y = vec.v.z * b.x - vec.v.x * b.z;
    let z = vec.v.x * b.y - vec.v.y * b.x;
    vec.v.x = x;
    vec.v.y = y;
    vec.v.z = z;
    return vec;
  },
  lerp(o, by) {
    vec.v.x = lerp(vec.v.x, o.x, by);
    vec.v.y = lerp(vec.v.y, o.y, by);
    vec.v.z = lerp(vec.v.z, o.z, by);
    return vec;
  },
  fromQuaternion(q) {
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
    let pitch;
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