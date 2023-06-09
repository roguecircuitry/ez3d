
/**
 * Say, a lot of this code is straight from gl-matrix.. why not just import that?
 * 
 * 1. mat4.js at time of writting has 2180 LOC, this file is 354 LOC
 * 2. Easier to use when you have to crawl thru it
 * 3. the style here is a bit different, less intermediary variables to track in your code
 * 4. some parts missing, such as rotating matrix by quaternion, are added here added by ChatGPT - and no, i dont want to create an intermediate rotation matrix
*/

import { DEG2RAD } from "./general.js";
import { QuaternionLike } from "./quaternion.js";
import { Vec3Like } from "./vector.js";

export type Mat4Like = Float32Array;

export const Mat4FloatCount = 16;

export interface Mat4Singleton {
  m: Float32Array;
  create(): Mat4Like;
  store(m: Mat4Like, offset?: number): Mat4Singleton;
  copy(m: Mat4Like, offset?: number): Mat4Singleton;
  identity(): Mat4Singleton;

  mul(m: Mat4Like): Mat4Singleton;
  translate(v: Vec3Like): Mat4Singleton;
  scale(v: Vec3Like): Mat4Singleton;
  rotate(q: QuaternionLike): Mat4Singleton;
  /**Calculates transformation matrix from values, arguments are inputs*/
  fromTRS(t: Vec3Like, r: QuaternionLike, s: Vec3Like): Mat4Singleton;
  /**Calculates t,r,s from matrix values, arguments are outputs*/
  toTRS(t: Vec3Like, r: QuaternionLike, s: Vec3Like): Mat4Singleton;
  perspective(fovy?: number, aspect?: number, near?: number, far?: number): Mat4Singleton;
  orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4Singleton;
}

