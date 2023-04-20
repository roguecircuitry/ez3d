import { mat4 } from "../../math/matrix.js";
import { Mesh } from "../../mesh.js";
import { Component } from "../component.js";
import { TransformComponent } from "./transform.js";
export class MeshComponent extends Component {
  get shader() {
    return this.mesh.shader;
  }
  set shader(s) {
    this.mesh.shader = s;
  }
  init(gl) {
    return this.mesh.init(gl);
  }
  constructor(entity) {
    super(entity);
    this.mesh = new Mesh();
    this.transform = this.requireComponent(TransformComponent);
    this.tvpMatrix = mat4.create();
  }
  update(scene) {
    if (!scene.mainCamera) {
      console.warn("cannot render mesh, no camera yet");
      return;
    }
    mat4.copy(scene.mainCamera.viewProjectionMatrix).mul(this.transform.global.matrix).store(this.tvpMatrix);
    this.mesh.draw(scene.ctx, this.tvpMatrix);
  }
}