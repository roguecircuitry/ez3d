export class Shader {
  constructor(gl, vertexShaderSource, fragmentShaderSource) {
    this.gl = gl;
    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;
    this.program = null;
  }
  createProgram() {
    const gl = this.gl;
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, this.vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader compile error: ' + gl.getShaderInfoLog(vertexShader));
      return null;
    }
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, this.fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compile error: ' + gl.getShaderInfoLog(fragmentShader));
      return null;
    }
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader program link error: ' + gl.getProgramInfoLog(program));
      return null;
    }
    this.program = program;
    return program;
  }
  useShader() {
    this.gl.useProgram(this.program);
  }
}