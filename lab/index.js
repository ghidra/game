mygame={};
mygame.graph = new game.graph();

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


window.onload=function(){
	canvas = document.getElementById("render");
	canvas.innerHTML=mygame.graph.construct_geo();
}
