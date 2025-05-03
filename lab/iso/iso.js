iso ={};

var mouseX=0.0;
var mouseY=0.0;
var mouseGrid={};
var mouseCoords={};
var drawGrid=true;


function invert_matrix(a, b, c, d) {
  // Determinant 
  const det = (1 / (a * d - b * c));
  
  return {
    a: det * d,
    b: det * -b,
    c: det * -c,
    d: det * a,
  }
}
function to_grid_coordinate(spritesize, mx, my) {
  const a = 0.5 * spritesize;
  const b = -0.5 * spritesize;
  const c = 0.25 * spritesize;
  const d = 0.25 * spritesize;
  
  const inv = invert_matrix(a, b, c, d);
  
  return {
    x: mx * inv.a + my * inv.b,
    y: mx * inv.c + my * inv.d,
  }
}
function to_screen_coordinate(spritesize, tx, ty){
  return {
    x: tx * spritesize*0.5 + ty * spritesize*-0.5,
    y: tx * spritesize*0.25 + ty * spritesize*0.25,
  }
}