import { exponent, UIBuilder } from "@roguecircuitry/htmless";
import { Mesh } from "./mesh.js";
import { Shader } from "./shader.js";
import { CONSTS, debounce, resize } from "./utils.js";
async function main() {
  let ui = new UIBuilder();
  ui.default(exponent);
  ui.create("div").id("container").mount(document.body);
  let container = ui.e;

  // ui.create("span").textContent("Hello World").mount(container);

  // Get the canvas element
  const canvas = ui.create("canvas").style({
    width: "100%",
    height: "100%",
    minWidth: "0",
    minHeight: "0"
  }).mount(container).e;

  // Get the WebGL rendering context
  const gl = canvas.getContext("webgl2");

  // Add event listeners to resize the canvas when the document or window is resized
  window.addEventListener('resize', debounce(() => resize(canvas, gl), 250));
  setTimeout(() => resize(canvas, gl), 1000);

  // Create a vertex shader
  const vertexShaderSource = `
  attribute vec3 ${CONSTS.aVertex};
  attribute vec4 ${CONSTS.aColor};
  varying vec4 ${CONSTS.vColor}; //varying used to pass between vert to frag shader
  
  void main() {
    gl_Position = vec4(${CONSTS.aVertex}, 1.0);
    ${CONSTS.vColor} = ${CONSTS.aColor}; // Pass the vertex color to the fragment shader
  }
`;
  // Create a fragment shader
  const fragmentShaderSource = `
  precision mediump float;

  varying vec4 ${CONSTS.vColor}; //catch vColor from vert shader

  void main() {
    gl_FragColor = ${CONSTS.vColor};
  }
`;
  let shader = new Shader(gl, vertexShaderSource, fragmentShaderSource);
  shader.createProgram();
  let mesh = new Mesh(gl, shader, [0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0], [0, 1, 2], [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1]);
  setTimeout(() => {
    mesh.updateVertexData(gl, [-1, 1, 0, -1, -1, 0, 1, 1, 0, 1, -1, 0], [0, 1, 2, 1, 3, 2], [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1]);
  }, 5000);
  function render() {
    // Use the program and set the position attribute
    shader.useShader();

    // Clear the canvas and draw the triangle
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    mesh.draw();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
main();