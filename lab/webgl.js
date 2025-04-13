///https://dev.to/samthor/webgl-point-sprites-a-tutorial-4m6p
////https://webglfundamentals.org/webgl/lessons/webgl-image-processing.html
chainsaw = new rad.chainsaw();

const vertexShaderSource = `
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

const fragmentShaderSource = `
uniform sampler2D spriteTexture;  // texture we are drawing

void main() {
  gl_FragColor = texture2D(spriteTexture, gl_PointCoord);
}
`;

function draw() {
  console.log("draw");
  const s0 = chainsaw.loadVertexShader(vertexShaderSource);
  const s1 = chainsaw.loadFragmentShader(fragmentShaderSource);
  chainsaw.attachShader(s0);
  chainsaw.attachShader(s1);
  chainsaw.linkShaderProgram();
  chainsaw.modifySpriteBuffer(0,128,128);
  chainsaw.modifySpriteBuffer(1,512,128);
  chainsaw.uploadSpriteBuffer();
  //chainsaw.setTexture("icon","spriteTexture");
  chainsaw.loadImage(chainsaw.images[0],"spriteTexture");

///////
  chainsaw.gl.clear(chainsaw.gl.COLOR_BUFFER_BIT);   // clear screen
  chainsaw.gl.useProgram(chainsaw.shaderProgram);    // activate our program
  chainsaw.gl.drawArrays(chainsaw.gl.POINTS, 0, 2);  // run our program by drawing points (one for now)
}


window.onload=function(){
  document.getElementById("render").appendChild(chainsaw.canvas);
  chainsaw.preloadImages(["TilesetField.png"],draw)	
}








