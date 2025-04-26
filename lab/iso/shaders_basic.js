const s_spriteVertex = `
attribute vec2 spritePosition;  // position of sprite
uniform vec2 screenSize;        // width/height of screen

void main() {
  vec4 screenTransform = vec4(2.0 / screenSize.x, -2.0 / screenSize.y, -1.0, 1.0);
  vec2 p = spritePosition * screenTransform.xy + screenTransform.zw;
  float z = spritePosition.y*-0.0001;

  vec2 ratio = vec2(64.0,64.0)/screenSize;

  p+=vec2(1.0,-1.0);///dead center
  p+=vec2(0.0,ratio.y*0.25);///this centers the y position back to the grid.. because the center of the point is not relative to the grid
  
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

   gl_Position = vec4(clipSpace * vec2(1, -1), 0.9999, 1);

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

// isometric data
const vec2 _d = vec2(64.0,32.0);
vec2 _r = vec2(u_resolution/_d);

const mat2 _i = mat2(1.0,-1.0,1.0,1.0);//skew
const mat2 _u = mat2(1.0,1.0,-1.0,1.0);//unskew
//const mat2 _i = mat2(0.005,-0.005,0.01,0.01);//inverted matrix
//mat2 _i = mat2( _r.y,-_r.y,_r.x,_r.x);//inverted matrix
//mat2 _i = mat2(_d.y,-_d.y,_d.x,_d.x);

void main() {
  //vec4 tint = vec4(v_texCoord.x,v_texCoord.y,0,1);
  //gl_FragColor = texture2D(u_image, v_texCoord)+tint;

  vec2 p = v_texCoord*_r;//modified uvs
  vec2 u = _i*p;//skewed uvs/// modulo get a floor.. and that should be tile id
  vec2 umod = vec2(mod(u.x,1.0), mod(u.y,1.0));
  vec2 reu = ((_u*umod)*0.5)+vec2(0.5,0.0);//unskew.. scale unskewed us up.. and offset x to center it

  //gl_FragColor=vec4( umod.x, umod.y, 0.0, 1.0 );
  //gl_FragColor=vec4( reu.x, reu.y, 0.0, 1.0 ); 

  //vec4 tint = vec4(reu.x, reu.y,0,1);
  vec4 img = texture2D(u_image, reu);//+tint;
  vec4 grid = vec4(img.r*0.2,img.r*0.2,img.r*0.2,img.r);  
  vec4 tile = vec4(img.g*0.2,img.g*0.2,img.g*0.2,img.g*0.6);
  gl_FragColor = grid;
}
`;