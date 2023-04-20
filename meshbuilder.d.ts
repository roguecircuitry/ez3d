import { RGBALike } from "./math/color.js";
import { Vec2Like, Vec3Like } from "./math/vector.js";
import { Mesh } from "./mesh.js";
export interface BuildConfig {
    output: {
        mesh: Mesh;
        indices?: boolean;
        vertices?: boolean;
        uvs?: boolean;
        colors?: boolean;
        normals?: boolean;
    };
    gl: WebGLRenderingContext;
}
export declare class MeshBuilder {
    _vertices: Array<Vec3Like>;
    _normals: Array<Vec3Like>;
    _indices: Array<Vec3Like>;
    _colors: Array<RGBALike>;
    _uvs: Array<Vec2Like>;
    constructor();
    clear(): void;
    verts(...verts: Vec3Like[]): this;
    uvs(...uvs: Vec2Like[]): this;
    normals(...ns: Vec3Like[]): this;
    colors(...cs: RGBALike[]): this;
    indices(...inds: Vec3Like[]): this;
    build(config: BuildConfig): this;
}
