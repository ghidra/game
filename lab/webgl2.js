///https://dev.to/samthor/webgl-point-sprites-a-tutorial-4m6p
////https://webglfundamentals.org/webgl/lessons/webgl-image-processing.html
iso._io = new iso.io();
iso._login = new iso.login(iso._io);
chainsaw = new rad.chainsaw(640,400);
gl = chainsaw.gl;

var p0,p1;
var rect;
const sr = 5;//sqrt(25);
const ts = 0;//25;//number of tiles
const tileSize = 64.0;

var mouseTile = 0;
var mouseZ = 0;

mouseGrid=to_grid_coordinate(tileSize,0,0);

function init(){
  console.log("init");
  
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendEquation( gl.FUNC_ADD );
  gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

  // plane
  const s2 = chainsaw.loadVertexShader(s_fullscreenPlaneVertex);
  const s3 = chainsaw.loadFragmentShader(s_fullscreenPlaneFragment);
  p1 = chainsaw.createProgram(s2,s3,new Array("a_position","a_texCoord"),new Array("u_resolution","u_image","u_selectedTile","u_selectedZ"));
  rect = chainsaw.rectangle(0,0,chainsaw.width,chainsaw.height);//returns 2 ids to buffers in an array

  //// sprites
  const s0 = chainsaw.loadVertexShader(s_spriteVertex);
  const s1 = chainsaw.loadFragmentShader(s_spriteFragment);
  p0 = chainsaw.createProgram(s0,s1,new Array("aSpritePosition","aSpriteID"),new Array("u_screenSize","u_tileSize"));

  for(var i=0;i<ts;i++){
    var tilex = Math.floor(i/sr);
    var tiley = i%sr;
    //const coords = to_screen_coordinate(tileSize,tilex,tiley);
    //chainsaw.modifySpriteBuffer(i,coords.x,coords.y);
    chainsaw.modifySpriteBuffer(i,tilex,tiley);
  }
  chainsaw.spriteCount=ts;

  gl.viewport(0, 0, chainsaw.width, chainsaw.height);

  draw();
}
function draw() {
  //console.log("draw");
  ////DRAW LOOP
  
  gl.clearColor(0.1, 0.33, 0.2, 1);
  gl.clear(gl.DEPTH_BUFFER_BIT)
  gl.clear(gl.COLOR_BUFFER_BIT);   // clear screen
  //gl.colorMask(true, true, true, false);

  gl.enable(gl.DEPTH_TEST)
  //Draw sprites
  ///you have to USE a program before setting uniforms
  gl.useProgram(chainsaw.shaderPrograms[p0]);

  //chainsaw.gl.uniform2f(chainsaw.gl.getUniformLocation(chainsaw.shaderPrograms[p0], 'screenSize'), chainsaw.width, chainsaw.height);
  gl.uniform2f(chainsaw.shaderProgramsUniformMap[p0].get('u_screenSize'), chainsaw.width, chainsaw.height);
  gl.uniform1f(chainsaw.shaderProgramsUniformMap[p0].get('u_tileSize'),tileSize)
  chainsaw.uploadSpriteBuffer(p0);
  chainsaw.loadImage(p0,chainsaw.images[1],"spriteTexture");
  gl.drawArrays(gl.POINTS, 0, chainsaw.spriteCount+1);  // run our program by drawing points (one for now)
  gl.bindBuffer(gl.ARRAY_BUFFER,null);
///////
  if(drawGrid){
    gl.disable(gl.DEPTH_TEST)
    ///draw plane
    gl.useProgram(chainsaw.shaderPrograms[p1]);
    chainsaw.uploadFloatBuffer(rect[0],p1,"a_position",2);
    chainsaw.uploadFloatBuffer(rect[1],p1,"a_texCoord",2);
    //chainsaw.gl.uniform2f(chainsaw.gl.getUniformLocation(chainsaw.shaderPrograms[p1], 'u_resolution'), chainsaw.width, chainsaw.height);
    gl.uniform2f(chainsaw.shaderProgramsUniformMap[p1].get('u_resolution'), chainsaw.width, chainsaw.height);
    gl.uniform2f(chainsaw.shaderProgramsUniformMap[p1].get('u_selectedTile'),mouseGrid.x,mouseGrid.y)
    gl.uniform1f(chainsaw.shaderProgramsUniformMap[p1].get('u_selectedZ'),mouseZ);
    chainsaw.loadImage(p1,chainsaw.images[0],"u_image")
    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
  }
///////
}
function updateUserMouse(ignoreTest = false){
  const fx = Math.floor(mouseGrid.x);
  const fy = Math.floor(mouseGrid.y);
  //----check against existing sprites
  var open = true;
  for(var i=0; i<chainsaw.spriteCount; i++){
    const j = i*chainsaw.spriteBufferStride;
    if(chainsaw.spriteBufferArray[j+2]==mouseZ){
      if(chainsaw.spriteBufferArray[j]==fx){
        if(chainsaw.spriteBufferArray[j+1]==fy){
          if(open){
            open = false;
            //console.log("this cell already exist");
          }
        }
      }
    }
  }
  //---------
  chainsaw.modifySpriteBuffer(chainsaw.spriteCount,fx,fy,mouseZ,mouseTile);
  if(ignoreTest||open) draw(); ///this leaves the last sprite in place
  return open;
}

window.onload=function(){
  iso.dom_login  = document.getElementById("login");//create the login buttons
  iso._login.render(iso.dom_login);//add the login buttonts to dom

  document.getElementById("render").appendChild(chainsaw.canvas);
  chainsaw.preloadImages(["sprites/iso_grid.png","sprites/Sprite-0001.png"],init);

  chainsaw.canvas.addEventListener('click', (e) => {
    console.log("mx: "+mouseGrid.x+" my: "+mouseGrid.y);
    if(updateUserMouse())chainsaw.spriteCount+=1;
  });
  const output = document.getElementById("debug");
  chainsaw.canvas.addEventListener('mousemove', (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    const grid = to_grid_coordinate(tileSize,mouseX,mouseY);
    output.innerHTML = "mx: "+grid.x+" my: "+grid.y;
    if(Math.floor(grid.x)!=Math.floor(mouseGrid.x) ||  Math.floor(grid.y)!=Math.floor(mouseGrid.y)){
      mouseGrid=grid;
      updateUserMouse();
    }
  });

  document.addEventListener('keydown',(e)=>{
    if(e.key=='ArrowRight') mouseTile+=1; updateUserMouse();
    if(e.key=='ArrowLeft') mouseTile=Math.max(mouseTile-1,0); updateUserMouse();
    if(e.key=='ArrowUp') mouseZ+=1; updateUserMouse(true);
    if(e.key=='ArrowDown') mouseZ-=1; updateUserMouse(true);
    if(e.key=='g') drawGrid=!drawGrid; updateUserMouse();
  });
}

///////LOGING STUFF
function process_login(form_name){
  iso._login.process_login(form_name);
}
function logout(){
  iso._login.logout();
}








