game.server.world=function(id){
  return this.init(id);
}
game.server.world.prototype.init=function(i){
  this.id=i;
  this.seed_terminal = game.math.random();//the terminal seed to build this world
  this.seed_path = game.math.random();//the path seed to build this world
  //potentiall after the first build, I can harvest the seed used in the end, to eliminate start overs etc
}
