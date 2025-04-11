const canvas = document.createElement('canvas');
canvas.width = 640;
canvas.height = 480;
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

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
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!status) {
    throw new TypeError(`couldn't compile shader:\n${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

const status = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
if (!status) {
  throw new TypeError(`couldn't link shader program:\n${gl.getProgramInfoLog(shaderProgram)}`);
}

gl.useProgram(shaderProgram);
gl.uniform2f(gl.getUniformLocation(shaderProgram, 'screenSize'), canvas.width, canvas.height);

const array = new Float32Array(1000);  // allow for 500 sprites
array[0] = 128;  // x-value
array[1] = 128;  // y-value

const glBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);  // upload data

const loc = gl.getAttribLocation(shaderProgram, 'spritePosition');
gl.enableVertexAttribArray(loc);
gl.vertexAttribPointer(loc,
    2,  // because it was a vec2
    gl.FLOAT,  // vec2 contains floats
    false,  // ignored
    0,   // each value is next to each other
    0);  // starts at start of array


function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);   // clear screen
  gl.useProgram(shaderProgram);    // activate our program
  gl.drawArrays(gl.POINTS, 0, 1);  // run our program by drawing points (one for now)
}


window.onload=function(){
	document.getElementById("render").appendChild(canvas);
	draw();
}








