
import { mat4, Mat4Like } from "../math/matrix.js";
import { Mesh } from "../mesh.js";
import { Node, RenderConfig } from "./node.js"; //not to be confused with node.js ...

export class MeshNode extends Node {
  mesh: Mesh;
  /**Transform + camera view + camera projection matrix*/
  tvpMatrix: Mat4Like;

  constructor () {
    super();
    this.tvpMatrix = mat4.create();
    
    this.mesh = new Mesh();

  }
  protected _render(cfg: RenderConfig): void {
    super._render(cfg);
    mat4
    .copy(cfg.camera.viewProjectionMatrix)
    .mul(this.transform.global.matrix)
    .store(this.tvpMatrix);
    // console.log(...this.tvpMatrix);
    this.mesh.draw(cfg.gl, this.tvpMatrix);
  }

}
