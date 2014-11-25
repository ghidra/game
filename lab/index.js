var mygame={};
/*
graphover=function(i){
	var over = document.getElementById("graphsquare"+i);
	over.style.color = "red";
	var n = mygame.stage.centers[i].neighbor_ids;
	for(var h = 0; h < n.length;h++){
		if(n[h]>=0){
			var neighbor = document.getElementById("graphsquare"+n[h]);
			neighbor.style.color = "green";
		}
	}
	//mygame.graph.centers[i]
}
graphout=function(i){
	var out = document.getElementById("graphsquare"+i);
	out.removeAttribute("style");
	var n = mygame.stage.centers[i].neighbor_ids;
	for(var h = 0; h < n.length;h++){
		if(n[h]>=0){
  		var neighbor = document.getElementById("graphsquare"+n[h]);
    	neighbor.removeAttribute("style");
    }
	}

}
graphsetposition=function(i){
	if(i>=0){
		var oldp = document.getElementById("graphsquare"+mygame.position);
    oldp.removeAttribute("style");
		oldp.innerHTML="&nbsp;";


		mygame.position=i;
		var p = document.getElementById("graphsquare"+i);
		p.innerHTML = "&bigtriangleup;";
		p.style.color = "blue";

		update_socket();
	}
}
graphclearposition=function(key){
	var oldp = document.getElementById("graphsquare"+mygame.server_data[key].position);
	if(oldp){
		oldp.removeAttribute("style");
		oldp.innerHTML="&nbsp;";
	}
}
graphfillposition=function(key){
	var p = document.getElementById("graphsquare"+mygame.server_data[key].position);
	p.style.color = "red";
	p.innerHTML = "&bigtriangleup;";
}
graphmove=function(code){
	var neighbors = mygame.stage.centers[mygame.position].neighbor_ids;
	switch(code){
		case 87://w
			if(mygame.stage.centers[neighbors[6]].is_border===false)
				graphsetposition(neighbors[6]);
			break;
		case 65://a
			if(mygame.stage.centers[neighbors[4]].is_border===false)
				graphsetposition(neighbors[4]);
			break;
		case 83://s
			if(mygame.stage.centers[neighbors[2]].is_border===false)
				graphsetposition(neighbors[2]);
			break;
		case 68://d
			if(mygame.stage.centers[neighbors[0]].is_border===false)
				graphsetposition(neighbors[0]);
			break;
	}

}*/
//------

//mygame.server_data = {};//hold all the incoming data
mygame.player = new game.player();//data for the player
mygame.world = new game.world();//the data to hold the world given to use by the server
mygame.map={};//the map that ill be given to use
mygame.draw = {};//this is going to be the html element to dra win
mygame.fallback=false;//incase we arent using the server for debug purposes

//var id = -1;//this is my id from the server
if(typeof(io) === "function"){
 	socket = io();
}else{
	//this is if we are not connecting to a node.js server
	mygame.fallback = true;
	socket = {on:function(){

		mygame.stage = new game.stage(12,6);
		mygame.map = new game.map(64,64);
		mygame.draw.innerHTML = "we are not conencted to the server<br>----------------------------------------<br><br>";
		mygame.draw.innerHTML += mygame.stage.geo;
		mygame.draw.innerHTML += mygame.map.geo;
		return;}};//just set a default value on this stuff
}


/*init_socket=function(){
	socket.emit('initial ping',{position:mygame.position});
}*/
update_socket=function(){
	socket.emit('update socket',{position:mygame.position})
}

socket.on('logged in',function(data){
  mygame.player.set_data(data.player);
  mygame.world.set_data(data.world);
  //alert(data.position._x)
  //mygame.player.position = data.position;
	//mygame.player.id = data.player.id;
  //mygame.world = new game.stage(12,6,data.world.temp_seed._x,data.world.temp_seed._y);//build the world
  mygame.map = new game.map(mygame.world.map_size._x,mygame.world.map_size._y);//build the world
	//mygame.world = new game.stage(12,6,data.world.seed_terminal,data.world.seed_path);//build the world
	mygame.draw.innerHTML = mygame.map.geo;//draw the world
	//mygame.stage = new game.stage(data.stage.xdiv,data.stage.ydiv);
	//mygame.draw.innerHTML=mygame.stage.construct_geo();
	//mygame.position = data.spawn_position;
	//graphsetposition(mygame.position);*/
});
socket.on('server positions', function(data){
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

window.onload=function(){
	mygame.draw = document.getElementById("render");
	//draw.innerHTML=mygame.graph.construct_geo();
	//graphsetposition(mygame.position);
	//mygame.draw.innerHTML="we are trying something";
	if(mygame.fallback){
		socket.on();//this calls my fallback function
	}
	//var keyevent = new game.keyevent();

	//init_socket();
	//update_socket();

}
