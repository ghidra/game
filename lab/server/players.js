//requires rad object
game.server.players=function(){
  return this.init();
}
game.server.players.prototype.init=function(){
  this.count=0;//number of players on
  this.players={};//array to hold the players
  this.countloggedin=0;
}

game.server.players.prototype.player_connected=function(){
  var player = new game.player(this.count);
  this.players["player_"+this.count] = player;
  console.log('new user: '+this.count+' :connected');
  this.count++;
  this.countloggedin++;
  return player;//give the player data back for immediate usage
}
game.server.players.prototype.get_player=function(id){
  this.players["player_"+id];//return the player
}

game.server.players.prototype.player_disconnected=function(id){
  console.log('user: '+this.players["player_"+id].id+ ' :disconnected');
  delete this.players["player_"+id];
  this.countloggedin--;
}
game.server.players.prototype.loggedin=function(){
  return this.countloggedin;
}
game.server.players.prototype.all_positions=function(){
  var positions = {};
  for (var p in this.players){
    //console.log(JSON.stringify(this.players[p]));
    if( Object.prototype.hasOwnProperty.call(this.players, p) ){
      positions[p] = this.players[p].position;
    }
  }
  return positions;
}
