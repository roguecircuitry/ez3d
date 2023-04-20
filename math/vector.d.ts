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
export declare const vec: {
    v: Vec3Like;
    arrayRef: IndexableFloatArray;
    arrayIndex: number;
    create(x?: number, y?: number, z?: number): {
        x: number;
        y: number;
        z: number;
    };
    add(o: Vec3Like): any;
    sub(o: Vec3Like): any;
    mul(o: Vec3Like): any;
    div(o: Vec3Like): any;
    addScalar(s: number): any;
    subScalar(s: number): any;
    mulScalar(s: number): any;
    divScalar(s: number): any;
    copy(o: Vec3Like): any;
    store(o: Vec3Like): any;
    refArray(a: IndexableFloatArray): any;
    outArray(): any;
    refIndex(): any;
    cross(b: Vec3Like): any;
    lerp(o: Vec3Like, by: number): any;
};
