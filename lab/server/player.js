game.server.player=function(id){
  return this.init(id);
}
game.server.player.prototype.init=function(i){
  this.id=i;
  this.position = new game.vector2();//the position of this player
  this.world = -1;//the world id that the player is in
}
//this function is data that is set by the sever
game.server.player.prototype.set_data=function(data){
  for(var key in data) {
      switch(key){
        case "position":
          break;
        case "world":
          this.world = data[key];
          break;
      }
  }
}
//this function is data that is sent to the server by the players client
game.server.player.prototype.receive_data=function(data){
  return;
}
