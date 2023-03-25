
import { Mesh } from "./mesh.js";
import { vec, Vec3Like } from "./vector.js";

function normal(a: Vec3Like, b: Vec3Like, c: Vec3Like, out: Vec3Like) {
  let ab = {x:0,y:0,z:0};
  let ac = {x:0,y:0,z:0};

  vec.copy(b).sub(a).store(ab);
  vec.copy(c).sub(a).store(ac);

  vec.copy(ab).cross(ac).store(out);

  return out;
}

export class MeshBuilder {
  private positions: number[] = [];
  private normals: number[] = [];
  private indices: number[] = [];

  tri (a: Vec3Like, b: Vec3Like, c: Vec3Like): this {
    this.positions.push(
      a.x, a.y, a.z,
      b.x, b.y, b.z,
      c.x, c.y, c.z
    );
    let n = {x:0,y:0,z:0};
    normal(a, b, c, n);
    this.normals.push(n.x, n.y, n.z);

    const startIndex = this.positions.length / 3;

    this.indices.push(startIndex, startIndex+1, startIndex+2);

    return this;
  }

  build(out: Mesh): this {
    out.positions = this.positions;
    out.normals = this.normals;
    out.indices = this.indices;

    out.build();

    return this;
  }
}
