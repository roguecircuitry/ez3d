
import { Node, RenderConfig } from "./node.js";

export class SceneNode extends Node{
  constructor () {
    super();
  }
  render (cfg: RenderConfig) {
    super._render(cfg);
  }
}
