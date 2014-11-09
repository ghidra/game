game.village=function(xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  return this;
}
game.village.prototype=new game.graph();
game.village.prototype.constructor=game.graph;

game.village.prototype.init=function(xdiv,ydiv){

}
