var mygame={};

//------
/*
set up the required objects on the client side
*/
//mygame.server_data = {};//hold all the incoming data
mygame.player = new game.player();     //data for the player
mygame.world = {};                     //new game.world();//the data to hold the world given to use by the server
mygame.player_id = -1;
mygame.map=new game.map();//(96,96);                         //the map that ill be given to use
mygame.drawviewport=new game.viewport();                //this will be a graph that I draw into
mygame.controller=new game.keyevent();                  //to hold the key events, so I can pass it the player
mygame.draw={};                        //this is going to be the html element to dra win
mygame.fallback=true;                 //incase we arent using the server for debug purposes
mygame.debug={};//the debug div to drop information into

mygame.serverdata={};//this is coming in from the server
//var id = -1;//this is my id from the server

//
/*
if we have a socket object, if node is running, then we can proceed as normal
if there is no socket, then we call back to what is in the else statement so that
we have something, good for debugging
*/

////////////////////////////////////////
////////////////////////////////////////
var lastTick=Date.now();

//The tick function, called all the time
mygame.tick=function(){
	///calculate delta time
	var thisTick=Date.now();
	var deltaTime=(thisTick-lastTick)*0.001;
	lastTick=thisTick;
	//determine move
	///check key events
	var movex = 0;
	var movey = 0;
	if(mygame.controller._key["87"])movey-=1*mygame.player.speed*deltaTime;//mygame.player.move(0,-1);//w
	if(mygame.controller._key["65"])movex-=1*mygame.player.speed*deltaTime;//mygame.player.move(-1,0);//a
	if(mygame.controller._key["83"])movey+=1*mygame.player.speed*deltaTime;//mygame.player.move(0,1);//s
	if(mygame.controller._key["68"])movex+=1*mygame.player.speed*deltaTime;//mygame.player.move(1,0);//d
	
	///determine if the player CAN move to where it wants to
	if(movex!=0 || movey!=0){
		mygame.player.move(movex,movey);//do the move
		//now check against the map we are in
		mapCenter = mygame.drawviewport.queryMap(mygame.player.position._x,mygame.player.position._y);
		console.log(mapCenter.callback_data);
		if(mapCenter.callback_data!=false){
			console.log('we hit something');
			if(mapCenter.callback_data.callback==='entrance'){
				console.log('open cave: '+mapCenter.callback_data.arguments[0]);
			}
		}
	} 

	//update server
	update_socket();
  //console.log("tick");
  s='';
  if(mygame.fallback) s += "we are not conencted to the server<br>----------------------------------------<br><br>";
  
  mygame.drawviewport.clearToMap();//clear to map
  //console.log(mygame.map);
  //mygame.drawviewport.merge(mygame.map);//pass in a graph to be rendered
  mygame.drawviewport.merge_cell("<span style=\"color:green\";>0</span>",Math.round(mygame.player.position._x),Math.round(mygame.player.position._y));
  //mygame.drawviewport.merge_cell("0",3,10);
  for(var p in mygame.serverdata){
		if(p!='player_'+mygame.player.id){
			//console.log(p);
			mygame.drawviewport.merge_cell("<span style=\"color:red\";>0</span>",mygame.serverdata[p]._x,mygame.serverdata[p]._y);
		}
	}

  s+=mygame.drawviewport.render();
  mygame.draw.innerHTML = s;//draw the world

  //draw debug information
  mygame.debug.innerHTML = "x: "+mygame.player.position._x+"<br>y: "+mygame.player.position._y+"<br>";
  mygame.debug.innerHTML += deltaTime;

  requestAnimFrame(mygame.tick,game.settings.fps);
}

////////////////////////////////////////
////////////////////////////////////////

timeout=5000;
timeoutcounter=0;

mygame.waitforconnection=function(){
	if(!socket.connected){
		if(timeoutcounter>timeout){
			mygame.connecting=false;
			console.log("Connection failed");
			//mygame.make_fallback_game();
			console.log("timeoutcounter: "+timeoutcounter);
		}else{
			timeoutcounter++;
			requestAnimFrame(mygame.waitforconnection,game.settings.fps);
		}
	}
}

