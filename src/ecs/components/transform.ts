
import type { Scene } from "../../graph/scene";

import { Transform } from "../../math/transform.js";
import { mat4 } from "../../math/matrix.js";
import { Component } from "../component.js";

export class TransformComponent extends Component {
  static singleton: true;

  /**Parents kept track of via Transform Compoents, aka entities don't have to be transformable*/
  parentTransform: TransformComponent;

  /**global transform matrix used for shader render
   * global pos, rot, scale used for logic (read only)
   * local pos, rot, scale used for logic (read/write)
    local transform matrix used for calculating global matrix
  */
  global: Transform;
  local: Transform;

  children: Set<TransformComponent>;

  constructor () {
    super();

    this.global = new Transform();
    this.local = new Transform();

    this.children = new Set();
  }
  update(scene: Scene): void {
    super.update(scene);

    //update local transform matrix representation given its position, rotation, and scale information
    this.local.renderMatrix();

    //matrix mul not commutative
    mat4.copy(this.local.matrix)
    if (this.parentTransform) mat4.mul(this.parentTransform.global.matrix);
    mat4.store(this.global.matrix);

    this.global.renderTRS(); //update global position, rotation, scale from global matrix

    if (this.children.size > 0) {
      for (const child of this.children) {
        child.update(scene);
      }
    }
  }
  add (child: TransformComponent): this {
    this.children.add(child);
    child.parentTransform = this;
    return this;
  }
  remove (child: TransformComponent): this {
    this.children.delete(child);
    child.parentTransform = null;
    return this;
  }
}
