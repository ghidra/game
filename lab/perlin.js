//this class expect the game.vector2 class
game.perlin=function(){
  return this.init();
}
game.perlin.prototype.init=function(){

  //this.xdiv = xdiv||10;
  //this.ydiv = ydiv||10;
  this._GRAD3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
    [1,1,0],[0,-1,1],[-1,1,0],[0,-1,-1]];

  this.permutation = [151,160,137,91,90,15,
    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
    190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
    88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,
    135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
    223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,
    129,22,39,253,9,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,
    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
    49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

  this.period = permutation.length;

  this.F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  this._G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
  this._F3 = 1.0 / 3.0;
  this._G3 = 1.0 / 6.0;

  this.double_permutation();

  return this;

}

game.perlin.prototype.double_permutation=function(){
  var iter = permutation.length;
  for(var t=0; t<iter;t++){
    this.permutation.push(permutation[t]);
  }
}

game.perlin.prototype.randomize=function(p){
  period = p || 0;
  perm=[];

  perm_right = period - 1;

  for (var i=0; i< period;i++){
    var j = Math.floor(Math.random(0)*perm_right);
    perm[j]=perm[i];
    perm[i]=perm[j];
  }
  this.permutation = perm;
  this.double_permutation();
}

game.perlin.prototype.noise2=function(x, y,sx=1.0, sy=1.0, ox=0.0, oy=0.0){
  /*2D Perlin simplex noise.
  Return a floating point value from -1 to 1 for the given x, y coordinate.
  The same value is always returned for a given x, y pair unless the
  permutation table changes (see randomize above).
  */
  //Skew input space to determine which simplex (triangle) we are in
  sx=sx||0.0;
  sy=sy||0.0;
  ox=ox||0.0;
  oy=oy||0.0;

  var ax=(x*sx)+ox;//abs(x);
  var ay=(y*sy)+oy;//abs(y);

  var s = (ax + ay) * this._F2;
  var i = Math.floor(ax + s);
  var j = Math.floor(ay + s);
  var t = (i + j) * this._G2;
  var x0 = ax - (i - t); // "Unskewed" distances from cell origin
  var y0 = ay - (j - t);

  var i1 = 0.0;
  var j1 = 1.0; // Upper triangle, YX order: (0,0)->(0,1)->(1,1)
  if (x0 > y0){
    i1 = 1.0;
    j1 = 0.0; // Lower triangle, XY order: (0,0)->(1,0)->(1,1)
  }

  var x1 = x0 - i1 + this._G2; // Offsets for middle corner in (x,y) unskewed coords
  var y1 = y0 - j1 + this._G2;
  var x2 = x0 + this._G2 * 2.0 - 1.0; // Offsets for last corner in (x,y) unskewed coords
  var y2 = y0 + this._G2 * 2.0 - 1.0;

  //# Determine hashed gradient indices of the three simplex corners
  perm = this.permutation;
  var ii = ((i % this.period)+this.period)% this.period;//int(Abs(i) % period);
  var jj = ((j % this.period)+this.period)% this.period;//int(Abs(j) % period);
  //Print( "str ii less than 0:"+(ii) );
  //Print( "str jj less than 0:"+(jj) );
  var gi0 = ((perm[ii + perm[jj]] % 12)+12)%12;
  var gi1 = ((perm[ii + i1 + perm[jj + j1]] % 12)+12)%12;
  var gi2 = ((perm[ii + 1 + perm[jj + 1]] % 12)+12)%12;

  // Calculate the contribution from the three corners
  var tt = 0.5 - Math.pow(x0,2) - Math.pow(y0,2);
  var noise = 0.0;
  var g = this._GRAD3[0];
  if (tt > 0){
    g = this._GRAD3[gi0];
    noise = Math.pow(tt,4) * (g[0] * x0 + g[1] * y0);
  }
  tt = 0.5 - Math.pow(x1,2) - Math.pow(y1,2);
  if (tt > 0){
    g = this._GRAD3[gi1];
    noise += Math.pow(tt,4) * (g[0] * x1 + g[1] * y1);
  }
  tt = 0.5 - Math.pow(x2,2) - Math.pow(y2,2);
  if (tt > 0){
    g = this._GRAD3[gi2];
    noise += Math.pow(tt,4) * (g[0] * x2 + g[1] * y2);
  }

  //return (ii)*1.0f;
  //float noise = 0.01f;
  return noise * 70.0; // scale noise to [-1, 1]
}
