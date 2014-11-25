game.map=function(xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  return this;
}
game.map.prototype=new game.graph();
game.map.prototype.constructor=game.graph;

game.map.prototype.init=function(xdiv,ydiv){
  game.graph.prototype.init.call(this,xdiv,ydiv);
  this.camera=new game.camera();//now we have a camera for this shit
  this.geo = this.construct_geo();
}

game.map.prototype.construct_geo=function(){
  this.camera.cull(this);

  var noise = new game.perlin();

  var s= "<br>---------------------------<br>---------------------------<br><div style=\"font-size:8px;letter-spacing:5px\">";
  var rooms=0;

  for (var i =0; i<this.centers.length; i++){
    var scale = 0.045;
    var n = noise.simplex2(this.centers[i].lookup[0],this.centers[i].lookup[1],scale,scale,30);
    //s+=n+" ";
    if(this.centers[i].visible){
      s+=(n>0?"x":"&nbsp;");
    }
    if((i+1)%this.xdiv===0)s+="<br>";
  }

  s+="</div><br><br>";
  return s;
}
