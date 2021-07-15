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
  var player_id = this.players.player_connected();
  var world_id = this.worlds.get_key(0);
  this.worlds.worlds[ world_id ].place_player(player_id);//place the player in the world
  return {"world_id":world_id,"player_id": player_id};//this sets and then gets the player data
}
game.server.vars.prototype.player_disconnected=function(id){
  this.players.player_disconnected( id );
  io.emit('user disconnected',id);
  console.log("-----------player dissconnected: "+this.players.loggedin() );
}

var server_vars = new game.server.vars();

//------------------------------
// IMPORTANT SOCKET IO SEQUENCE OF EVENTS
//------------------------------

/*
const express = require('express');
const http = require('http');
const path = require('path');

const app = new express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const port = process.env.PORT || 8888;

io.origins('*:*');//cross domain issue thing

app.get('/',function(request,response){
  response.sendFile(path.join(__dirname,'/index.html'));
});
app.use(express.static(__dirname+'/'));//

//app.listen(port);
server.listen(port,function(){console.log('game server started')});

//console.log('we trying something');
////--------------------------------------

io.on('connection',function(socket){
  socket.emit('logged in',JSON.stringify({'log in':'success'}));
  socket.on('disconnect',function(){console.log('disconnected')});
});

*/
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.origins('*:*');//cross domain issue thing //https://stackoverflow.com/questions/24058157/socket-io-node-js-cross-origin-request-blocked

app.get('/', function(req, res){res.sendFile(__dirname + '/index.html');});
app.use(express.static(__dirname + '/'));//my fucking god, this allows me to use my scrips again!

server.listen(game.ws_port, function(){console.log('game server started: listening on *:'+game.ws_port,);});
//-----------------------------
//-----------------------------
//make my server game loop, so that I just emit every nth of a seconds


let myVar = setInterval(function(){ loop() }, (1.0/60.0)*1000);

function loop() {
  //here I send my data to the connected players
  if(server_vars.players.loggedin()>0)
  {
    //console.log(JSON.stringify(server_vars.players.all_positions()));
    io.emit('server positions',JSON.stringify(server_vars.players.all_positions() ));//now send the player data to the other players
  }
}

function stoploop() {
    clearInterval(myVar);
}


///

io.on('connection', function(socket){
  //player connected
  //console.log("give me something");
  var connected_data = server_vars.player_connected();//the socket now has the player
  socket.world_id = connected_data.world_id;
  socket.player_id = connected_data.player_id;
  var login_data = {
    player_id: connected_data.player_id,
    //world_id: connected_data.world_id,
    world: server_vars.worlds.worlds[connected_data.world_id]
  };
  //console.log("give me something");
  socket.emit('logged in', JSON.stringify(login_data));//send the user data to the client //now we need to send data back to the client to build what then need, world etc
  //socket.emit('init world', server_vars.worlds.worlds[socket.player.world]);

  //io.emit('server positions',server_vars.players.all_positions() );//now send the player data to the other players

  //socket.on('request map',fuction(data){
    //right now we are just asking for the world
    //socket.emit('give map',server_vars.worlds.worlds[data]);
  //});
  //This is incoing from the client
  socket.on('update socket',function(data){
    //console.log(server_vars.players[socket.player.id]);
    //server_vars.players[socket.player.id].set_data(data);
    //console.log(socket.player_id);//
    //console.log(server_vars.players.get_player(socket.player_id))
    server_vars.players.get_player(socket.player_id).set_data(data);
    //socket.player.set_data(data);
    //console.log(data);
    //user_data[socket.user_id].position = data.position;//store the data
    //socket.broadcast.emit('server positions',user_data);//then send the data
    //socket.emit('server positions',user_data);//then send the data
    //io.emit('server positions',user_data);//then send the data
  });

  socket.on('disconnect', function(){
    //user_data.splice(socket.user_id,1);
    //var disconnected_id = socket.player.id;
    server_vars.player_disconnected(socket.player_id);
    //server_vars.players.player_disconnected( disconnected_id )
    //delete server_vars.players[disconnected_id];
    //io.emit('user disconnected',disconnected_id);
    
  });

});
