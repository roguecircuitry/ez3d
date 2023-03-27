
import { mat4, Mat4Like } from "./matrix.js";
import { quat, QuaternionLike } from "./quaternion.js";
import { vec, Vec3Like } from "./vector.js";

export class Transform {
  matrix: Mat4Like;

  position: Vec3Like;
  scale: Vec3Like;
  rotation: QuaternionLike;

  constructor () {
    this.position = vec.create();
    this.scale = vec.create();
    this.rotation = quat.create();

    this.matrix = mat4.create();
  }
  renderMatrix () {
    mat4.fromTRS(this.position, this.rotation, this.scale).store(this.matrix);
    return this;
  }
  renderTRS () {
    mat4.copy(this.matrix).toTRS(this.position, this.rotation, this.scale);
  }
}

