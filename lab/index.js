mygame={};
mygame.graph = new game.graph(50,25);
mygame.position = Math.round(Math.random()*(mygame.graph.centers.length-1));

mygame.server_data = {};//hold all the incoming data

graphover=function(i){
	var over = document.getElementById("graphsquare"+i);
	over.style.color = "red";
	var n = mygame.graph.centers[i].neighbor_ids;
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
	var n = mygame.graph.centers[i].neighbor_ids;
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


		mygame.position=i;
		var p = document.getElementById("graphsquare"+i);
		p.style.color = "blue";

		update_socket();
	}
}
graphclearposition=function(key){
	var oldp = document.getElementById("graphsquare"+mygame.server_data[key].position);
	oldp.removeAttribute("style");
}
graphfillposition=function(key){

	var p = document.getElementById("graphsquare"+mygame.server_data[key].position);
	p.style.color = "red";
}
graphmove=function(code){
	var neighbors = mygame.graph.centers[mygame.position].neighbor_ids;
	switch(code){
		case 87://w
			graphsetposition(neighbors[6]);
			break;
		case 65://a
			graphsetposition(neighbors[4]);
			break;
		case 83://s
			graphsetposition(neighbors[2]);
			break;
		case 68://d
			graphsetposition(neighbors[0]);
			break;
	}

}
//------
var id = -1;//this is my id from the server
//------
var socket = io();

/*init_socket=function(){
	socket.emit('initial ping',{position:mygame.position});
}*/
update_socket=function(){
	socket.emit('update socket',{position:mygame.position})
}

socket.on('server user id',function(i){
	id=i;
	//alert(i);
});
socket.on('server positions', function(data){
	for(var key in mygame.server_data){
		if(key!=id){//ignore my own data
			graphclearposition(key);
		}
	}
	mygame.server_data = data;
	for(var key in data){
	//for(var i =0; i<data.length;i++){
		if(key!=id){//ignore my own data
			graphfillposition(key);
		}
	}
	//now set the data

});

window.onload=function(){
	var draw = document.getElementById("render");
	draw.innerHTML=mygame.graph.construct_geo();
	graphsetposition(mygame.position);
	var keyevent = new game.keyevent();

	//init_socket();
	update_socket();

}
