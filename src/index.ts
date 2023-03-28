
import { exponent, UIBuilder } from "@roguecircuitry/htmless";
import { Camera } from "./graph/camera.js";
import { MeshNode } from "./graph/meshnode.js";
import { RenderConfig } from "./graph/node.js";
import { SceneNode } from "./graph/scene.js";
import { hsvToRgb, RGBALike } from "./math/color.js";
import { DEG2RAD, lerp } from "./math/general.js";
import { quat } from "./math/quaternion.js";
import { MeshBuilder } from "./meshbuilder.js";
import { Shader } from "./shader.js";
import { CONSTS, debounce, resize } from "./utils.js";

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
  window.addEventListener('resize', debounce(() => {
    resize(canvas, gl)
    camera.aspect = canvas.width/canvas.height;
  }, 250));

  //resize manually once
  setTimeout(() => resize(canvas, gl), 1000);

  // glsl vertex shader
  const vertexShaderSource = `
  attribute vec3 ${CONSTS.aVertex};
  attribute vec4 ${CONSTS.aColor};
  varying vec4 ${CONSTS.vColor}; //varying used to pass between vert to frag shader
  
  uniform mat4 ${CONSTS.uTransViewProjMatrix};

  void main() {
    //https://stackoverflow.com/a/46410448/8112809 - order of ops matter, thank you Rabid76
    gl_Position = ${CONSTS.uTransViewProjMatrix} * vec4(${CONSTS.aVertex}, 1.0);
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

  let scene = new SceneNode();
  let camera = new Camera();
  // quat.fromEuler({x:0,y:0,z:90*DEG2RAD}).store(camera.transform.local.rotation);
  camera.transform.local.position.z = -10;
  scene.add(camera);
  
  let mb = new MeshBuilder();
  let gridnode = new MeshNode();
  gridnode.mesh.shader = shader;
  gridnode.mesh.init(gl);
  
  function gridMesh (mb: MeshBuilder, size: number = 10, divs: number = 10, lineWidth: number = 0.1, color={r:0.5,g:0.5,b:0.5,a:1}) {
    mb.clear();
    
    let halfSize = size/2;
    let halfWidth = lineWidth/2;

    let x = 0;
    let y = 0;
    
    let top = halfSize;
    let bottom = -halfSize;
    let left = -halfSize;
    let right = halfSize;

    for (let ix=0; ix<divs+1; ix++) {
      x = lerp(left, right, ix/divs);
      let l = x - halfWidth;
      let r = x + halfWidth;
      let io = ix * 4;
      
      mb.verts({
        x: l,
        y: bottom,
        z: 0
      },{
        x: l,
        y: top,
        z: 0
      },{
        x: r,
        y: top,
        z: 0
      },{
        x: r,
        y: bottom,
        z: 0
      });

      mb.indices({
        x: 0 + io,
        y: 2 + io,
        z: 1 + io
      },{
        x: 0 + io,
        y: 3 + io,
        z: 2 + io
      });

      mb.colors(
        color,
        color,
        color,
        color
      );
    }

    for (let iy=0; iy<divs+1; iy++) {
      y = lerp(bottom, top, iy/divs);
      let b = y - halfWidth;
      let t = y + halfWidth;
      let io = (iy * 4) + ((divs+1)*4);
      
      mb.verts({
        x: left,
        y: b,
        z: 0
      },{
        x: left,
        y: t,
        z: 0
      },{
        x: right,
        y: t,
        z: 0
      },{
        x: right,
        y: b,
        z: 0
      });

      mb.indices({
        x: 0 + io,
        y: 2 + io,
        z: 1 + io
      },{
        x: 0 + io,
        y: 3 + io,
        z: 2 + io
      });

      mb.colors(
        color,
        color,
        color,
        color
      );
    }
  }

  gridMesh(mb, 10, 10, 0.005, {r:0.5,g:1,b:0.5,a:1});
  mb.build({
    gl,
    output: {
      mesh: gridnode.mesh,
      vertices: true,
      indices: true,
      colors: true
    }
  });

  scene.add(gridnode);

  mb.clear();
  let meshnode = new MeshNode();
  let mesh = meshnode.mesh;
  mesh.shader = shader;
  mesh.init(gl);

  scene.add(meshnode);


  let radius = 0.5;
  let divisions = 64;
  mb.verts({ x: 0, y: 0, z: 0 }); //center
  mb.colors({ r: 1, g: 1, b: 1, a: 1 });

  let hsv = { h: 0, s: 1, v: 1 };

  for (let i = 0; i < divisions + 1; i++) {
    let by = (i / divisions);
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

    hsv.h = by;

    let currentColor: RGBALike = { r: 0, g: 0, b: 0, a: 1 };

    hsvToRgb(hsv, currentColor);

    mb.colors(currentColor);

  }

  //demo updating mesh data on the fly
  setTimeout(() => {
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
    })

  }, 500);

  let renderConfig: RenderConfig = {
    camera,
    gl,
    scene
  };

  let r = 0;

  function render() {
    //set the clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    r += 0.005;

    quat.fromEuler({x: r+1, y: r+2, z: r+3})
    .mul(camera.transform.local.rotation)
    .store(camera.transform.local.rotation);

    // camera.transform.local.position.z = Math.sin(r);

    // console.log("rot", camera.transform.local.rotation);

    //render the scene
    scene.render(renderConfig);

    //keep drawing more frames plz
    requestAnimationFrame(render);
  }

  //start the render loop
  requestAnimationFrame(render);

}

main();
