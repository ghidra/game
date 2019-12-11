game.map_island=function(xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  return this;
}
game.map_island.prototype=new game.graph();
game.map_island.prototype.constructor=game.graph;

game.map_island.prototype.init=function(xdiv,ydiv){
  game.graph.prototype.init.call(this,xdiv,ydiv);
  //this.camera=new game.camera();//now we have a camera for this shit
  this.geo = this.construct_geo();
}

game.map_island.prototype.construct_geo=function(){
  //i wont be needing the camera here later,maybe
  //this.camera.cull(this);

  var noise = new game.perlin();

  


  //var s= "<br>---------------------------<br>---------------------------<br><div style=\"font-size:8px;letter-spacing:5px\">";
  var rooms=0;

  var scale = 0.045;
  var islandwidth = 40;
  var islandheight = 10;

  for (var i =0; i<this.centers.length; i++){
    //get some math info for the center
    var pos = new game.vector2(this.centers[i].lookup[0],this.centers[i].lookup[1]);
    var centered = pos.subtract(this.offset);//
    var distance = centered.length();
    
    var edgenoise = noise.simplex2(this.centers[i].lookup[0],this.centers[i].lookup[1],scale,scale,30);
    var heightnoise = (noise.simplex2(this.centers[i].lookup[0],this.centers[i].lookup[1],scale,scale,-912.3,312.22)+1)*0.5;

    distance += edgenoise*4.2;

    //normalize distance for heightmap multiplication
    var flatten = (islandwidth-distance)/islandwidth;
    var height = heightnoise*flatten*islandheight;

    var rounded = Math.floor((height/islandheight)*10);
    var rgb = rad.hsvToRgb(0,0,rounded*0.1);
    var color = rad.rgbToHex(rgb[0],rgb[1],rgb[2]);
    //s+=n+" ";
    //if(this.centers[i].visible){
    //this.centers[i].string = (n>0?"x":"&nbsp;");
    this.centers[i].string = (distance<islandwidth)?"x":"&nbsp;";
    this.centers[i].color = color;
    //if(this.centers[i].visible){
      //s+=this.centers[i].string;
    //}
    //if((i+1)%this.xdiv===0)s+="<br>";
  }

  //s+="</div><br><br>";
  //return s;
}
