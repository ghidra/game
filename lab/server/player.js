game.server.player=function(id){
  return this.init(id);
}
game.server.player.prototype.init=function(i){
  this.id=i;
  this.position = new game.vector2();//the position of this player
}
game.server.player.prototype.receive_data=function(data){
  return;
}
