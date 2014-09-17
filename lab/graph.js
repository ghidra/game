//this class expect the game.vector2 class
game.graph=function(xdiv,ydiv){
	return this.init(xdiv,ydiv);
}
game.graph.prototype.init=function(xdiv,ydiv){
	this.xdiv = xdiv||10;
	this.ydiv = ydiv||10;

	this.offset = new game.vector2(Math.floor(this.xdiv/2),Math.floor(this.ydiv/2));

	this.centers = [];

	this.construct_graph();
	//this.construct_geo();

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
		s+="<a id=graphsquare"+i+" onmouseover=\"graphover("+i+")\" onmouseout=\"graphout("+i+")\">&square;</a>";
		if((i+1)%this.xdiv===0)s+="<br>";
	}
	return s;
}
//----------------



//-----------------
//-----------------

game.graph_center=function(id,lu,n,bo){
	//id, lookup,neighbor, is border
	this.init(id,lu,n,bo);
	return this;
}
game.graph_center.prototype.init=function(id,lu,n,bo){
	this.index_ = id;
	this.lookup = lu;
    	this.neighbor_ids = n;//array of ints
    	this.is_border = bo || false;//bool
}
