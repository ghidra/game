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

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('initial ping',function(data){
    console.log(data.position);
    socket.broadcast.emit('positions',data.position);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
