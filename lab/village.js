game.village=function(xdiv,ydiv,subdiv){
  game.graph.call();
  this.init(xdiv,ydiv,subdiv);
  return this;
}
game.village.prototype=new game.graph();
game.village.prototype.constructor=game.graph;

game.village.prototype.init=function(xdiv,ydiv){

}
