import { IndexableFloatArray } from "./general.js";
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
export declare function hsvToRgb(hsv: HSVLike, out: RGBALike): void;
export declare function RGBAWrite(v: RGBALike, a: IndexableFloatArray, offset: number): void;
export declare function RGBALerp(a: RGBALike, b: RGBALike, by: number, out: RGBALike): void;
