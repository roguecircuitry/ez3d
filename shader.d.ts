export declare class Shader {
    private vertexShaderSource;
    private fragmentShaderSource;
    program: WebGLProgram;
    constructor(vertexShaderSource: string, fragmentShaderSource: string);
    createProgram(gl: WebGLRenderingContext): WebGLProgram;
    use(gl: WebGLRenderingContext): void;
}
