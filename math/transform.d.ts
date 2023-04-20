import { Mat4Like } from "./matrix.js";
import { QuaternionLike } from "./quaternion.js";
import { Vec3Like } from "./vector.js";
export declare class Transform {
    matrix: Mat4Like;
    position: Vec3Like;
    scale: Vec3Like;
    rotation: QuaternionLike;
    constructor();
    renderMatrix(): this;
    renderTRS(): void;
}
