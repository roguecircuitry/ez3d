import { mat4 } from "../math/matrix";
import { Node } from "./node.js";
export class Camera extends Node {
  get type() {
    return this._type;
  }
  get fieldOfView() {
    return this._fieldOfView;
  }
  set fieldOfView(v) {
    if (v !== this._fieldOfView) this._projectionMatrixDirty = true;
    this._fieldOfView = v;
  }
  get aspect() {
    return this._aspect;
  }
  set aspect(v) {
    if (v !== this._aspect) this._projectionMatrixDirty = true;
    this._aspect = v;
  }
  get near() {
    return this._near;
  }
  set near(v) {
    if (v !== this._near) this._projectionMatrixDirty = true;
    this._near = v;
  }
  get far() {
    return this._far;
  }
  set far(v) {
    if (v !== this._far) this._projectionMatrixDirty = true;
    this._far = v;
  }
  get left() {
    return this._left;
  }
  set left(v) {
    if (this._left !== v) this._projectionMatrixDirty = true;
    this._left = v;
  }
  get right() {
    return this._right;
  }
  set right(v) {
    if (this._right !== v) this._projectionMatrixDirty = true;
    this._right = v;
  }
  get top() {
    return this._top;
  }
  set top(v) {
    if (this._top !== v) this._projectionMatrixDirty = true;
    this._top = v;
  }
  get bottom() {
    return this._bottom;
  }
  set bottom(v) {
    if (this._bottom !== v) this._projectionMatrixDirty = true;
    this._bottom = v;
  }
  setPerspective(fov, aspect, near, far) {
    this._fieldOfView = fov;
    this._aspect = aspect;
    this._near = near;
    this._far = far;
    this._projectionMatrixDirty = true;
    this._type = "perspective";
    return this;
  }
  setOrthographic(left, right, top, bottom, near, far) {
    this._projectionMatrixDirty = true;
    this._type = "orthographic";
    return this;
  }
  constructor() {
    super();
    this.projectionMatrix = mat4.create();
    this.viewProjectionMatrix = mat4.create();
    this.setPerspective(70, 1, 0.01, 100);
  }
  _render(gl) {
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