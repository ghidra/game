game = {};
game.vector2=function(x,y){
	return this.init(x,y);
}

game.vector2.prototype.init=function(x,y){
	this._x = x||0;
	this._y = y||0;
	return this;
}
game.vector2.prototype.normalize=function(){
	var v = new game.vector2();
	var l = this.length();
	if (l==0){
		v._x=0;
		v._y=0;
	}else{
		v._x = this._x / l;
		v._y = this._y / l;
	}
	return v;
}
game.vector2.prototype.length=function(){
	return Math.sqrt( (this._x*this._x)+(this._y*this._y) );
}

game.vector2.prototype.dot=function(v){
	return ( this._x * v._x + this._y * v._y );
}

game.vector2.prototype.add=function(w){
	var v = new game.vector2();
	v._x = this._x + w._x;
	v._y = this._y + w._y;
	return v;
}

game.vector2.prototype.subtract=function(w){
	var v = new game.vector2();
	v._x = this._x - w._x;
	v._y = this._y - w._y;
	return v;
}

game.vector2.prototype.multiply_scalar=function(s){
	var v = new game.vector2();
	v._x = this._x * s;
	v._y = this._y * s;
	return v;
}
game.vector2.prototype.divide_scalar=function(s){
	var v = new game.vector2();
	v._x = this._x/s;
	v._y = this._y/s;
	return v;
}
game.vector2.prototype.copy=function(v){
	this._x=v._x;
	this._y=v._y;
	return this;
}
game.vector2.prototype.duplicate=function(){
	return new game.vector2(this._x,this._y);
}
//this class expect the game.vector2 class
game.graph=function(){
	return this;
}
game.graph.prototype.init=function(xdiv,ydiv){
	this.xdiv = xdiv||10;
	this.ydiv = ydiv||10;

	this.offset = new game.vector2(Math.floor(this.xdiv/2),Math.floor(this.ydiv/2));

	this.centers = [];

	this.construct_graph();
	//this.construct_geo();
	return this;

}
game.graph.prototype.construct_graph=function(){
	var off = 0;
	var x = this.xdiv;
	var y = this.ydiv;

	for(var i = 0 ; i < x*y ; i++){
		off = Math.floor(i/x);

		var lookup = [off,i%x];

		//neightbor centers
		var n0 = ((i+1)%x > 0) ? i+1 : -2;//east
		var n2 = (i+x < x*y) ? i+x : -2;//south
		var n1 = (n0 >= 0) ? n2+1: -2;//southeast
		var n4 = (i%x > 0) ? i-1 : -2;//west
		var n3 = (n4 >= 0) ? n2-1 : -2;//southwest
		var n6 = i-x;//north
		var n5 = (n4 >= 0) ? n6-1: -2;//northwest
		var n7 = (n0 >= 0) ? n6+1 : -2;//northeast

		//east southeast south southwest west northwest north northeast
		//0    1         2     3         4    5         6     7
		var neighbor_ids = [n0,n1,n2,n3,n4,n5,n6,n7];

		//determine if it is a border
		var border_test = ( i<x || i%x == x-1 || i%x == 0 || i>(x*y)-x );

		this.centers.push(new game.graph_center(this.centers.length,lookup, neighbor_ids, border_test ));
	}
}
game.graph.prototype.construct_geo=function(){
	s = "";
	for (var i =0; i<this.centers.length; i++){
		if(this.centers[i].is_border){
			s+="<a id=graphsquare"+i+" onmouseover=\"graphover("+i+")\" onmouseout=\"graphout("+i+")\">&square;</a>";
		}else{
			s+="<a id=graphsquare"+i+" onmouseover=\"graphover("+i+")\" onmouseout=\"graphout("+i+")\">&nbsp;</a>";
		}
		if((i+1)%this.xdiv===0)s+="<br>";
	}
	return s;
}
//----------------
//server related functions, to minimize the amount of data
//to be transfered to client to rebuild this particular graph
//----------------


//client related data, to use the data send from the server
//to rebuild the particular graph

//-----------------
//-----------------

game.graph_center=function(id,lu,n,bo){
	//id, lookup,neighbor, is border
	this.init(id,lu,n,bo);
	return this;
}
game.graph_center.prototype.init=function(id,lu,n,bo){
	this.index_ = id;
	this.lookup = lu;//an array of x y coordinate
  this.neighbor_ids = n;//array of ints

  this.is_border = bo || false;//bool

	//this.is_wall = false;
	//this.is_occupied = false;
	//this.is_collidable = false;
}
//this class expect the game.vector2 class
game.stage=function(xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  return this;
}
game.stage.prototype=new game.graph();
game.stage.prototype.constructor=game.graph;

game.stage.prototype.init=function(xdiv,ydiv){
  game.graph.prototype.init.call(this,xdiv,ydiv);
  return this;

}

game.stage.prototype.random_spawn=function(seed){
  seed = seed||Math.random()*999;
  var rand = Math.abs(Math.sin(seed++));

  //var cell = Math.round(Math.random()*(this.centers.length-1));
  var cell = Math.round(rand*(this.centers.length-1));
  if(this.centers[cell].is_border===true){
    this.random_spawn();
  }else{
    return cell;
  }
}

/*game.stage.prototype.construct_graph=function(){
  game.graph.prototype.construct_graph.call();
}

game.stage.prototype.construct_geo=function(){
  game.graph.prototype.construct_geo.call();
}*/

//----------------
//server related functions, to minimize the amount of data
//to be transfered to client to rebuild this particular graph
//----------------


//client related data, to use the data send from the server
//to rebuild the particular graph

//-----------------
//-----------------

/*game.graph_center=function(id,lu,n,bo){
  //id, lookup,neighbor, is border
  this.init(id,lu,n,bo);
  return this;
}
game.graph_center.prototype.init=function(id,lu,n,bo){
  this.index_ = id;
  this.lookup = lu;//an array of x y coordinate
  this.neighbor_ids = n;//array of ints

  this.is_border = bo || false;//bool

  //this.is_wall = false;
  //this.is_occupied = false;
  //this.is_collidable = false;
}*/
///
///-------
//start game related data
///-------
///
//users data
var user_count = 0;
var user_data = {};//hold all the data of uses in an array
//------
//game data
var game_stage = new game.stage(25,15);
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
  //init the id
  console.log(user_count+':connected');
  socket.user_id = user_count;//give id to the client socket
  user_data[user_count]={};//user_data[socket.user_id]={};//create an object to hold all i need for the user
  user_data[user_count].position = game_stage.random_spawn();
  socket.emit('logged in',{id:user_count,stage:game_stage,spawn_position:user_data[user_count].position});//send the user id to the client

  io.emit('server positions',user_data);

  ++user_count;//increment the global id

  socket.on('update socket',function(data){

    user_data[socket.user_id].position = data.position;//store the data
    //socket.broadcast.emit('server positions',user_data);//then send the data
    //socket.emit('server positions',user_data);//then send the data
    io.emit('server positions',user_data);//then send the data
  });

  socket.on('disconnect', function(){
    //im also going to need to let everyone know thier new id number
    //user_data.splice(socket.user_id,1);
    console.log('user '+socket.user_id+ ' disconnected');
    io.emit('user disconnected',socket.user_id);
    delete user_data[socket.user_id];
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

//-------------------
//-------------------


//--------------------END server.js
