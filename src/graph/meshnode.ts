
import { Mesh } from "../mesh.js";
import { Node } from "./node.js"; //not to be confused with node.js ...

export class MeshNode extends Node {
  mesh: Mesh;

  constructor () {
    super();

    this.mesh = new Mesh();

  }
  protected _render(gl: WebGLRenderingContext): void {
    super._render(gl);
    this.mesh.draw(gl);
  }

}
