/**
 * Say, a lot of this code is straight from gl-matrix.. why not just import that?
 *
 * 1. mat4.js at time of writting has 2180 LOC, this file is 354 LOC
 * 2. Easier to use when you have to crawl thru it
 * 3. the style here is a bit different, less intermediary variables to track in your code
 * 4. some parts missing, such as rotating matrix by quaternion, are added here added by ChatGPT - and no, i dont want to create an intermediate rotation matrix
*/
import { QuaternionLike } from "./quaternion.js";
import { Vec3Like } from "./vector.js";
export declare type Mat4Like = Float32Array;
export declare const Mat4FloatCount = 16;
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
export declare const mat4: Mat4Singleton;
