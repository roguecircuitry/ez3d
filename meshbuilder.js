function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import { vec } from "./vector.js";
function normal(a, b, c, out) {
  let ab = {
    x: 0,
    y: 0,
    z: 0
  };
  let ac = {
    x: 0,
    y: 0,
    z: 0
  };
  vec.copy(b).sub(a).store(ab);
  vec.copy(c).sub(a).store(ac);
  vec.copy(ab).cross(ac).store(out);
  return out;
}
export class MeshBuilder {
  constructor() {
    _defineProperty(this, "positions", []);
    _defineProperty(this, "normals", []);
    _defineProperty(this, "indices", []);
  }
  tri(a, b, c) {
    this.positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    let n = {
      x: 0,
      y: 0,
      z: 0
    };
    normal(a, b, c, n);
    this.normals.push(n.x, n.y, n.z);
    const startIndex = this.positions.length / 3;
    this.indices.push(startIndex, startIndex + 1, startIndex + 2);
    return this;
  }
  build(out) {
    out.positions = this.positions;
    out.normals = this.normals;
    out.indices = this.indices;
    out.build();
    return this;
  }
}