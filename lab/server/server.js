game.server.vars=function(){
  return this.init();
}
game.server.vars.prototype.init=function(){
  this.players = new game.server.players();//object to hold the players info
  this.worlds = new game.server.worlds();//object to hold the world info
}
  //first check if a world exists, and if not create one
game.server.vars.prototype.player_connected=function(){
  //if a world or worlds do or does exist
    //then we can either presnt the choice, or just drop them in a random one
    //new worlds can be created by story elements
    //potentially cap the number of worlds to a maximum
      //and if a new world is required for story, drop them in a random one
  //for now, I can assume you start in world one
    //and progress from there
    //crate world one is it does not exist
  if(game.util.is_empty(this.worlds.worlds)){//now worlds exist, we need to make one
    this.worlds.build_world();
  }
  //for now, just send the first world to the player
  var player = this.players.player_connected();
  var world_id = this.worlds.get_key(0);
  this.worlds.worlds[ world_id ].place_player(player);//place the player in the world
  player.set_data({"world":world_id,"position": this.worlds.worlds[ world_id ].players[ player.id ].position});//this will set the world the player is in
  return player;//this sets and then gets the player data
}

var server_vars = new game.server.vars();

//------------------------------
//------------------------------

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/'));//my fucking god, this allows me to use my scrips again!

//-----------------------------
//-----------------------------

io.on('connection', function(socket){
  //player connected
  socket.player = server_vars.player_connected();//the socket now has the player
  var login_data = {
    player: socket.player,
    position:socket.player.position,
    world: server_vars.worlds.worlds[socket.player.world]
  };
  socket.emit('logged in', login_data);//send the user data to the client //now we need to send data back to the client to build what then need, world etc
  socket.emit('init world', server_vars.worlds.worlds[socket.player.world]);

  io.emit('server positions',server_vars.players.all_positions() );//now send the player data to the other players

  //socket.on('request map',fuction(data){
    //right now we are just asking for the world
    //socket.emit('give map',server_vars.worlds.worlds[data]);
  //});
  socket.on('update socket',function(data){
    server_vars.players[socket.player.id].receive_data(data);
    //user_data[socket.user_id].position = data.position;//store the data
    //socket.broadcast.emit('server positions',user_data);//then send the data
    //socket.emit('server positions',user_data);//then send the data

    //io.emit('server positions',user_data);//then send the data
  });

  socket.on('disconnect', function(){
    //user_data.splice(socket.user_id,1);
    var disconnected_id = socket.player.id;
    server_vars.players.player_disconnected( disconnected_id )
    delete server_vars.players[disconnected_id];
    io.emit('user disconnected',disconnected_id);
  });

});

http.listen(3000, function(){
  console.log('game server started: listening on *:3000');
});
