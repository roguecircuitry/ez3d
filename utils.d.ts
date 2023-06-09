/**Generated by ChatGPT, Mar 25, 2023
 * An implementation of debouncing
*/
export declare function debounce(func: Function, delay: number): () => void;
export declare const CONSTS: {
    /**Attribute for vertex position in a shader*/
    aVertex: string;
    /**Attribute for vertex color in a shader*/
    aColor: string;
    /**Varying, for handing color per vertex from vertex shader to fragment shader*/
    vColor: string;
    /**WebGLBuffer for vertices*/
    bVertices: string;
    /**WebGLBuffer for indices*/
    bIndices: string;
    /**WebGLBuffer for colors*/
    bColors: string;
    /**Model transform + camera view + camera projection matrix*/
    uTransViewProjMatrix: string;
};
export interface AssignTransformer<T> {
    (v: any): T;
}
/**Generated by ChatGPT, Mar 25, 2023*/
export declare function assignWithSpread<T>(target: T, source: any, transform: AssignTransformer<unknown>, ...keysToInclude: string[]): T;
/**Generated by ChatGPT, Mar 25, 2023*/
/**Generated by ChatGPT, Mar 25, 2023*/
export declare function resize(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext): void;
