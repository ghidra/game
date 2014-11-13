game.server.player=function(id){
  return this.init(id);
}
game.server.player.init=function(i){
  this.id=i;
  this.position = new game.vector2();//the position of this player
}
game.server.player.receive_data=function(data){
  return;
}
