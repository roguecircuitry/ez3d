import { Node } from "./node.js";
export class SceneNode extends Node {
  constructor() {
    super();
  }
  render(gl) {
    super._render(gl);
  }
}