
import { Mesh } from "./mesh.js";
import { RGBALike, RGBAWrite, vec, Vec2Like, Vec2Write, Vec3Like, Vec3Write } from "./vector.js";

function normal(a: Vec3Like, b: Vec3Like, c: Vec3Like, out: Vec3Like) {
  let ab = {x:0,y:0,z:0};
  let ac = {x:0,y:0,z:0};

  vec.copy(b).sub(a).store(ab);
  vec.copy(c).sub(a).store(ac);

  vec.copy(ab).cross(ac).store(out);

  return out;
}

export interface BuildConfig {
  output: {
    mesh: Mesh;
    indices?: boolean;
    vertices?: boolean;
    uvs?: boolean;
    colors?: boolean;
    normals?: boolean;
  }
  gl: WebGLRenderingContext;
}

export class MeshBuilder {
  _vertices: Array<Vec3Like>;
  _normals: Array<Vec3Like>;
  _indices: Array<Vec3Like>;
  _colors: Array<RGBALike>;
  _uvs: Array<Vec2Like>;

  // trindex: number;

  constructor () {
    // this.trindex = 0;
    this.clear();
  }

  private clear() {
    this._vertices = new Array();
    this._normals = new Array();
    this._indices = new Array();
    this._colors = new Array();
    this._uvs = new Array();
  }

  verts (...verts: Vec3Like[]) {
    this._vertices.push(...verts);
    return this;
  }
  uvs (...uvs: Vec2Like[]) {
    this._uvs.push(...uvs);
    return this;
  }
  normals (...ns: Vec3Like[]) {
    this._normals.push(...ns);
    return this;
  }
  colors (...cs: RGBALike[]) {
    this._colors.push(...cs);
    return this;
  }
  indices (...inds: Vec3Like[]) {
    this._indices.push(...inds);
    return this;
  }

  build(config: BuildConfig): this {
    let i: number;
    
    let vertices: Array<number>;
    if (config.output.vertices) vertices = new Array<number>(this._vertices.length*3);
    i=0; for (let v of this._vertices) { Vec3Write(v, vertices, i); i+=3; }

    let colors: Array<number>;
    if (config.output.colors) colors = new Array<number>(this._colors.length*4);
    i=0; for (let v of this._colors) { RGBAWrite(v, colors, i); i+=4; }

    let uvs: Array<number>;
    if (config.output.uvs) uvs = new Array<number>(this._uvs.length*2);
    i=0; for (let v of this._uvs) { Vec2Write(v, uvs, i); i+=2; }

    let normals: Array<number>;
    if (config.output.normals) normals = new Array<number>(this._normals.length*3);
    i=0; for (let v of this._normals) { Vec3Write(v, normals, i); i+=3; }

    let indices: Array<number>;
    if (config.output.indices) indices = new Array<number>(this._indices.length*3);
    i=0; for (let v of this._indices) { Vec3Write(v, indices, i); i+=3; }

    //TODO handle optional params, also handle UVs and normals
    config.output.mesh.updateVertexData(
      config.gl,
      vertices,
      indices,
      colors
    );
    return this;
  }
}
