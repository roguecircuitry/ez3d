import { IndexableFloatArray } from "./general.js";
export interface Vec2Like {
    x: number;
    y: number;
}
export declare function Vec2Write(v: Vec2Like, a: IndexableFloatArray, offset: number): void;
export interface Vec3Like extends Vec2Like {
    z: number;
}
export declare function Vec3Write(v: Vec3Like, a: IndexableFloatArray, offset: number): void;
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
}
export declare const vec: VecSingleton;
