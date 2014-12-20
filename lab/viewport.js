game.viewport=function(xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  return this;
}
game.viewport.prototype=new game.graph();
game.viewport.prototype.constructor=game.graph;

game.viewport.prototype.init=function(xdiv,ydiv){
  this.camera=new game.camera(xdiv,ydiv);//now we have a camera for this shit
  game.graph.prototype.init.call(this,this.camera.width,this.camera.height);
  this.geo = this.construct_geo();
}

game.viewport.prototype.construct_geo=function(){
  var s = "<div id=\"viewport\">";

  for (var i =0; i<this.centers.length; i++){
    s+="<div id=\"veiwport"+i+"\" style=\"float:left;\">&nbsp;</div>";
    if((i+1)%this.xdiv===0)s+="<br>";
  }

  s+="</div><br><br>";
  return s;
}

//send a graph in to render a pass
game.viewport.prototype.renderpass=function(graph){
  this.camera.cull(graph);
  var count = 0;
  for (var i =0; i<graph.centers.length; i++){
    //console.log(graph.centers[i].visible);
    if(graph.centers[i].visible){

      //console.log(graph.centers[i].visible);
      this.centers[count].string = graph.centers[i].string;
      count+=1;
    }
  }
  //console.log(count);

}

game.viewport.prototype.render=function(){
  var s = "";
  for (var i =0; i<this.centers.length; i++){
      //console.log(graph.centers[i].visible);
      s += this.centers[i].string;
      if((i+1)%this.camera.width===0)s+="<br>";
  }
  return s;
}
