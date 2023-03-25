
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
  private gl: WebGLRenderingContext;

  shader: Shader;

  attribs: MeshAttribs;
  buffers: MeshBuffers;

  private vertices: Float32Array;
  private indices: Uint16Array;
  private colors: Float32Array;
  
  constructor(gl: WebGLRenderingContext, shader: Shader, vertices: number[], indices: number[], colors: number[]) {
    this.gl = gl;
    this.shader = shader;
    this.buffers = {};

    this.updateVertexData(gl, vertices, indices, colors);

    this.attribs = {};


    this.configureAttribute(CONSTS.aVertex, {
      size: 3,
      type: gl.FLOAT,
      normalized: false
    });

    this.configureAttribute(CONSTS.aColor, {
      size: 4,
      type: gl.FLOAT,
      normalized: false
    });
  }

  public allocateBuffer(gl: WebGLRenderingContext, buffer: MeshBuffer) {
    buffer.buffer = gl.createBuffer();
    return this;
  }

  public referenceBuffer (gl: WebGLRenderingContext, buffer: MeshBuffer) {
    gl.bindBuffer(buffer.bufferType, buffer.buffer);
    return this;
  }

  public dataToBuffer (gl: WebGLRenderingContext, buffer: MeshBuffer) {
    gl.bufferData(buffer.bufferType, buffer.data, buffer.usage);
  }

  public tryDeallocateBuffer (gl: WebGLRenderingContext, buffer: MeshBuffer) {
    if (buffer && buffer.buffer) {
      gl.deleteBuffer(buffer.buffer);
    }
    return this;
  }

  /**Automatic handle of creation or recreation of buffers, such as position or color*/
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

  public configureAttribute(id: string, config: MeshAttrib) {
    let objClone = {} as MeshAttrib;
    Object.assign(objClone, config);
    this.attribs[id] = objClone;
    objClone.location = this.gl.getAttribLocation(this.shader.program, id);
    return this;
  }

  updateVertexData(gl: WebGLRenderingContext, vertices: number[], indices: number[], colors: number[]) {

    this.vertices = new Float32Array(vertices);
    this.indices = new Uint16Array(indices);
    this.colors = new Float32Array(colors);
    
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

  public getAttribute(id: string): MeshAttrib {
    return this.attribs[id];
  }

  public enableAttribute(gl: WebGLRenderingContext, id: string) {
    let attrib = this.attribs[id];

    if (!attrib.location) attrib.location = gl.getAttribLocation(this.shader.program, id);
    gl.enableVertexAttribArray(attrib.location);
    gl.vertexAttribPointer(attrib.location, attrib.size, attrib.type, attrib.normalized, attrib.stride, attrib.offset);
  }

  public getBuffer (id: string) {
    return this.buffers[id];
  }

  public draw() {
    const gl = this.gl;

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

    // Draw the mesh
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  }
}

