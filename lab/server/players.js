game.server.players=function(){
  return this.init();
}
game.server.players.init=function(){
  this.count=0;//number of players on
  this.players={};//array to hold the players
}

game.server.players.player_connected=function(){
  var player = new game.server.player(this.count);
  this.players[this.count] = player;
  console.log(user_count+':connected');
  this.count++;
  return player;//give the player data back for immediate usage
}

game.server.players.player_disconnected=function(){

}

game.server.players.all_positions=function(){
  var positions = {};
  for(var i=0; i<this.players.length; i++){
    //positions[i] = [];
    //positions[i][0] = this.players[i].id;
    //positions[i][1] = this.players[i].position;
    positions[this.players[i].id] = this.players[i].position;
  }
  return positions;
}
