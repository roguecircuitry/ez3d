import { mat4 } from "../math/matrix.js";
import { Mesh } from "../mesh.js";
import { Node } from "./node.js"; //not to be confused with node.js ...

export class MeshNode extends Node {
  /**Transform + camera view + camera projection matrix*/

  constructor() {
    super();
    this.tvpMatrix = mat4.create();
    this.mesh = new Mesh();
  }
  _render(cfg) {
    super._render(cfg);
    mat4.copy(this.transform.global.matrix).mul(cfg.camera.viewProjectionMatrix).store(this.tvpMatrix);
    console.log(...this.tvpMatrix);
    this.mesh.draw(cfg.gl, this.tvpMatrix);
  }
}