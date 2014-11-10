game.world=function(xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  return this;
}
game.world.prototype=new game.graph();
game.world.prototype.constructor=game.graph;

game.world.prototype.init=function(xdiv,ydiv){
  game.graph.prototype.init.call(this,xdiv,ydiv);



  this.geo = this.construct_geo();

}

game.world.prototype.construct_geo=function(){
  var noise = new game.perlin();

  var s= "<br>---------------------------<br>---------------------------<br>";
  var rooms=0;

  for (var i =0; i<this.centers.length; i++){
    var scale = 0.1;
    var n = noise.simplex2(this.centers[i].lookup[0],this.centers[i].lookup[1],scale,scale,30);
    //s+=n+" ";
    s+=(n>0?"x":"&nbsp;")
    if((i+1)%this.xdiv===0)s+="<br>";
  }

  s+="<br><br>";
  return s;
}
