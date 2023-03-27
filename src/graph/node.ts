
import { mat4 } from "../math/matrix.js";
import { Transform } from "../math/transform.js";
import { Camera } from "./camera.js";
import { SceneNode } from "./scene.js";

export interface Node {
  onUserRender (cfg: RenderConfig): void;
}

export interface RenderConfig {
  scene: SceneNode;
  gl: WebGLRenderingContext;
  camera: Camera;
}

export class Node {
  parent: Node;

  children: Set<Node>;

  transform: {local: Transform, global: Transform};

  constructor () {
    this.parent = null;
    this.children = new Set();

    this.transform = {
      local: new Transform(),
      global: new Transform()
    };
  }
  hasParent () {
    return this.parent != undefined && this.parent !== null;
  }
  protected _render (cfg: RenderConfig) {
    this.transform.local.renderMatrix(); //compute matrix based on transformation
    
    // console.log("camera local xfrm", ...this.transform.local.matrix);

    mat4.copy(this.transform.local.matrix); //global equal to local

    if (this.parent) mat4.mul(this.parent.transform.global.matrix); //if have parent, multiply global by parent global

    mat4.store(this.transform.global.matrix);

    this.transform.global.renderTRS(); //compute global transformation based on global matrix

    if (this.children) {
      for (let child of this.children) {
        child._render(cfg);
      }
    }

    if (this.onUserRender) this.onUserRender(cfg);
  }
  add (child: Node): this {
    this.children.add(child);
    return this;
  }
  remove (child: Node): this {
    this.children.delete(child);
    return this;
  }
}
