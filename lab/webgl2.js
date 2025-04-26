///https://dev.to/samthor/webgl-point-sprites-a-tutorial-4m6p
////https://webglfundamentals.org/webgl/lessons/webgl-image-processing.html
chainsaw = new rad.chainsaw(640,400);


function draw() {
  console.log("draw");
  gl = chainsaw.gl;

  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND);
  gl.blendEquation( gl.FUNC_ADD );
  gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

  // plane
  const s2 = chainsaw.loadVertexShader(s_fullscreenPlaneVertex);
  const s3 = chainsaw.loadFragmentShader(s_fullscreenPlaneFragment);
  const p1 = chainsaw.createProgram(s2,s3,new Array("a_position","a_texCoord"),new Array("u_resolution","u_image"));
  const rect = chainsaw.rectangle(0,0,chainsaw.width,chainsaw.height);//returns 2 ids to buffers in an array

  //// sprites
  const s0 = chainsaw.loadVertexShader(s_spriteVertex);
  const s1 = chainsaw.loadFragmentShader(s_spriteFragment);
  const p0 = chainsaw.createProgram(s0,s1,new Array("spritePosition"),new Array("screenSize"));

  const sr = 5;//sqrt(25);
  const ts = 25;//number of tiles
  for(var i=0;i<ts;i++){
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
  gl.viewport(0, 0, chainsaw.width, chainsaw.height);
  gl.clearColor(0.1, 0.33, 0.2, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);   // clear screen

  //Draw sprites
  ///you have to USE a program before setting uniforms
  gl.useProgram(chainsaw.shaderPrograms[p0]);

  //chainsaw.gl.uniform2f(chainsaw.gl.getUniformLocation(chainsaw.shaderPrograms[p0], 'screenSize'), chainsaw.width, chainsaw.height);
  gl.uniform2f(chainsaw.shaderProgramsUniformMap[p0].get('screenSize'), chainsaw.width, chainsaw.height);
  chainsaw.uploadSpriteBuffer(p0,"spritePosition");
  chainsaw.loadImage(p0,chainsaw.images[1],"spriteTexture");
  gl.drawArrays(gl.POINTS, 0, ts);  // run our program by drawing points (one for now)
  gl.bindBuffer(gl.ARRAY_BUFFER,null);
///////

  gl.disable(gl.DEPTH_TEST)
  ///draw plane
  gl.useProgram(chainsaw.shaderPrograms[p1]);
  chainsaw.uploadFloatBuffer(rect[0],p1,"a_position",2);
  chainsaw.uploadFloatBuffer(rect[1],p1,"a_texCoord",2);
  //chainsaw.gl.uniform2f(chainsaw.gl.getUniformLocation(chainsaw.shaderPrograms[p1], 'u_resolution'), chainsaw.width, chainsaw.height);
  gl.uniform2f(chainsaw.shaderProgramsUniformMap[p1].get('u_resolution'), chainsaw.width, chainsaw.height);
  chainsaw.loadImage(p1,chainsaw.images[0],"u_image")
  // Draw the rectangle.
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.bindBuffer(gl.ARRAY_BUFFER,null);
///////
}


window.onload=function(){
  document.getElementById("render").appendChild(chainsaw.canvas);
  chainsaw.preloadImages(["sprites/iso_grid.png","sprites/Sprite-0001.png"],draw);

  chainsaw.canvas.addEventListener('click', (e) => {
    const mx = e.offsetX;
    const my = e.offsetY;
    const coords = to_grid_coordinate(64,mx,my);
    console.log("mx: "+coords.x+" my: "+coords.y);
  });
  const output = document.getElementById("debug");
  chainsaw.canvas.addEventListener('mousemove', (e) => {
    output.innerHTML = "mx: "+e.offsetX+" my: "+e.offsetY;
  });
}








