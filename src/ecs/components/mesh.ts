
import { mat4, Mat4Like } from "../../math/matrix.js";
import { Mesh } from "../../mesh.js";
import { Entity, Scene, Shader } from "../../mod.js";
import { Component } from "../component.js";
import { TransformComponent } from "./transform.js";

export class MeshComponent extends Component {
  mesh: Mesh;
  get shader () {
    return this.mesh.shader;
  }
  set shader (s: Shader) {
    this.mesh.shader = s;
  }
  init (gl: WebGLRenderingContext) {
    return this.mesh.init(gl);
  }

  transform: TransformComponent;

  tvpMatrix: Mat4Like;

  constructor () {
    super();

    this.mesh = new Mesh();

    
    this.tvpMatrix = mat4.create();
  }
  
  mounted () {
    this.transform = this.requireComponent(TransformComponent);
  }
  
  update (scene: Scene): void {
    if (!scene.mainCamera) {
      console.warn("cannot render mesh, no camera yet");
      return;
    }

    mat4
    .copy(scene.mainCamera.viewProjectionMatrix)
    .mul(this.transform.global.matrix)
    .store(this.tvpMatrix);
    this.mesh.draw(scene.ctx, this.tvpMatrix);
  }

}
