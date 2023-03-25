import { CONSTS } from "./utils.js";
export class Mesh {
  constructor(gl, shader, vertices, indices, colors) {
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
  allocateBuffer(gl, buffer) {
    buffer.buffer = gl.createBuffer();
    return this;
  }
  referenceBuffer(gl, buffer) {
    gl.bindBuffer(buffer.bufferType, buffer.buffer);
    return this;
  }
  dataToBuffer(gl, buffer) {
    gl.bufferData(buffer.bufferType, buffer.data, buffer.usage);
  }
  tryDeallocateBuffer(gl, buffer) {
    if (buffer && buffer.buffer) {
      gl.deleteBuffer(buffer.buffer);
    }
    return this;
  }

  /**Automatic handle of creation or recreation of buffers, such as position or color*/
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
  configureAttribute(id, config) {
    let objClone = {};
    Object.assign(objClone, config);
    this.attribs[id] = objClone;
    objClone.location = this.gl.getAttribLocation(this.shader.program, id);
    return this;
  }
  updateVertexData(gl, vertices, indices, colors) {
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
  getAttribute(id) {
    return this.attribs[id];
  }
  enableAttribute(gl, id) {
    let attrib = this.attribs[id];
    if (!attrib.location) attrib.location = gl.getAttribLocation(this.shader.program, id);
    gl.enableVertexAttribArray(attrib.location);
    gl.vertexAttribPointer(attrib.location, attrib.size, attrib.type, attrib.normalized, attrib.stride, attrib.offset);
  }
  getBuffer(id) {
    return this.buffers[id];
  }
  draw() {
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