import { Vec3Like } from "./vector";
export interface QuaternionLike {
    x: number;
    y: number;
    z: number;
    w: number;
}
export declare const quat: {
    q: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    create(x?: number, y?: number, z?: number, w?: number): {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    copy(q: QuaternionLike): any;
    store(q: QuaternionLike): any;
    /**Generated by ChatGPT then modified to fit API style
     * Calculates this quaternion from radian based euler angles
     */
    fromEuler(euler: Vec3Like): any;
    mul(q: QuaternionLike): any;
};
