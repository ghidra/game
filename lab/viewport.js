game.viewport=function(xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  return this;
}
game.viewport.prototype=new game.graph();
game.viewport.prototype.constructor=game.graph;

game.viewport.prototype.init=function(xdiv,ydiv){
  game.graph.prototype.init.call(this,xdiv,ydiv);
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

}
