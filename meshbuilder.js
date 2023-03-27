import { RGBAWrite } from "./math/color.js";
import { vec, Vec3Write } from "./math/vector.js";
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
  // trindex: number;

  constructor() {
    // this.trindex = 0;
    this.clear();
  }
  clear() {
    this._vertices = new Array();
    this._normals = new Array();
    this._indices = new Array();
    this._colors = new Array();
    this._uvs = new Array();
  }
  verts(...verts) {
    this._vertices.push(...verts);
    return this;
  }
  uvs(...uvs) {
    this._uvs.push(...uvs);
    return this;
  }
  normals(...ns) {
    this._normals.push(...ns);
    return this;
  }
  colors(...cs) {
    this._colors.push(...cs);
    return this;
  }
  indices(...inds) {
    this._indices.push(...inds);
    return this;
  }
  build(config) {
    let i;
    if (config.output.vertices) config.output.mesh.vertices = new Float32Array(this._vertices.length * 3);
    i = 0;
    for (let v of this._vertices) {
      Vec3Write(v, config.output.mesh.vertices, i);
      i += 3;
    }
    if (config.output.colors) config.output.mesh.colors = new Float32Array(this._colors.length * 4);
    i = 0;
    for (let v of this._colors) {
      RGBAWrite(v, config.output.mesh.colors, i);
      i += 4;
    }

    // if (config.output.uvs) config.output.mesh.uvs = new Float32Array(this._uvs.length*2);
    // i=0; for (let v of this._uvs) { Vec2Write(v, config.output.mesh.uvs, i); i+=2; }

    // if (config.output.normals) config.output.mesh.normals = new Float32Array(this._normals.length*3);
    // i=0; for (let v of this._normals) { Vec3Write(v, config.output.mesh.normals, i); i+=3; }

    if (config.output.indices) config.output.mesh.indices = new Uint16Array(this._indices.length * 3);
    i = 0;
    for (let v of this._indices) {
      Vec3Write(v, config.output.mesh.indices, i);
      i += 3;
    }

    //TODO handle optional params, also handle UVs and normals
    config.output.mesh.updateVertexData(config.gl);
    return this;
  }
}