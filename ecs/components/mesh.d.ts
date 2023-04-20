import { Mat4Like } from "../../math/matrix.js";
import { Mesh } from "../../mesh.js";
import { Entity, Scene, Shader } from "../../mod.js";
import { Component } from "../component.js";
import { TransformComponent } from "./transform.js";
export declare class MeshComponent extends Component {
    mesh: Mesh;
    get shader(): Shader;
    set shader(s: Shader);
    init(gl: WebGLRenderingContext): void;
    transform: TransformComponent;
    tvpMatrix: Mat4Like;
    constructor(entity: Entity);
    update(scene: Scene): void;
}
