import { Mat4Like } from "./math/matrix.js";
import { Shader } from "./shader.js";
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
export declare class Mesh {
    shader: Shader;
    attribs: MeshAttribs;
    buffers: MeshBuffers;
    vertices: Float32Array;
    indices: Uint16Array;
    colors: Float32Array;
    constructor(shader?: Shader);
    init(gl: WebGLRenderingContext): void;
    /**Tell the GPU we need a GPU side storage and we'd like it now plz*/
    allocateBuffer(gl: WebGLRenderingContext, buffer: MeshBuffer): this;
    /**Tell the GPU we want to talk about a specific 'buffer'*/
    referenceBuffer(gl: WebGLRenderingContext, buffer: MeshBuffer): this;
    /**Tell GPU to move buffer.data (created on CPU by code) to buffer.buffer (allocated on GPU by webgl)*/
    dataToBuffer(gl: WebGLRenderingContext, buffer: MeshBuffer): void;
    /**Tell GPU the free up a buffer, we won't be utilizing its data ever again
     * Does nothing if the WebGLBuffer hasn't been created yet
     */
    tryDeallocateBuffer(gl: WebGLRenderingContext, buffer: MeshBuffer): this;
    /**Initialize a buffer, either for the first time, or updating existing buffer
     * Useful for added data per vertex, such as position, color, uvs, indices, etc
     */
    configureBuffer(gl: WebGLRenderingContext, id: string, config: MeshBuffer): this;
    /**Initialize an attribute, either for the first time, or updating existing attribute
     * config will be cloned to reduce confusion. you should update attributes by calling configureAttribute again, not by modifying the obj passed as 'config'
     */
    configureAttribute(gl: WebGLRenderingContext, id: string, config: MeshAttrib): this;
    /**Convenience function for updating the mesh with different geometry
     * Safe to call even if no previous buffers/etc, this is actually called in the constructor of Mesh class
     *
     * Simply modify this.vertices, this.indicies, etc, then call mesh.updateVertexData(gl)
     */
    updateVertexData(gl: WebGLRenderingContext): void;
    /**Get an attribute by its id*/
    getAttribute(id: string): MeshAttrib;
    /**activate an attribute for the purpose of rendering with its data*/
    enableAttribute(gl: WebGLRenderingContext, id: string): void;
    /**Get a buffer by its id*/
    getBuffer(id: string): MeshBuffer;
    /**Render the mesh*/
    draw(gl: WebGLRenderingContext, uTransViewProjMat4: Mat4Like): boolean;
}
