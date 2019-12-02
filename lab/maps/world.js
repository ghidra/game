//a map will be a composite of all elements, generated.
//stage, villages, and world.
//it will also hold all the pertinent data:
//players, enemies, power ups, etc
game.world=function(id){
  this.init(id);
}
game.world.prototype.init=function(i){
  this.id=i;

  this.players={};//object to hold the players data

  this.villages={};
  this.stages={};

  this.map_offset = new game.vector2(game.math.random()*2000,game.math.random()*2000);
  this.map_size = new game.vector2(96,96);

  //potentiall after the first build, I can harvest the seed used in the end, to eliminate start overs etc
  //temp variables
  this.temp_seed = new game.vector2(game.math.random(),game.math.random());

  this.seed_terminal = game.math.random();//the terminal seed to build this world
  this.seed_path = game.math.random();//the path seed to build this world
}

//------------------
game.world.prototype.place_player=function(player){
  this.players[player.id] = {};
  this.players[player.id].position = new game.vector2(2,2);
}

///----------------------
/*
I need to generate a map: save seeds
in that map, i need to generate villages, cites, etc: save seeds
in that map, i need to generate stages, caves etc: save seeds
----
place the player in a village
----

*/

//--------LOCAL FUNCTCTIONS
//----setting data, so far when the server send the world data to the player, this is used to set variables
game.world.prototype.set_data=function(data){
  for(var key in data) {
      switch(key){
        case "map_offset":
          this.map_offset.copy( data[key] );
          break;
        case "map_size":
          this.map_size.copy( data[key] );
          break;
        case "temp_seed":
          this.temp_seed.copy( data[key] );
          break;
      }
  }
}
