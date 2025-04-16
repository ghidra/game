///https://dev.to/samthor/webgl-point-sprites-a-tutorial-4m6p
////https://webglfundamentals.org/webgl/lessons/webgl-image-processing.html
chainsaw = new rad.chainsaw();

const s_spriteVertex = `
attribute vec2 spritePosition;  // position of sprite
uniform vec2 screenSize;        // width/height of screen

void main() {
  vec4 screenTransform = 
      vec4(2.0 / screenSize.x, -2.0 / screenSize.y, -1.0, 1.0);
  gl_Position =
      vec4(spritePosition * screenTransform.xy + screenTransform.zw, 0.0, 1.0);
  gl_PointSize = 64.0;
}
`;

const s_spriteFragment = `
uniform sampler2D spriteTexture;  // texture we are drawing

void main() {
  gl_FragColor = texture2D(spriteTexture, gl_PointCoord);
}
`;
const s_fullscreenPlaneVertex = `
attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform mediump vec2 u_resolution;

varying vec2 v_texCoord;

void main() {
   // convert the rectangle from pixels to 0.0 to 1.0
   vec2 zeroToOne = a_position / u_resolution;

   // convert from 0->1 to 0->2
   vec2 zeroToTwo = zeroToOne * 2.0;

   // convert from 0->2 to -1->+1 (clipspace)
   vec2 clipSpace = zeroToTwo - 1.0;

   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

   // pass the texCoord to the fragment shader
   // The GPU will interpolate this value between points.
   v_texCoord = a_texCoord;
}
`;
const s_fullscreenPlaneFragment = `
precision mediump float;

uniform vec2 u_resolution;//shared with vertex

// our texture
uniform sampler2D u_image;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

void main() {
  vec4 tint = vec4(v_texCoord.x,v_texCoord.y,0,1);
  gl_FragColor = texture2D(u_image, v_texCoord)+tint;
  //gl_FragColor = vec4(1,0,0,1);
}
`;
function draw() {
  console.log("draw");
  // plane
  const s2 = chainsaw.loadVertexShader(s_fullscreenPlaneVertex);
  const s3 = chainsaw.loadFragmentShader(s_fullscreenPlaneFragment);
  const p1 = chainsaw.createProgram(s2,s3,new Array("a_position","a_texCoord"),new Array("u_resolution","u_image"));

  const rect = chainsaw.rectangle(0,0,chainsaw.width,chainsaw.height);//returns 2 ids to buffers in an array
  //how to make a custom buffer
  //var pl = chainsaw.createBuffer();
  //chainsaw.setBufferFloatData(sb,new Float32Array([0,1]));

  //// sprites
  const s0 = chainsaw.loadVertexShader(s_spriteVertex);
  const s1 = chainsaw.loadFragmentShader(s_spriteFragment);
  const p0 = chainsaw.createProgram(s0,s1,new Array("spritePosition"),new Array("screenSize"));

  ///////////////
  ////DRAW LOOP
  chainsaw.gl.viewport(0, 0, chainsaw.width, chainsaw.height);
  chainsaw.gl.clearColor(0, 0, 0.0, 0);
  chainsaw.gl.clear(chainsaw.gl.COLOR_BUFFER_BIT);   // clear screen

  ///draw plane
  chainsaw.gl.useProgram(chainsaw.shaderPrograms[p1]);
  chainsaw.uploadFloatBuffer(rect[0],p1,"a_position",2);
  chainsaw.uploadFloatBuffer(rect[1],p1,"a_texCoord",2);
  //chainsaw.gl.uniform2f(chainsaw.gl.getUniformLocation(chainsaw.shaderPrograms[p1], 'u_resolution'), chainsaw.width, chainsaw.height);
  chainsaw.gl.uniform2f(chainsaw.shaderProgramsUniformMap[p1].get('u_resolution'), chainsaw.width, chainsaw.height);
  chainsaw.loadImage(p1,chainsaw.images[0],"u_image")
  // Draw the rectangle.
  chainsaw.gl.drawArrays(chainsaw.gl.TRIANGLES, 0, 6);

  ///you have to USE a program before setting uniforms
  chainsaw.gl.useProgram(chainsaw.shaderPrograms[p0]);
  chainsaw.modifySpriteBuffer(0,128,128);
  chainsaw.modifySpriteBuffer(1,512,128);
  chainsaw.uploadSpriteBuffer(p0,"spritePosition");
  //chainsaw.gl.uniform2f(chainsaw.gl.getUniformLocation(chainsaw.shaderPrograms[p0], 'screenSize'), chainsaw.width, chainsaw.height);
  chainsaw.gl.uniform2f(chainsaw.shaderProgramsUniformMap[p0].get('screenSize'), chainsaw.width, chainsaw.height);

  chainsaw.loadImage(p0,chainsaw.images[0],"spriteTexture");
///////
  chainsaw.gl.drawArrays(chainsaw.gl.POINTS, 0, 2);  // run our program by drawing points (one for now)
}


window.onload=function(){
  document.getElementById("render").appendChild(chainsaw.canvas);
  chainsaw.preloadImages(["TilesetField.png"],draw)	
}








