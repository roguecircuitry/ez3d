import { mat4 } from "./matrix.js";
import { quat } from "./quaternion.js";
import { vec } from "./vector.js";
export class Transform {
  constructor() {
    this.position = vec.create();
    this.scale = vec.create();
    this.rotation = quat.create();
    this.matrix = mat4.create();
  }
  renderMatrix() {
    mat4.fromTRS(this.position, this.rotation, this.scale).store(this.matrix);
    return this;
  }
  renderTRS() {
    mat4.copy(this.matrix).toTRS(this.position, this.rotation, this.scale);
  }
}