mygame.make_fallback_game=function(){
	console.log('making fallback game');
	mygame.fallback = true;
	socket = {on:function(){console.log("make fallback game")},
        fallback:function(){
		mygame.map = new game.map(96,96);
        mygame.drawviewport = new game.viewport();
        mygame.drawviewport.set_buffer(mygame.map);
        mygame.drawviewport.set_player(mygame.player);
        mygame.controller = new game.keyevent();
        //mygame.controller.set_player(mygame.player);
        mygame.player.set_boundry(mygame.map.xdiv,mygame.map.ydiv);
		mygame.tick();

		return;},
	close:function(){return;}
	};//just set a default value on this stuff
}

if(typeof(io) === "function"){
 	socket = io();
 	//socket = io.connect(game.url+':'+game.ws_port);//ie:'localhost:3000'
 	mygame.waitforconnection();
 	//console.log(socket);
 	//alert("socket io is installed");
}else{
	//this is if we are not connecting to a node.js server
	mygame.make_fallback_game();
}

//////////////////////////////////////////
//////////////////////////////////////////

/*init_socket=function(){
	socket.emit('initial ping',{position:mygame.position});
}*/
update_socket=function(){
	socket.emit('update socket',{position:mygame.player.position})
}

//////////////////////////////////////////
//////////////////////////////////////////

//
//functions that are called when the server sends up instructions
//

socket.on('logged in',function(data){
	data = JSON.parse(data);
	console.log('user:'+data.player_id+' connected');
	//console.dir(data);
	//once we are in, we need to build the world as the server has given it to us
	//mygame.player = data.player;
	//mygame.world = data.world;//
	mygame.player_id = data.player_id;
	//okay, so the player from the server is a server player object, which is 
	//different that a player object that occurs here as a controllable object
	//we need to take the data from the server object and make my local object
	//as well the world data can be used to build the maps locally.
	//all server dats is just data
	//where local is where we will rebuild everything

	//mygame.map = new game.map(data.world.map_size._x,data.world.map_size._y);
	
	mygame.map.construct_from_server(data.world.worldmap);
	//console.log(mygame.map);
	mygame.drawviewport = new game.viewport(game.settings.rendersize.width,game.settings.rendersize.height);
    //mygame.drawviewport.set_buffer(game.settings.worldmapsize.width,game.settings.worldmapsize.height);
    mygame.drawviewport.set_buffer(mygame.map);//give it the map to draw with
    mygame.drawviewport.set_player(mygame.player);
    mygame.controller = new game.keyevent();
    //mygame.controller.set_player(mygame.player);
    mygame.player.set_boundry(game.settings.worldmapsize.width,game.settings.worldmapsize.height);
    mygame.player.id = data.player_id;
    mygame.fallback = false;
	mygame.tick();

	//console.log(data);

});
socket.on('server positions', function(data){
	//console.log("server positions ----------");
	//console.log(data);
	mygame.serverdata = JSON.parse(data);
	

	/*for(var key in mygame.server_data){
		if(key!=id){//ignore my own data
			graphclearposition(key);
		}
	}
	mygame.server_data = data;
	for(var key in data){
		if(key!=id){//ignore my own data
			graphfillposition(key);
		}
	}*/
	//now set the data

});
socket.on('user disconnected',function(data){
	console.log('user:'+data+' disconnected');
	//graphclearposition(data);
});


//////////////////////////////////////////
//////////////////////////////////////////

window.onload=function(){
	mygame.draw = document.getElementById("render");
	mygame.debug = document.getElementById("debug");
	//draw.innerHTML=mygame.graph.construct_geo();
	//graphsetposition(mygame.position);
	///THIS STILL WORKS
	var tmp = new game.stage(12,6);
	mygame.draw.innerHTML += '<br>'+ tmp.geo;
	
	//mygame.draw.innerHTML="we are trying something";
	//if(mygame.fallback){
	//	socket.fallback();//this calls my fallback function
	//}
	//var keyevent = new game.keyevent();

	//init_socket();
	//update_socket();

}
window.onbeforeunload=function(){
	socket.close();
}
