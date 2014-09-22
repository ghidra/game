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
  //init the id
  console.log(user_count+':connected');
  socket.user_id = user_count;//give id to the client socket
  socket.emit('server user id',user_count);//send the user id to the client
  ++user_count;//increment the global id

  socket.on('update socket',function(data){
    user_data[socket.user_id]={};//create an object to hold all i need for the user
    user_data[socket.user_id].position = data.position;//store the data
    //socket.broadcast.emit('server positions',user_data);//then send the data
    //socket.emit('server positions',user_data);//then send the data
    io.emit('server positions',user_data);//then send the data
  });

  socket.on('disconnect', function(){
    //im also going to need to let everyone know thier new id number
    //user_data.splice(socket.user_id,1);
    delete user_data[socket.user_id];
    console.log('user disconnected');
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

//-------------------
//-------------------

//------
//users data
var user_count = 0;
var user_data = {};//hold all the data of uses in an array

//------