export const mat4: Mat4Singleton = {
  m: new Float32Array(Mat4FloatCount),

  create(): Mat4Like {
    let result = new Float32Array([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);

    return result;
  },
  store(m: Mat4Like, offset: number = 0) {
    for (let i = 0; i < Mat4FloatCount; i++) {
      m[i + offset] = mat4.m[i];
    }
    return mat4;
  },
  copy(m: Mat4Like, offset: number = 0) {
    for (let i = 0; i < Mat4FloatCount; i++) {
      mat4.m[i] = m[i + offset];
    }
    return mat4;
  },
  identity() {
    mat4.m[0] = 1;
    mat4.m[1] = 0;
    mat4.m[2] = 0;
    mat4.m[3] = 0;
    mat4.m[4] = 0;
    mat4.m[5] = 1;
    mat4.m[6] = 0;
    mat4.m[7] = 0;
    mat4.m[8] = 0;
    mat4.m[9] = 0;
    mat4.m[10] = 1;
    mat4.m[11] = 0;
    mat4.m[12] = 0;
    mat4.m[13] = 0;
    mat4.m[14] = 0;
    mat4.m[15] = 1;
    return mat4;
  },
  mul(m: Mat4Like) {
    let a = mat4.m;
    let b = m;
    let out = mat4.m;

    //everything in this func after this line straight from gl-matrix
    let a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
    let a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
    let a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
    let a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];

    // Cache only the current line of the second matrix
    let b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return mat4;
  },
  translate(v: Vec3Like) {
    let out = mat4.m;
    let a = mat4.m;

    let { x, y, z } = v;

    //everything in this func after this line straight from gl-matrix
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];

    return mat4;
  },
  scale(v: Vec3Like) {
    let { x, y, z } = v;
    let out = mat4.m;
    let a = mat4.m;

    //everything in this func after this line straight from gl-matrix
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];

    return mat4;
  },
  rotate(q: QuaternionLike) {
    let matrix = mat4.m;
    let rotation = q;

    //generated by ChatGPT, and then modified to fit our math interfaces

    // function rotateMatrixByQuaternion(matrix: number[], rotation: number[]): void {
    // Extract the translation components from the input matrix
    const tx = matrix[12];
    const ty = matrix[13];
    const tz = matrix[14];

    // Extract the x, y, and z components from the input quaternion
    const qx = rotation.x;//[0];
    const qy = rotation.y;//[1];
    const qz = rotation.z;//[2];
    const qw = rotation.w;//[3];

    // Calculate the rotation matrix
    const xx = qx * qx;
    const xy = qx * qy;
    const xz = qx * qz;
    const xw = qx * qw;

    const yy = qy * qy;
    const yz = qy * qz;
    const yw = qy * qw;

    const zz = qz * qz;
    const zw = qz * qw;

    const m00 = 1 - 2 * (yy + zz);
    const m01 = 2 * (xy + zw);
    const m02 = 2 * (xz - yw);

    const m10 = 2 * (xy - zw);
    const m11 = 1 - 2 * (xx + zz);
    const m12 = 2 * (yz + xw);

    const m20 = 2 * (xz + yw);
    const m21 = 2 * (yz - xw);
    const m22 = 1 - 2 * (xx + yy);

    // Update the input matrix with the rotated result
    matrix[0] = matrix[0] * m00 + matrix[4] * m01 + matrix[8] * m02;
    matrix[1] = matrix[1] * m00 + matrix[5] * m01 + matrix[9] * m02;
    matrix[2] = matrix[2] * m00 + matrix[6] * m01 + matrix[10] * m02;

    matrix[4] = matrix[0] * m10 + matrix[4] * m11 + matrix[8] * m12;
    matrix[5] = matrix[1] * m10 + matrix[5] * m11 + matrix[9] * m12;
    matrix[6] = matrix[2] * m10 + matrix[6] * m11 + matrix[10] * m12;

    matrix[8] = matrix[0] * m20 + matrix[4] * m21 + matrix[8] * m22;
    matrix[9] = matrix[1] * m20 + matrix[5] * m21 + matrix[9] * m22;
    matrix[10] = matrix[2] * m20 + matrix[6] * m21 + matrix[10] * m22;

    matrix[12] = matrix[0] * tx + matrix[4] * ty + matrix[8] * tz + matrix[12];
    matrix[13] = matrix[1] * tx + matrix[5] * ty + matrix[9] * tz + matrix[13];
    matrix[14] = matrix[2] * tx + matrix[6] * ty + matrix[10] * tz + matrix[14];
    return mat4;
  },
  /**Calculates transformation matrix from values, arguments are inputs*/
  fromTRS(t: Vec3Like, r: QuaternionLike, s: Vec3Like) {
    let out = mat4.m;

    //modified from gl-matrix
    let x2 = r.x + r.x;
    let y2 = r.y + r.y;
    let z2 = r.z + r.z;

    let xx = r.x * x2;
    let xy = r.x * y2;
    let xz = r.x * z2;
    let yy = r.y * y2;
    let yz = r.y * z2;
    let zz = r.z * z2;
    let wx = r.w * x2;
    let wy = r.w * y2;
    let wz = r.w * z2;
    let sx = s.x;
    let sy = s.y;
    let sz = s.z;

    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = t.x;
    out[13] = t.y;
    out[14] = t.z;
    out[15] = 1;

    return mat4;
  },
  /**Calculates t,r,s from matrix values, arguments are outputs*/
  toTRS(t: Vec3Like, r: QuaternionLike, s: Vec3Like) {
    let mat = mat4.m;

    //modified from gl-matrix

    t.x = mat[12];
    t.y = mat[13];
    t.z = mat[14];

    let m11 = mat[0];
    let m12 = mat[1];
    let m13 = mat[2];
    let m21 = mat[4];
    let m22 = mat[5];
    let m23 = mat[6];
    let m31 = mat[8];
    let m32 = mat[9];
    let m33 = mat[10];

    s.x = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    s.y = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    s.z = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);

    let is1 = 1 / s.x;
    let is2 = 1 / s.y;
    let is3 = 1 / s.z;

    let sm11 = m11 * is1;
    let sm12 = m12 * is2;
    let sm13 = m13 * is3;
    let sm21 = m21 * is1;
    let sm22 = m22 * is2;
    let sm23 = m23 * is3;
    let sm31 = m31 * is1;
    let sm32 = m32 * is2;
    let sm33 = m33 * is3;

    let trace = sm11 + sm22 + sm33;
    let S = 0;

    if (trace > 0) {
      S = Math.sqrt(trace + 1.0) * 2;
      r.w = 0.25 * S;
      r.x = (sm23 - sm32) / S;
      r.y = (sm31 - sm13) / S;
      r.z = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
      r.w = (sm23 - sm32) / S;
      r.x = 0.25 * S;
      r.y = (sm12 + sm21) / S;
      r.z = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
      r.w = (sm31 - sm13) / S;
      r.x = (sm12 + sm21) / S;
      r.y = 0.25 * S;
      r.z = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
      r.w = (sm12 - sm21) / S;
      r.x = (sm31 + sm13) / S;
      r.y = (sm23 + sm32) / S;
      r.z = 0.25 * S;
    }

    return mat4;
  },
  perspective(fovy: number = 70*DEG2RAD, aspect: number = 1, near = 0.01, far = 100) {
    let out = mat4.m;
    const f = 1.0 / Math.tan(fovy / 2);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }

    return mat4;
  },
  orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number) {
    let out = mat4.m;

    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return mat4;
  }
};
