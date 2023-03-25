import { exponent, UIBuilder } from "@roguecircuitry/htmless";
import { Mesh } from "./mesh.js";
import { MeshBuilder } from "./meshbuilder.js";
import { Shader } from "./shader.js";
import { CONSTS, debounce, resize } from "./utils.js";
import { hsvToRgb } from "./vector.js";
async function main() {
  //easier HTML output, thanks to htmless
  let ui = new UIBuilder();
  //flexbox everything
  ui.default(exponent);

  //create a div container
  let container = ui.create("div").id("container").mount(document.body).e;

  // Get the canvas element
  const canvas = ui.create("canvas").style({
    width: "100%",
    height: "100%",
    minWidth: "0",
    minHeight: "0"
  }).mount(container).e;

  // Get the WebGL rendering context
  const gl = canvas.getContext("webgl2");

  // resize the canvas when window is resized, use debounce to not trigger lots of times during drag-resize
  window.addEventListener('resize', debounce(() => resize(canvas, gl), 250));

  //resize manually once
  setTimeout(() => resize(canvas, gl), 1000);

  // glsl vertex shader
  const vertexShaderSource = `
  attribute vec3 ${CONSTS.aVertex};
  attribute vec4 ${CONSTS.aColor};
  varying vec4 ${CONSTS.vColor}; //varying used to pass between vert to frag shader
  
  void main() {
    gl_Position = vec4(${CONSTS.aVertex}, 1.0);
    ${CONSTS.vColor} = ${CONSTS.aColor}; // Pass the vertex color to the fragment shader
  }
`;
  // glsl fragment shader
  const fragmentShaderSource = `
  precision mediump float;

  varying vec4 ${CONSTS.vColor}; //catch vColor from vert shader

  void main() {
    gl_FragColor = ${CONSTS.vColor};
  }
`;

  //wrapper for shader code, just supply shader source codes
  let shader = new Shader(vertexShaderSource, fragmentShaderSource);

  //compile the shader, creates 'program' member used by webgl
  shader.createProgram(gl);

  //create a mesh with default geometry
  //just a triangle to start with
  let mesh = new Mesh(gl, shader, [0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0], [0, 1, 2], [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1]);
  let mb = new MeshBuilder();
  let radius = 1;
  let divisions = 64;
  mb.verts({
    x: 0,
    y: 0,
    z: 0
  }); //center
  mb.colors({
    r: 1,
    g: 1,
    b: 1,
    a: 1
  });
  let hsv = {
    h: 0,
    s: 1,
    v: 1
  };
  for (let i = 0; i < divisions + 1; i++) {
    let by = i / divisions;
    let a = by * Math.PI * 2;

    //point on circle
    mb.verts({
      x: Math.cos(a) * radius,
      y: Math.sin(a) * radius,
      z: 0
    });

    //triangle from center, point on circle, and next point along circle (or first point if we're on last point now)
    mb.indices({
      x: 0,
      y: i,
      z: i == divisions ? 1 : i + 1
    });
    hsv.h = by * 5 % 5;
    let currentColor = {
      r: 0,
      g: 0,
      b: 0,
      a: 1
    };
    hsvToRgb(hsv, currentColor);
    mb.colors(currentColor);
  }

  //demo updating mesh data on the fly
  setTimeout(() => {
    //similar to mesh constructor, but just updates mesh with new data
    //this time it will be a square
    // mesh.updateVertexData(gl, [
    //   -1, 1, 0,
    //   -1, -1, 0,
    //   1, 1, 0,
    //   1, -1, 0
    // ], [
    //   0, 1, 2,
    //   1, 3, 2
    // ], [
    //   1, 0, 0, 1,
    //   0, 1, 0, 1,
    //   0, 0, 1, 1,
    //   1, 0, 0, 1
    // ]);

    //build to our mesh with the generated circle geometry
    mb.build({
      gl,
      output: {
        mesh,
        colors: true,
        indices: true,
        normals: false,
        uvs: false,
        vertices: true
      }
    });
  }, 2000);
  function render() {
    //set the clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    //Tell mesh to render with its shader
    mesh.draw(gl);

    //keep drawing more frames plz
    requestAnimationFrame(render);
  }

  //start the render loop
  requestAnimationFrame(render);
}
main();