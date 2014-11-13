game.server.vars=function(){
  return this.init();
}
game.server.vars.prototype.init=function(){
  this.players = new game.server.players();//object to hold the players info
  //this.worlds = new game.server.worlds();//object to hold the world info
}
game.server.vars.prototype.player_connected=function(){
  return this.players.player_connected();//this sets and then gets the player data
}

var server_vars = new game.server.vars();

//---------------

///
///-------
//start game related data
///-------
///
//users data
//var user_count = 0;
//var user_data = {};//hold all the data of uses in an array
//------
//game data
//var game_stage = new game.stage(25,15);
///
///-------
//start websocket shit
///-------
///

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/'));//my fucking god, this allows me to use my scrips again!

/*app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});*/



//-------------------
//-------------------

io.on('connection', function(socket){
  //player connected
  socket.player = server_vars.player_connected();
  //console.log(user_count+':connected');
  //socket.user_id = user_count;//give id to the client socket
  //user_data[user_count]={};//user_data[socket.user_id]={};//create an object to hold all i need for the user
  //user_data[user_count].position = game_stage.random_spawn();
  //socket.emit('logged in',{id:user_count,stage:game_stage,spawn_position:user_data[user_count].position});//send the user id to the client
  //now we need to send data back to the client to build what then need, world etc
  socket.emit('logged in', socket.player);//send the user id to the client

  io.emit('server positions',server_vars.players.all_positions() );//now send the player data to the other players

  //++user_count;//increment the global id

  socket.on('update socket',function(data){
    server_vars.players[socket.player.id].receive_data(data);
    //user_data[socket.user_id].position = data.position;//store the data
    //socket.broadcast.emit('server positions',user_data);//then send the data
    //socket.emit('server positions',user_data);//then send the data

    //io.emit('server positions',user_data);//then send the data
  });

  socket.on('disconnect', function(){
    //user_data.splice(socket.user_id,1);
    //console.log('user '+socket.user_id+ ' disconnected');
    var disconnected_id = socket.player.id;
    server_vars.players.player_disconnected( disconnected_id )
    //delete user_data[socket.user_id];
    delete server_vars.players[disconnected_id];
    io.emit('user disconnected',disconnected_id);
  });

});

http.listen(3000, function(){
  console.log('game server started: listening on *:3000');
});
