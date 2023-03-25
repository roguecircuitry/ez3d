import { RGBAWrite, vec, Vec2Write, Vec3Write } from "./vector.js";
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
    let vertices;
    if (config.output.vertices) vertices = new Array(this._vertices.length * 3);
    i = 0;
    for (let v of this._vertices) {
      Vec3Write(v, vertices, i);
      i += 3;
    }
    let colors;
    if (config.output.colors) colors = new Array(this._colors.length * 4);
    i = 0;
    for (let v of this._colors) {
      RGBAWrite(v, colors, i);
      i += 4;
    }
    let uvs;
    if (config.output.uvs) uvs = new Array(this._uvs.length * 2);
    i = 0;
    for (let v of this._uvs) {
      Vec2Write(v, uvs, i);
      i += 2;
    }
    let normals;
    if (config.output.normals) normals = new Array(this._normals.length * 3);
    i = 0;
    for (let v of this._normals) {
      Vec3Write(v, normals, i);
      i += 3;
    }
    let indices;
    if (config.output.indices) indices = new Array(this._indices.length * 3);
    i = 0;
    for (let v of this._indices) {
      Vec3Write(v, indices, i);
      i += 3;
    }

    //TODO handle optional params, also handle UVs and normals
    config.output.mesh.updateVertexData(config.gl, vertices, indices, colors);
    return this;
  }
}