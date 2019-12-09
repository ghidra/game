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

  for (var i =0; i<this.centers.length; i++){
    //get some math info for the center
    var centered = this.centers[i].position.subtract(this.offset);//
    var distance = centered.length();

    var scale = 0.045;
    var n = noise.simplex2(this.centers[i].lookup[0],this.centers[i].lookup[1],scale,scale,30);
    
    distance += n*4.2;
    //s+=n+" ";
    //if(this.centers[i].visible){
    //this.centers[i].string = (n>0?"x":"&nbsp;");
    this.centers[i].string = (distance<40?"x":"&nbsp;");
    //if(this.centers[i].visible){
      //s+=this.centers[i].string;
    //}
    //if((i+1)%this.xdiv===0)s+="<br>";
  }

  //s+="</div><br><br>";
  //return s;
}
