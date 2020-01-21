//this class expect the game.vector2 class
game.graph=function(){
	return this;
}
game.graph.prototype.init=function(xdiv,ydiv){
	this.xdiv = xdiv||10;
	this.ydiv = ydiv||10;

	this.offset = new game.vector2(Math.floor(this.xdiv/2),Math.floor(this.ydiv/2));

	this.centers = [];
	this.length = 0;

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

		var lookup = [i%x,off];

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

		//get the relative position
		this.centers.push(new game.graph_center(this.centers.length,lookup, neighbor_ids, border_test ));
	}
	this.length = this.centers.length+0;
}
game.graph.prototype.render=function(){//was construct_geo
	var s = "";
	for (var i =0; i<this.centers.length; i++){
		s += this.centers[i].string;
		//if((i+1)%this.camera.width===0)s+="<br>";
		if((i+1)%this.xdiv===0)s+="<br>";
	}
	return s;

	/*s = "";
	for (var i =0; i<this.centers.length; i++){
		if(this.centers[i].is_border){
			s+="<a id=graphsquare"+i+" onmouseover=\"graphover("+i+")\" onmouseout=\"graphout("+i+")\">&square;</a>";
		}else{
			s+="<a id=graphsquare"+i+" onmouseover=\"graphover("+i+")\" onmouseout=\"graphout("+i+")\">&nbsp;</a>";
		}
		if((i+1)%this.xdiv===0)s+="<br>";
	}
	return s;*/
}
//-----
//clear a border, right, bottom, left, top 0,1,2,3
game.graph.prototype.clear_border=function(border){
	border = border||0;
	var x = this.xdiv;
	var y = this.ydiv;
	for(var i = 0 ; i < x*y ; i++){
		switch(border){
			case 0:
				if(i%x == x-1)this.centers[i].is_border=false;
				break;
			case 1:
				if(i>(x*y)-x)this.centers[i].is_border=false;
				break;
			case 2:
				if(i%x == 0)this.centers[i].is_border=false;
				break;
			case 3:
				if(i<x)this.centers[i].is_border=false;
				break;
		}

	}
}

///i am changing this from what AED was using... so it might be a little different.. i might beed to check it
game.graph.prototype.merge=function(g,x,y){
	x =  x || 0;
	y =  y || 0;
	//merge another graph into this graph
	var start_offset = (this.xdiv*y) + x;
	var cell = start_offset*1;
	var row = 0;
	var xcount = x;//this keeps track of the overlapping x values, so we ignore values that are off the graph
	
	for(var i=0;i<g.centers.length;i++){//loop the incoming graph, it should be smaller, but if not, we can handle that too
	//	if ((i+start_offset)%)
		//check that we are on next row of the base graph, increas values if so
		if(i>0 && i%g.xdiv==0) //only up row after first row
		{
			row++;
			xcount = x;
			cell = ((y+row)*this.xdiv)+x;
		}
		//check that we are still inside the graphs x
		if(xcount<this.xdiv)
		{
			//check that we are still inside the graph
			if(cell < this.length)
			{
				this.centers[ cell ].copy( g.centers[i] );
				//this.centers[cell].string = g.centers[i].string;
				//this.centers[cell].color = g.centers[i].color;
				xcount++;
				cell++;
			}
		}
	}
}
game.graph.prototype.query_center=function(x,y){
	x =  x || 0;
	y =  y || 0;
	//merge another graph into this graph
	var offset = (this.xdiv*y) + x;
	return this.centers[offset];
}
//right now, the server packes the world with rad.fastclone
//it basiicly removes the object, and makes it an arbitrary object.
//so i have to put it back together
game.graph.prototype.construct_from_server=function(g){
	this.init(g.xdiv,g.ydiv);//reset the size
	for(var i=0;i<g.centers.length;i++){//loop the incoming graph, it should be smaller, but if not, we can handle that too
		//this.centers[i].copy(g.centers[i]);
		this.centers[i].string = g.centers[i].string;
		this.centers[i].color = g.centers[i].color;
		if(g.centers[i].callback_data!=false)
			this.centers[i].callback_data = rad.objclonefast(g.centers[i].callback_data);
	}
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
/*game.graph_center.prototype.init=function(id,lu,n,bo){
	this.index_ = id;
	this.lookup = lu;//an array of x y coordinate
  	this.neighbor_ids = n;//array of ints

  	this.is_border = bo || false;//bool

	this.is_room = false;
	this.visited = false;//this is used for path finding
	this.subgraph_id = -1;
	this.connection_direction = -1;//the direction the next neighbor was found at, for paths
	this.connection_enter = -1;//the direction that we were entered from
	this.connection_step = -1;
	//this.searched = [];//this will hold an array of directions that have been searched to avoid searching them again

	//this.is_wall = false;
	//this.is_occupied = false;
	//this.is_collidable = false;
	//this.visible=false;//used by the camera to tag wether we are visible or not

	//this.string="";
	this.string="&nbsp;";
	this.color = "#323232";
}*/
game.graph_center.prototype.init=function(id,lu,n,bo,s,c,a,na,m,ir,vis,sgi,cd,ce,cs){
	this.index_ = 				id;
	this.lookup = 				lu;//an array of x y coordinate
  	this.neighbor_ids = 		 n;//array of ints

  	this.is_border = 			bo || false;//bool

  	this.string=				 s || "&nbsp;";
	this.color = 				 c || "#323232";

	///map based information
	this.callback_data=			 a || false;//not a real call back, but the object with the information for the call back..this might be a call back
	this.type=					na || "";//this will tell me what it is.
	this.material=				 m || 0;//material -1 is solid, 0 is air... then we can add to the value to make it more dense

	////used for pathfinding 
	this.is_room = 				ir || false;
	this.visited = 			   vis || false;//this is used for path finding
	this.subgraph_id = 		   sgi || -1;
	this.connection_direction = cd || -1;//the direction the next neighbor was found at, for paths
	this.connection_enter = 	ce || -1;//the direction that we were entered from
	this.connection_step = 		cs || -1;
}
game.graph_center.prototype.copy=function(c){
	this.init(c.index_,c.lookup,c.neighbor_ids,c.is_border,c.string,c.color,c.callback_data,c.type,c.material,c.is_room,c.visited,c.subgraph_id,c.connection_direction,c.connection_enter,c.connection_step);
}
