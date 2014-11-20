game.server.world=function(id){
  return this.init(id);
}
game.server.world.prototype.init=function(i){
  this.id=i;
  this.seed_terminal = game.math.random();//the terminal seed to build this world
  this.seed_path = game.math.random();//the path seed to build this world

  this.players={};//object to hold the players data
  //potentiall after the first build, I can harvest the seed used in the end, to eliminate start overs etc
}

//------------------
game.server.world.prototype.place_player=function(player){
  this.players[player.id] = {};
  this.players[player.id].position = new game.vector2(2,2); 
}
