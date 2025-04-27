///https://dev.to/samthor/webgl-point-sprites-a-tutorial-4m6p
////https://webglfundamentals.org/webgl/lessons/webgl-image-processing.html
chainsaw = new rad.chainsaw(640,400);
gl = chainsaw.gl;

var p0,p1;
var rect;
const sr = 5;//sqrt(25);
const ts = 25;//number of tiles
const tileSize = 64.0;

var tileCount = ts;

mouseGrid=to_grid_coordinate(tileSize,0,0);

function init(){
  console.log("init");
  
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND);
  gl.blendEquation( gl.FUNC_ADD );
  gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

  // plane
  const s2 = chainsaw.loadVertexShader(s_fullscreenPlaneVertex);
  const s3 = chainsaw.loadFragmentShader(s_fullscreenPlaneFragment);
  p1 = chainsaw.createProgram(s2,s3,new Array("a_position","a_texCoord"),new Array("u_resolution","u_image","u_selectedTile"));
  rect = chainsaw.rectangle(0,0,chainsaw.width,chainsaw.height);//returns 2 ids to buffers in an array

  //// sprites
  const s0 = chainsaw.loadVertexShader(s_spriteVertex);
  const s1 = chainsaw.loadFragmentShader(s_spriteFragment);
  p0 = chainsaw.createProgram(s0,s1,new Array("spritePosition"),new Array("u_screenSize","u_tileSize"));

  for(var i=0;i<ts;i++){
    var tilex = Math.floor(i/sr);
    var tiley = i%sr;
    const coords = to_screen_coordinate(tileSize,tilex,tiley);
    //var ix = tilex * tileSize*0.5 + tiley * tileSize*-0.5;
    //var iy = tilex * tileSize*0.25 + tiley * tileSize*0.25;
    chainsaw.modifySpriteBuffer(i,coords.x,coords.y);
  }

  gl.viewport(0, 0, chainsaw.width, chainsaw.height);

  draw();
}
function draw() {
  //console.log("draw");
  //chainsaw.modifySpriteBuffer(0,0,0);
  //chainsaw.modifySpriteBuffer(1,512,128);
  ///////////////
  ////DRAW LOOP
  
  gl.clearColor(0.1, 0.33, 0.2, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);   // clear screen

  //Draw sprites
  ///you have to USE a program before setting uniforms
  gl.useProgram(chainsaw.shaderPrograms[p0]);

  //chainsaw.gl.uniform2f(chainsaw.gl.getUniformLocation(chainsaw.shaderPrograms[p0], 'screenSize'), chainsaw.width, chainsaw.height);
  gl.uniform2f(chainsaw.shaderProgramsUniformMap[p0].get('u_screenSize'), chainsaw.width, chainsaw.height);
  gl.uniform1f(chainsaw.shaderProgramsUniformMap[p0].get('u_tileSize'),tileSize)
  chainsaw.uploadSpriteBuffer(p0,"spritePosition");
  chainsaw.loadImage(p0,chainsaw.images[1],"spriteTexture");
  gl.drawArrays(gl.POINTS, 0, tileCount);  // run our program by drawing points (one for now)
  gl.bindBuffer(gl.ARRAY_BUFFER,null);
///////

  gl.disable(gl.DEPTH_TEST)
  ///draw plane
  gl.useProgram(chainsaw.shaderPrograms[p1]);
  chainsaw.uploadFloatBuffer(rect[0],p1,"a_position",2);
  chainsaw.uploadFloatBuffer(rect[1],p1,"a_texCoord",2);
  //chainsaw.gl.uniform2f(chainsaw.gl.getUniformLocation(chainsaw.shaderPrograms[p1], 'u_resolution'), chainsaw.width, chainsaw.height);
  gl.uniform2f(chainsaw.shaderProgramsUniformMap[p1].get('u_resolution'), chainsaw.width, chainsaw.height);
  gl.uniform2f(chainsaw.shaderProgramsUniformMap[p1].get('u_selectedTile'),mouseGrid.x,mouseGrid.y)
  chainsaw.loadImage(p1,chainsaw.images[0],"u_image")
  // Draw the rectangle.
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.bindBuffer(gl.ARRAY_BUFFER,null);
///////
}


window.onload=function(){
  document.getElementById("render").appendChild(chainsaw.canvas);
  chainsaw.preloadImages(["sprites/iso_grid.png","sprites/Sprite-0001.png"],init);

  chainsaw.canvas.addEventListener('click', (e) => {
    console.log("mx: "+mouseGrid.x+" my: "+mouseGrid.y);
    const coords = to_screen_coordinate(tileSize,Math.floor(mouseGrid.x),Math.floor(mouseGrid.y));
    chainsaw.modifySpriteBuffer(tileCount,coords.x,coords.y);
    tileCount+=1;
    draw();
  });
  const output = document.getElementById("debug");
  chainsaw.canvas.addEventListener('mousemove', (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    const grid = to_grid_coordinate(tileSize,mouseX,mouseY);
    output.innerHTML = "mx: "+grid.x+" my: "+grid.y;
    if(grid.x!=mouseGrid.x && grid.y!=mouseGrid.y){
      mouseGrid=grid;
      draw();
    }
  });
}








