import { Mesh } from "../mesh.js";
import { Node } from "./node.js"; //not to be confused with node.js ...

export class MeshNode extends Node {
  constructor() {
    super();
    this.mesh = new Mesh();
  }
  _render(gl) {
    super._render(gl);
    this.mesh.draw(gl);
  }
}