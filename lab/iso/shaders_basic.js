const s_spriteVertex = `
attribute vec3 aSpritePosition;  // position of sprite
attribute vec2 aSpriteID;//sprite id, and texture id
varying vec2 vSpriteID;///this is OUT
uniform vec2 u_screenSize;        // width/height of screen
uniform float u_tileSize;

float maxZ=20.0;

//convert grid coords to screen coords
vec2 to_screen_coordinates(vec2 pos){
  float px = pos.x * u_tileSize*0.5 + pos.y * u_tileSize*-0.5;
  float py = pos.x * u_tileSize*0.25 + pos.y * u_tileSize*0.25;
  return vec2(px,py);
}

void main() {
  vec4 screenTransform = vec4(2.0 / u_screenSize.x, -2.0 / u_screenSize.y, -1.0, 1.0);
  vec2 screen_p = to_screen_coordinates(aSpritePosition.xy);
  vec2 p = screen_p * screenTransform.xy + screenTransform.zw;
  float z = (screen_p.y/-(u_screenSize.y-maxZ))-(aSpritePosition.z/maxZ);//20 is arbitrary max z
  
  vec2 ratio = vec2(u_tileSize)/u_screenSize;

  //take the actual spritez position to move it in the render grid
  p+=vec2(0.0,1.0)*floor(aSpritePosition.z)*ratio.y;

  //center
  //p+=vec2(1.0,-1.0);///dead center
  //p+=vec2(0.0,ratio.y*0.25);///this centers the y position back to the grid.. because the center of the point is not relative to the grid
  //move to correct grid position
  p+=vec2(0.0,-ratio.y);

  vSpriteID = aSpriteID;
  gl_Position = vec4(p, z, 1.0);
  gl_PointSize = u_tileSize;
}
`;

const s_spriteFragment = `
precision mediump float;
varying vec2 vSpriteID;
uniform sampler2D spriteTexture;  // texture we are drawing

void main() {
  vec2 textureSize = vec2(512,512);///this needs to get passed in as uniform
  vec2 textureSpriteSize = vec2(32,32);// this needs to be passed in by uniform

  vec2 spriteRatio=textureSpriteSize/textureSize;

  float offsetx = spriteRatio.x*vSpriteID.x;///this only handles a single line.. we need to mod and stuff

  vec2 uvs = gl_PointCoord*spriteRatio;
  uvs+=vec2(offsetx,0.0);

  vec4 col = texture2D(spriteTexture, uvs);

  if(col.a<0.001) discard;
  gl_FragColor = col;
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

   gl_Position = vec4(clipSpace * vec2(1, -1), 0.999999, 1);

   // pass the texCoord to the fragment shader
   // The GPU will interpolate this value between points.
   v_texCoord = a_texCoord;
}
`;
const s_fullscreenPlaneFragment = `
precision mediump float;

uniform vec2 u_resolution;//shared with vertex
uniform vec2 u_selectedTile;//
uniform float u_selectedZ;

// our texture
uniform sampler2D u_image;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

// isometric data
const vec2 _d = vec2(64.0,32.0);
vec2 _r = vec2(u_resolution/_d);

const mat2 _i = mat2(1.0,-1.0,1.0,1.0);//skew
const mat2 _u = mat2(1.0,1.0,-1.0,1.0);//unskew

void main() {
  //vec4 tint = vec4(v_texCoord.x,v_texCoord.y,0,1);
  //gl_FragColor = texture2D(u_image, v_texCoord)+tint;

  vec2 p = v_texCoord*_r;//scaled uvs based on canvas and tile size
  vec2 u = _i*p;//skewed uvs/// get a floor.. and that should be tile id
  
  //get selected parts of grid, and a radius
  vec2 selected = ceil(abs(floor(u_selectedTile)-floor(u)));
  float sel = 1.0-min(selected.x*selected.y,1.0);
  float selDist = 1.0-min(length(selected)*0.33,1.0);
  //now get the z being selected
  vec2 zid = u+vec2(u_selectedZ,u_selectedZ);
  vec2 selectedz = ceil(abs(floor(u_selectedTile)-floor(zid)));
  float selz = 1.0-min(selectedz.x+selectedz.y,1.0);

  //now get per tile uv
  vec2 umod = vec2(mod(u.x,1.0), mod(u.y,1.0));
  vec2 reu = ((_u*umod)*0.5)+vec2(0.5,0.0);//unskew.. scale unskewed us up.. and offset x to center it

  vec4 img = texture2D(u_image, reu);

  vec4 grid = vec4(img.r*0.2,img.r*0.2,img.r*0.2,img.r);  
  //vec4 tile = mix(vec4(img.g*0.2,img.g*0.2,img.g*0.2,img.g*0.6),vec4(0.0),sel);
  vec4 tile = mix(vec4(0.0),vec4(img.r*0.5,img.r*0.5,img.r*0.5,0.0),(selDist*sel)+selz);
  
  if(grid.a+tile.a<0.001) discard;

  gl_FragColor = grid+tile;
}
`;