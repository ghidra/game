mygame={};
mygame.graph = new game.graph(50,25);
mygame.position = Math.round(Math.random()*(mygame.graph.centers.length-1));

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
	if(i>0){
		var oldp = document.getElementById("graphsquare"+mygame.position);
       		 oldp.removeAttribute("style");


		mygame.position=i;
		var p = document.getElementById("graphsquare"+i);
		p.style.color = "blue";
	}
}
graphfillposition=function(i){
	if(i>0){
		var p = document.getElementById("graphsquare"+i);
		p.style.color = "yellow";
	}
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
var socket = io();
socket.on('positions', function(data){
		graphfillposition(data.position);
});

window.onload=function(){
	var draw = document.getElementById("render");
	draw.innerHTML=mygame.graph.construct_geo();
	graphsetposition(mygame.position);
	var keyevent = new game.keyevent();


	socket.emit('initial ping',{position:mygame.position});

}
