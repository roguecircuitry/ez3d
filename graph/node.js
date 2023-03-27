import { mat4 } from "../math/matrix.js";
import { Transform } from "../math/transform.js";
export class Node {
  constructor() {
    this.parent = null;
    this.children = new Set();
    this.transform = {
      local: new Transform(),
      global: new Transform()
    };
  }
  hasParent() {
    return this.parent != undefined && this.parent !== null;
  }
  _render(gl) {
    this.transform.local.renderMatrix(); //compute matrix based on transformation

    mat4.copy(this.transform.local.matrix).store(this.transform.global.matrix); //global equal to local

    if (this.parent) mat4.mul(this.parent.transform.global.matrix); //if have parent, multiply global by parent global

    this.transform.global.renderTRS(); //compute global transformation based on global matrix

    if (this.children) {
      for (let child of this.children) {
        child._render(gl);
      }
    }
    if (this.onUserRender) this.onUserRender(gl);
  }
}