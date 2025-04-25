///https://dev.to/samthor/webgl-point-sprites-a-tutorial-4m6p
////https://webglfundamentals.org/webgl/lessons/webgl-image-processing.html
chainsaw = new rad.chainsaw(640,400);

/*
uniform vec2 textureSize;//pixel dimension of texture
uniform vec2 textureSpriteSize;//the size of a single block in pixels
//vec2 textureSampleCoord;//the look up of the sprite to use
int textureSampleIndex;//the index of the sprite to use
*/
const s_spriteVertex = `
attribute vec2 spritePosition;  // position of sprite
uniform vec2 screenSize;        // width/height of screen

void main() {
  vec4 screenTransform = vec4(2.0 / screenSize.x, -2.0 / screenSize.y, -1.0, 1.0);
  vec2 p = spritePosition * screenTransform.xy + screenTransform.zw;
  float z = spritePosition.y*-0.0001;

  p+=vec2(1.0,-0.5);
  
  gl_Position = vec4(p, z, 1.0);
  gl_PointSize = 64.0;
}
`;

const s_spriteFragment = `
precision mediump float;
uniform sampler2D spriteTexture;  // texture we are drawing

void main() {
  vec2 textureSize = vec2(512,512);
  vec2 textureSpriteSize = vec2(32,32);
  int textureSampleIndex = 0;//hard codded to use the first one for now

  vec2 spriteRatio=textureSpriteSize/textureSize;

  vec2 scaledUVs = gl_PointCoord*spriteRatio;
  gl_FragColor = texture2D(spriteTexture, scaledUVs);
}
`;

function draw() {
  console.log("draw");
  gl = chainsaw.gl;

  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

  //// sprites
  const s0 = chainsaw.loadVertexShader(s_spriteVertex);
  const s1 = chainsaw.loadFragmentShader(s_spriteFragment);
  const p0 = chainsaw.createProgram(s0,s1,new Array("spritePosition"),new Array("screenSize"));

  const sr = 5;//sqrt(256);
  for(var i=0;i<25;i++){
    var tilex = Math.floor(i/sr);
    var tiley = i%sr;
    var ix = tilex * 32 + tiley * -32
    var iy = tilex * 16 + tiley * 16
    chainsaw.modifySpriteBuffer(i,ix,iy);
  }
  //chainsaw.modifySpriteBuffer(0,0,0);
  //chainsaw.modifySpriteBuffer(1,512,128);
  ///////////////
  ////DRAW LOOP
  chainsaw.gl.viewport(0, 0, chainsaw.width, chainsaw.height);
  chainsaw.gl.clearColor(0.1, 0.33, 0.2, 1);
  chainsaw.gl.clear(chainsaw.gl.COLOR_BUFFER_BIT);   // clear screen


  ///you have to USE a program before setting uniforms
  chainsaw.gl.useProgram(chainsaw.shaderPrograms[p0]);
  chainsaw.uploadSpriteBuffer(p0,"spritePosition");
  //chainsaw.gl.uniform2f(chainsaw.gl.getUniformLocation(chainsaw.shaderPrograms[p0], 'screenSize'), chainsaw.width, chainsaw.height);
  chainsaw.gl.uniform2f(chainsaw.shaderProgramsUniformMap[p0].get('screenSize'), chainsaw.width, chainsaw.height);

  chainsaw.loadImage(p0,chainsaw.images[0],"spriteTexture");
///////
  chainsaw.gl.drawArrays(chainsaw.gl.POINTS, 0, 256);  // run our program by drawing points (one for now)
}


window.onload=function(){
  document.getElementById("render").appendChild(chainsaw.canvas);
  chainsaw.preloadImages(["sprites/Sprite-0001.png"],draw)	
}








