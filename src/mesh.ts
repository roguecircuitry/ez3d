
import { Mat4Like } from "./math/matrix.js";
import { Shader } from "./shader.js";
import { CONSTS } from "./utils.js";

export interface MeshAttrib {
  location?: number;
  size: number;
  type: number;
  normalized?: boolean;
  stride?: number;
  offset?: number;
}

export interface MeshAttribs {
  [key: string]: MeshAttrib;
}

export interface MeshBuffer {
  /**gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER*/
  bufferType: number;
  buffer?: WebGLBuffer;
  
  dataType: "Float32Array" | "Uint16Array";
  data: Float32Array | Uint16Array;
  
  /**gl.STATIC_DRAW*/
  usage: number;
}

export interface MeshBuffers {
  [key: string]: MeshBuffer;
}

export class Mesh {
  shader: Shader;

  attribs: MeshAttribs;
  buffers: MeshBuffers;

  vertices: Float32Array;
  indices: Uint16Array;
  colors: Float32Array;
  
  constructor(shader?: Shader) {
    this.buffers = {};

    this.shader = shader;
  }

  init (gl: WebGLRenderingContext) {
    this.buffers = {};

    this.vertices = new Float32Array([
      0.0, 0.5, 0.0,
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0,
    ]);
    this.indices = new Uint16Array([
      0, 1, 2,
    ]);
    this.colors = new Float32Array([
      1, 0, 0, 1,
      0, 1, 0, 1,
      0, 0, 1, 1
    ]);

    //initial geometry set here
    this.updateVertexData(gl);
    
    //attributes so shader knows how to talk about our geometry
    this.attribs = {};

    this.configureAttribute(gl, CONSTS.aVertex, {
      size: 3,
      type: gl.FLOAT,
      normalized: false
    });

    this.configureAttribute(gl, CONSTS.aColor, {
      size: 4,
      type: gl.FLOAT,
      normalized: false
    });
  }

  /**Tell the GPU we need a GPU side storage and we'd like it now plz*/
  public allocateBuffer(gl: WebGLRenderingContext, buffer: MeshBuffer) {
    buffer.buffer = gl.createBuffer();
    return this;
  }

  /**Tell the GPU we want to talk about a specific 'buffer'*/
  public referenceBuffer (gl: WebGLRenderingContext, buffer: MeshBuffer) {
    gl.bindBuffer(buffer.bufferType, buffer.buffer);
    return this;
  }

  /**Tell GPU to move buffer.data (created on CPU by code) to buffer.buffer (allocated on GPU by webgl)*/
  public dataToBuffer (gl: WebGLRenderingContext, buffer: MeshBuffer) {
    gl.bufferData(buffer.bufferType, buffer.data, buffer.usage);
  }

  /**Tell GPU the free up a buffer, we won't be utilizing its data ever again
   * Does nothing if the WebGLBuffer hasn't been created yet
   */
  public tryDeallocateBuffer (gl: WebGLRenderingContext, buffer: MeshBuffer) {
    if (buffer && buffer.buffer) {
      gl.deleteBuffer(buffer.buffer);
    }
    return this;
  }

  /**Initialize a buffer, either for the first time, or updating existing buffer
   * Useful for added data per vertex, such as position, color, uvs, indices, etc
   */
  public configureBuffer(gl: WebGLRenderingContext, id: string, config: MeshBuffer) {
    let buffer = {} as MeshBuffer;
    Object.assign(buffer, config);

    //cleanup
    this.tryDeallocateBuffer(gl, this.buffers[id]);
    
    //setup new buffer
    //save the reference for later
    this.buffers[id] = buffer;

    //allocate on GPU
    this.allocateBuffer(gl, buffer);
    //talk about the new GPU buffer
    this.referenceBuffer(gl, buffer);
    //move CPU bound data (see config.data) to GPU buffer
    this.dataToBuffer(gl, buffer);

    return this;
  }

  /**Initialize an attribute, either for the first time, or updating existing attribute
   * config will be cloned to reduce confusion. you should update attributes by calling configureAttribute again, not by modifying the obj passed as 'config'
   */
  public configureAttribute(gl: WebGLRenderingContext, id: string, config: MeshAttrib) {
    let objClone = {} as MeshAttrib;
    Object.assign(objClone, config);
    this.attribs[id] = objClone;
    objClone.location = gl.getAttribLocation(this.shader.program, id);
    return this;
  }

  /**Convenience function for updating the mesh with different geometry
   * Safe to call even if no previous buffers/etc, this is actually called in the constructor of Mesh class
   * 
   * Simply modify this.vertices, this.indicies, etc, then call mesh.updateVertexData(gl)
   */
  updateVertexData(gl: WebGLRenderingContext) {
    // Create vertex buffer
    this.configureBuffer(gl, CONSTS.bVertices, {
      data: this.vertices,
      bufferType: gl.ARRAY_BUFFER,
      dataType: "Float32Array",
      usage: gl.STATIC_DRAW
    });

    // Create index buffer
    this.configureBuffer(gl, CONSTS.bIndices, {
      data: this.indices,
      bufferType: gl.ELEMENT_ARRAY_BUFFER,
      dataType: "Uint16Array",
      usage: gl.STATIC_DRAW
    });

    this.configureBuffer(gl, CONSTS.bColors, {
      data: this.colors,
      bufferType: gl.ARRAY_BUFFER,
      dataType: "Float32Array",
      usage: gl.STATIC_DRAW
    });
  }

  /**Get an attribute by its id*/
  public getAttribute(id: string): MeshAttrib {
    return this.attribs[id];
  }

  /**activate an attribute for the purpose of rendering with its data*/
  public enableAttribute(gl: WebGLRenderingContext, id: string) {
    let attrib = this.attribs[id];

    if (!attrib.location) attrib.location = gl.getAttribLocation(this.shader.program, id);
    gl.enableVertexAttribArray(attrib.location);
    gl.vertexAttribPointer(attrib.location, attrib.size, attrib.type, attrib.normalized, attrib.stride, attrib.offset);
  }

  /**Get a buffer by its id*/
  public getBuffer (id: string) {
    return this.buffers[id];
  }

  /**Render the mesh*/
  public draw(gl: WebGLRenderingContext, uTransViewProjMat4: Mat4Like): boolean {
    if (!this.shader) return false;

    // Use the program
    gl.useProgram(this.shader.program);

    // Bind the vertex buffer
    this.referenceBuffer(gl, this.getBuffer(CONSTS.bVertices));

    // Bind the index buffer
    this.referenceBuffer(gl, this.getBuffer(CONSTS.bIndices));

    // Enable the vertex position attribute
    this.enableAttribute(gl, CONSTS.aVertex);

    // Bind the color buffer
    this.referenceBuffer(gl, this.getBuffer(CONSTS.bColors));
    // Enable the vertex color attribute
    this.enableAttribute(gl, CONSTS.aColor);

    //pass in matrix to shader uniforms
    const uTransViewProjMatrixLocation = gl.getUniformLocation(this.shader.program, CONSTS.uTransViewProjMatrix);
    gl.uniformMatrix4fv(uTransViewProjMatrixLocation, false, uTransViewProjMat4);

    // Draw the mesh
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

    return true;
  }
}

