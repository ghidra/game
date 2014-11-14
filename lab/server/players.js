game.server.players=function(){
  return this.init();
}
game.server.players.prototype.init=function(){
  this.count=0;//number of players on
  this.players={};//array to hold the players
}

game.server.players.prototype.player_connected=function(){
  var player = new game.server.player(this.count);
  this.players[this.count] = player;
  console.log('new user: '+this.count+' :connected');
  this.count++;
  return player;//give the player data back for immediate usage
}

game.server.players.prototype.player_disconnected=function(id){
  console.log('user: '+this.players[id].id+ ' :disconnected');
}

game.server.players.prototype.all_positions=function(){
  var positions = {};
  for(var i=0; i<this.players.length; i++){
    //positions[i] = [];
    //positions[i][0] = this.players[i].id;
    //positions[i][1] = this.players[i].position;
    positions[this.players[i].id] = this.players[i].position;
  }
  return positions;
}
