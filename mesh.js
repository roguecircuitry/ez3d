import { CONSTS } from "./utils.js";
export class Mesh {
  constructor(shader) {
    this.buffers = {};
    this.shader = shader;
  }
  init(gl) {
    this.buffers = {};
    this.vertices = new Float32Array([0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0]);
    this.indices = new Uint16Array([0, 1, 2]);
    this.colors = new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1]);

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
  allocateBuffer(gl, buffer) {
    buffer.buffer = gl.createBuffer();
    return this;
  }

  /**Tell the GPU we want to talk about a specific 'buffer'*/
  referenceBuffer(gl, buffer) {
    gl.bindBuffer(buffer.bufferType, buffer.buffer);
    return this;
  }

  /**Tell GPU to move buffer.data (created on CPU by code) to buffer.buffer (allocated on GPU by webgl)*/
  dataToBuffer(gl, buffer) {
    gl.bufferData(buffer.bufferType, buffer.data, buffer.usage);
  }

  /**Tell GPU the free up a buffer, we won't be utilizing its data ever again
   * Does nothing if the WebGLBuffer hasn't been created yet
   */
  tryDeallocateBuffer(gl, buffer) {
    if (buffer && buffer.buffer) {
      gl.deleteBuffer(buffer.buffer);
    }
    return this;
  }

  /**Initialize a buffer, either for the first time, or updating existing buffer
   * Useful for added data per vertex, such as position, color, uvs, indices, etc
   */
  configureBuffer(gl, id, config) {
    let buffer = {};
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
  configureAttribute(gl, id, config) {
    let objClone = {};
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
  updateVertexData(gl) {
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
  getAttribute(id) {
    return this.attribs[id];
  }

  /**activate an attribute for the purpose of rendering with its data*/
  enableAttribute(gl, id) {
    let attrib = this.attribs[id];
    if (!attrib.location) attrib.location = gl.getAttribLocation(this.shader.program, id);
    gl.enableVertexAttribArray(attrib.location);
    gl.vertexAttribPointer(attrib.location, attrib.size, attrib.type, attrib.normalized, attrib.stride, attrib.offset);
  }

  /**Get a buffer by its id*/
  getBuffer(id) {
    return this.buffers[id];
  }

  /**Render the mesh*/
  draw(gl) {
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

    // Draw the mesh
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    return true;
  }
}