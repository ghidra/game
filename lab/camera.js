game.camera=function(xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  return this;
}
game.camera.prototype=new game.graph();
game.camera.prototype.constructor=game.graph;

game.camera.prototype.init=function(xdiv,ydiv){
  this.xdiv = xdiv||48;//hd style rez
  this.ydiv = ydiv||27;
  game.graph.prototype.init.call(this,this.xdiv,this.ydiv);
}
