
import { mat4, Mat4Like } from "../math/matrix";
import { Node } from "./node.js";

export type CameraType = "orthographic"|"perspective";

export class Camera extends Node {
  private _type: CameraType;
  get type () {
    return this._type;
  }

  private _projectionMatrixDirty: boolean;
  private projectionMatrix: Mat4Like;
  private viewProjectionMatrix: Mat4Like;

  private _fieldOfView: number;
  get fieldOfView (): number {
    return this._fieldOfView;
  }
  set fieldOfView (v: number) {
    if (v !== this._fieldOfView) this._projectionMatrixDirty = true;
    this._fieldOfView = v;
  }

  private _aspect: number;
  get aspect () {
    return this._aspect;
  }
  set aspect (v: number) {
    if (v !== this._aspect) this._projectionMatrixDirty = true;
    this._aspect = v;
  }

  private _near: number;
  get near () {
    return this._near;
  }
  set near (v: number) {
    if (v !== this._near) this._projectionMatrixDirty = true;
    this._near = v;
  }

  private _far: number;
  get far () {
    return this._far;
  }
  set far (v: number) {
    if (v !== this._far) this._projectionMatrixDirty = true;
    this._far = v;
  }

  private _left: number;
  get left () {
    return this._left;
  }
  set left (v: number) {
    if (this._left !== v) this._projectionMatrixDirty = true;
    this._left = v;
  }
  private _right: number;
  get right () {
    return this._right;
  }
  set right (v: number) {
    if (this._right !== v) this._projectionMatrixDirty = true;
    this._right = v;
  }
  private _top: number;
  get top () {
    return this._top;
  }
  set top (v: number) {
    if (this._top !== v) this._projectionMatrixDirty = true;
    this._top = v;
  }
  private _bottom: number;
  get bottom () {
    return this._bottom;
  }
  set bottom (v: number) {
    if (this._bottom !== v) this._projectionMatrixDirty = true;
    this._bottom = v;
  }
  setPerspective (fov: number, aspect: number, near: number, far: number): this {
    this._fieldOfView = fov;
    this._aspect = aspect;
    this._near = near;
    this._far = far;
    this._projectionMatrixDirty = true;
    this._type = "perspective";
    return this;
  }
  setOrthographic (left: number, right: number, top: number, bottom: number, near: number, far: number): this {
    
    this._projectionMatrixDirty = true;
    this._type = "orthographic";
    return this;
  }

  constructor () {
    super();
    this.projectionMatrix = mat4.create();
    this.viewProjectionMatrix = mat4.create();

    this.setPerspective(70, 1, 0.01, 100);
  }

  protected _render(gl: WebGLRenderingContext): void {
    super._render(gl);
    
    if (this._projectionMatrixDirty) {
      if (this._type === "orthographic") {
        mat4.orthographic(this._left, this._right, this._bottom, this._top, this._near, this._far);
      } else {
        mat4.perspective(this._fieldOfView, this._aspect, this._near, this._far);
      }
      this._projectionMatrixDirty = false;
    }

    //calculate view + projection matrix
    mat4.copy(this.transform.global.matrix).mul(this.projectionMatrix).store(this.viewProjectionMatrix);
  }
}
