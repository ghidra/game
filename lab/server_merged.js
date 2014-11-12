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
	this.visible=true;//used by the camera to tag wether we are visible or not
}
game.camera=function(width,height){
  this.init(width,height);
  return this;
}

game.camera.prototype.init=function(width,height){
  this.width = width||48;//hd style rez
  this.height = height||27;
  this.position = new game.vector2(Math.floor(this.width/2),Math.floor(this.height/2));
  this.offset = this.position.duplicate();//make a clone, so that I know what the offset if from the center
}
//--------------position
game.camera.set_position=function(x,y){//
  this.position=new game.vector2(x,y);
}
game.camera.move=function(v){//we expect a vector2
  this.position.add(v);
}
//-------------
//mark visible graph cells
game.camera.prototype.cull=function(graph){
  //this tags only what is visible to the camera
  var min = this.position.subtract( this.offset );
  var max = this.position.add( this.offset );
  //now loop the graph
  for (var i=0;i<graph.centers.length;i++){
    var x = graph.centers[i].lookup[0];
    var y = graph.centers[i].lookup[1];
    if( x<min._x || x>max._x || y<min._y || y>max._y){
      graph.centers[i].visible = false;
    }else{
      graph.centers[i].visible = true;
    }

  }
  //---------------
}
//This class, extends graph.
//It is a graph that is based on the first2 inputs for width and height
//te second inputs are the sub graphs, that are at each point on the main graph
//
//The main graph determines the main path,
//the sub graph, represents each room.
//so there should be a sub graph only for each room

game.stage=function(xdiv,ydiv,subdiv){
  game.graph.call();
  this.init(xdiv,ydiv,subdiv);
  return this;
}
game.stage.prototype=new game.graph();
game.stage.prototype.constructor=game.graph;

game.stage.prototype.init=function(xdiv,ydiv,subdiv){
  game.graph.prototype.init.call(this,xdiv,ydiv);

  //main graph variables
  this.iterations=0;
  this.recursion_threshold=12;//12 times caught in a loop will be my treshold to start over again
  this.catch_recursion=0;
  this.started_over=0;

  this.start_position=-1;
  this.end_position=-1;
  while(this.start_position === this.end_position){
    this.terminal_positions();
  }

  this.travelled=[];//hold the path finding, where we have travelled
  this.backtracked=[];
  this.min_rooms = Math.ceil((xdiv+ydiv)/2);
  //---
  //sub graph variables
  this.subdiv = subdiv||10;
  this.subgraphs = [];//the array to hold the subgraphs

  this.camera = new game.camera();

  //drawing variables
  this.chars_horizontal = xdiv*subdiv;//the number of characters in one horizontal line
  this.chars_vertical = ydiv*subdiv;

  this.find_random_path(this.start_position,this.end_position);//main raph find the random path
  this.make_subgraphs();//now make the subgraphs based on the path

  this.geo = this.construct_geo();
  this.geo += this.construct_geo_sub();

  return this;

}
//---------------
game.stage.prototype.construct_geo=function(){
  //game.graph.prototype.construct_geo.call(this);
  var s = "";
  var rooms=0;

  for (var i =0; i<this.centers.length; i++){
    var char = '';
    if(i===this.start_position || i===this.end_position){
      char = (i===this.start_position)?'i':'o';
      s+="<a stlye=\"float:left\" id=graphsquare"+i+">"+char+"</a>";
      rooms+=1;
    }else{
      //if(this.centers[i].is_room===true){//some are still considers rooms?
        switch(this.centers[i].connection_direction){
          case 0:
            char = '&rightarrow;';
            rooms+=1;
            break;
          case 2:
            char = '&downarrow;';
            rooms+=1;
            break;
          case 4:
            char = '&leftarrow;';
            rooms+=1;
            break;
          case 6:
            char = '&uparrow;';
            rooms+=1;
            break;
          default:
            char = '&nbsp;';
            break;
        }
        //s+="<a id=graphsquare"+i+">"+char+"</div>";
        col = (this.centers[i].connection_step==1)?'red':''
        s+="<a stlye=\"float:left;\" id=graphsquare"+i+" style=\"color:"+col+"\">"+char+"</a>";
      //}
      /*else{
        if(this.centers[i].is_border){
          s+="<a id=graphsquare"+i+">&square;</div>";
        }else{
          s+="<a id=graphsquare"+i+">&nbsp;</div>";
        }
      }*/
    }
    if((i+1)%this.xdiv===0)s+="<br>";
  }
  s+="<br>iterations:"+this.iterations+"<br>";
  s+="started over:"+this.started_over+"<br>";

  s+="<br>steps:"+rooms+"<br>";
  s+="travelled:"+this.travelled.length;
  s+="<br><br>";
  return s;
}

game.stage.prototype.construct_geo_sub=function(){
  var s='<div style="font-size:8px;letter-spacing:5px">';
  var count = 0;
  var debug = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'];

  for(var yd = 0; yd < this.ydiv*this.subdiv; yd++){//do the verticals first,for each line of characters, so this is ydiv * sibdiv
    for(var xd = 0; xd < this.xdiv; xd++){//then do the horizontal,for each main graph point

      //the main graph values
      var row = Math.floor(yd/this.subdiv);//the row of the main graph that we are on
      var mid = (row*this.xdiv)+xd;//the id of the main graph that we are

      var subrow = yd%this.subdiv;//the row of the subgraph, xd is the column

      if(this.centers[mid].is_room){//now if this is a center, we have a corresponding sub graph
        var char = '';
        switch(this.centers[mid].connection_direction){
          case 0:
            char = '&rightarrow;';
            break;
          case 2:
            char = '&downarrow;';
            break;
          case 4:
            char = '&leftarrow;';
            break;
          case 6:
            char = '&uparrow;';
            break;
          default:
            char = 'x';
            break;
          }
        //now loop the columns
        for(var c=0; c<this.subdiv; c++){
          var sid = (subrow*this.subdiv)+c//the subgraph id
          if( this.subgraphs[ this.centers[mid].subgraph_id ].centers[sid].is_border ){
            s+=char;
          }else{
            s+='&nbsp;';
          }
        }
        ///
        //s+=Array(this.subdiv + 1).join(this.centers[mid].connection_enter);
      }else{
        s+=Array(this.subdiv + 1).join('&nbsp');
      }
      if(xd==this.xdiv-1) s+='<br>';//this is the end of the row
    }

  }
  return s+"</div>";
}

//----------------


/////
//The below functions build the main graph
//----------------
//----------------
game.stage.prototype.clear_backtrack=function(){
  while(this.backtracked.length > 0) {
    var i = this.backtracked[this.backtracked.length-1];
    this.centers[i].is_room=false;
    this.centers[i].visited=false;
    this.centers[i].connection_direction = -1;
    this.centers[i].connection_enter = -1;
    this.centers[i].connection_step = -1;
    this.backtracked.pop();
  }
}
game.stage.prototype.backtrack=function(position,end,seed){//send the backtrack position
  if(this.travelled.length<=1){
    this.clear_backtrack();
    this.next_position(this.travelled[this.travelled.length-1],end,seed)
  }else{
    var back = this.travelled.pop()
    this.backtracked.push(back);//add this point to the back tracked array
    this.centers[position].is_room=false;
    this.centers[position].visited=true;
    this.centers[position].connection_direction=-1;
    this.centers[position].connection_enter=-1;
    this.centers[position].connection_step = -1;
    this.next_position(back,end,seed);//recursion
  }
}
game.stage.prototype.startover=function(seed){
  this.started_over+=1;

  this.clear_backtrack();
  while(this.travelled.length > 0) {
    var p = this.travelled.pop();
  }
  for(var i=0;i<this.centers.length;i++){
    this.centers[i].is_room=false;
    this.centers[i].visited=false;
    this.centers[i].connection_direction = -1;
    this.centers[i].connection_enter = -1;
    this.centers[i].connection_step = -1;
  }

  this.start_position=-1;
  this.end_position=-1;
  while(this.start_position === this.end_position){
    this.terminal_positions();
  }

  this.catch_recursion=0;

  this.find_random_path(this.start_position,this.end_position,seed);
}
//------
//------
game.stage.prototype.next_position=function(position,end,seed,search){

  seed = seed||0;
  search = search||[0,2,4,6];
  seed+=1;
  this.iterations+=1;

  var direction_index = Math.floor(this.random(seed)*search.length);//get a random direction
  var this_point = this.centers[position];
  var direction = search[direction_index];

  var next = this_point.neighbor_ids[direction];//get the id of that neighboring point
  search.splice(search.indexOf(search[direction_index]),1);//remove the direction

  if(this.catch_recursion>=this.recursion_threshold){
    this.startover(seed);
    return;
  }

  if(next === end){//if this equals, we have rached the end
    if(this.travelled.length<this.min_rooms){
      this.startover(seed);
      return;
    }
    this.clear_backtrack();
    this_point.is_room = true;
    this_point.visited = true;
    this_point.connection_direction = direction;
    this_point.connection_enter = this.centers[this.travelled[this.travelled.length-1]].connection_direction;
    this_point.connection_step = this.travelled.length;
    return
  }else{
    //first, is this point locked in
    var epn = (this_point.neighbor_ids[0]>=0)?this.centers[this_point.neighbor_ids[0]].visited:true;
    var spn = (this_point.neighbor_ids[2]>=0)?this.centers[this_point.neighbor_ids[2]].visited:true;
    var wpn = (this_point.neighbor_ids[4]>=0)?this.centers[this_point.neighbor_ids[4]].visited:true;
    var npn = (this_point.neighbor_ids[6]>=0)?this.centers[this_point.neighbor_ids[6]].visited:true;

    var is_trapped = (epn && spn && wpn && npn);
    var is_graph = (next>=0);
    var is_nextvalid = (is_graph)?(this.centers[next].visited === false && this.centers[next].is_room === false):false;
    var is_exausted = (search.length<1);

    if(!is_trapped && is_graph && is_nextvalid && !is_exausted){
      this.clear_backtrack();
      this.catch_recursion=0;
      this_point.is_room = true;
      this_point.visited = true;
      this_point.connection_direction = direction;
      if(this.travelled.length>0)this_point.connection_enter = this.centers[this.travelled[this.travelled.length-1]].connection_direction;
      this_point.connection_step = this.travelled.length;
      this.travelled.push(position);
      this.next_position(next,end,seed);//recursion
    }else{
      if(is_exausted || is_trapped){//we need to go back
        this.catch_recursion+=1;
        this.backtrack(position,end,seed);//add this point to the back tracked array
      }else{//we need to try again
        this.catch_recursion+=1;
        this.next_position(position,end,seed,search);
      }
    }


  }

}
//----------------
game.stage.prototype.find_random_path=function(start,end,seed){
  this.next_position(start,end,seed);
}
//-------
game.stage.prototype.random_spawn=function(seed){
  var cell = Math.round(this.random(seed)*(this.centers.length-1));
  if(this.centers[cell].is_border===true){
    this.random_spawn();
  }else{
    return cell;
  }
}
//-------
game.stage.prototype.terminal_positions=function(seed){
  start = this.random(seed);
  end = this.random(seed+23);
  this.start_position = Math.round(start*(this.centers.length-1));
  this.end_position = Math.round(end*(this.centers.length-1));

  this.centers[this.end_position].is_room = true;
  this.centers[this.end_position].visited = true;

  this.debug_pos_seed = Math.asin(start)*(180/Math.PI);
}

game.stage.prototype.random=function(seed){
  seed = seed||Math.round(Math.random()*999);
  return Math.abs(Math.sin(seed++));
}

////
////
//these function below build the sub graphs

game.stage.prototype.make_subgraphs=function(){
  for (var i =0; i<this.centers.length; i++){
      if(this.centers[i].is_room){//if the main graphs point is a center point, we can make a sub graph
        this.centers[i].subgraph_id = this.subgraphs.length;
        this.subgraphs.push(new game.graph());
        this.subgraphs[this.subgraphs.length-1].init(this.subdiv);//init the graph
        //now populate the graph using data from the main graph
        //specifically the directions
        if(this.centers[i].connection_enter>=0) this.subgraphs[this.subgraphs.length-1].clear_border( ((this.centers[i].connection_enter/2)+2)%4 );
        if(this.centers[i].connection_direction>=0) this.subgraphs[this.subgraphs.length-1].clear_border( this.centers[i].connection_direction/2 );
      }
  }
}
//this class expect the game.vector2 class
game.perlin=function(){
  return this.init();
}
game.perlin.prototype.init=function(){

  //this.xdiv = xdiv||10;
  //this.ydiv = ydiv||10;
  this._GRAD = [new game.vector2(1,1),new game.vector2(-1,1),new game.vector2(1,-1),new game.vector2(-1,-1),
    new game.vector2(1,0),new game.vector2(-1,0),new game.vector2(1,0),new game.vector2(-1,0),
    new game.vector2(0,1),new game.vector2(0,-1),new game.vector2(0,1),new game.vector2(0,-1),
    new game.vector2(1,1),new game.vector2(0,-1),new game.vector2(-1,1),new game.vector2(0,-1)];

  /*this._GRAD3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
    [1,1,0],[0,-1,1],[-1,1,0],[0,-1,-1]];*/

  this.p = [151,160,137,91,90,15,
    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
    190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
    88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,
    135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
    223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,
    129,22,39,253,9,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,
    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
    49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

  //this.period = this.permutation.length;
  this.perm = new Array(512);
  this.gradP = new Array(512);


  this._F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  this._G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
  this._F3 = 1.0 / 3.0;
  this._G3 = 1.0 / 6.0;

  this.seed(0);

  //this.double_permutation();

  return this;

}

/*game.perlin.prototype.double_permutation=function(){
  var iter = this.permutation.length;
  for(var t=0; t<iter;t++){
    this.permutation.push(this.permutation[t]);
  }
}*/

/*game.perlin.prototype.randomize=function(p){
  period = p || 0;
  perm=[];

  perm_right = period - 1;

  for (var i=0; i< period;i++){
    var j = Math.floor(Math.random(0)*perm_right);
    perm[j]=perm[i];
    perm[i]=perm[j];
  }
  this.permutation = perm;
  this.double_permutation();
}*/

game.perlin.prototype.seed=function(seed){
  if(seed > 0 && seed < 1) {
    // Scale the seed out
    seed *= 65536;
  }
  seed = Math.floor(seed);
  if(seed < 256) {
    seed |= seed << 8;
  }
  for(var i = 0; i < 256; i++) {
    var v;
    if (i & 1) {
      v = this.p[i] ^ (seed & 255);
    } else {
      v = this.p[i] ^ ((seed>>8) & 255);
    }
    this.perm[i] = this.perm[i + 256] = v;
    this.gradP[i] = this.gradP[i + 256] = this._GRAD[v % 12];
  }
}
//-------------------
game.perlin.prototype.fade = function(t) {
  return t*t*t*(t*(t*6-15)+10);
}
game.perlin.prototype.lerp = function(a, b, t) {
  return (1-t)*a + t*b;
}

game.perlin.prototype.perlin2=function(x, y,sx, sy, ox, oy){
  /*2D Perlin simplex noise.
  Return a floating point value from -1 to 1 for the given x, y coordinate.
  The same value is always returned for a given x, y pair unless the
  permutation table changes (see randomize above).
  */
  //Skew input space to determine which simplex (triangle) we are in
  sx=sx||0.0;
  sy=sy||0.0;
  ox=ox||0.0;
  oy=oy||0.0;
  x = (x+ox)*sx;
  y = (y+oy)*sy;

  //https://github.com/josephg/noisejs/blob/master/perlin.js
  // Find unit grid cell containing point
  var _x = Math.floor(x);
  var _y = Math.floor(y);
  // Get relative xy coordinates of point within that cell
  x = x - _x;
  y = y - _y;
  // Get relative xy coordinates of point within that cell
  _x = _x & 255;
  _y = _y & 255;

  var n00 = this.gradP[_x+this.perm[_y]].dot(new game.vector2(x, y));
  var n01 = this.gradP[_x+this.perm[_y+1]].dot(new game.vector2(x, y-1));
  var n10 = this.gradP[_x+1+this.perm[_y]].dot(new game.vector2(x-1, y));
  var n11 = this.gradP[_x+1+this.perm[_y+1]].dot(new game.vector2(x-1, y-1));

  // Compute the fade curve value for x
  var u = this.fade(x);
  return this.lerp( this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y) );
}
//----------------
game.perlin.prototype.simplex2 = function(xin, yin, sx, sy, ox, oy) {
  //Skew input space to determine which simplex (triangle) we are in
  sx=sx||0.0;
  sy=sy||0.0;
  ox=ox||0.0;
  oy=oy||0.0;
  xin = (xin+ox)*sx;
  yin = (yin+oy)*sy;

  var n0, n1, n2; // Noise contributions from the three corners
  // Skew the input space to determine which simplex cell we're in
  var s = (xin+yin)*this._F2; // Hairy factor for 2D
  var i = Math.floor(xin+s);
  var j = Math.floor(yin+s);
  var t = (i+j)*this._G2;
  var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
  var y0 = yin-j+t;
  // For the 2D case, the simplex shape is an equilateral triangle.
  // Determine which simplex we are in.
  var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
  if(x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
    i1=1; j1=0;
  }else{ // upper triangle, YX order: (0,0)->(0,1)->(1,1)
    i1=0; j1=1;
  }
  // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
  // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
  // c = (3-sqrt(3))/6
  var x1 = x0 - i1 + this._G2; // Offsets for middle corner in (x,y) unskewed coords
  var y1 = y0 - j1 + this._G2;
  var x2 = x0 - 1 + 2 * this._G2; // Offsets for last corner in (x,y) unskewed coords
  var y2 = y0 - 1 + 2 * this._G2;
  // Work out the hashed gradient indices of the three simplex corners
  i &= 255;
  j &= 255;
  var gi0 = this.gradP[i+this.perm[j]];
  var gi1 = this.gradP[i+i1+this.perm[j+j1]];
  var gi2 = this.gradP[i+1+this.perm[j+1]];
  // Calculate the contribution from the three corners
  var t0 = 0.5 - x0*x0-y0*y0;
  if(t0<0) {
    n0 = 0;
  }else{
    t0 *= t0;
    n0 = t0 * t0 * gi0.dot(new game.vector2(x0, y0)); // (x,y) of grad3 used for 2D gradient
  }
  var t1 = 0.5 - x1*x1-y1*y1;
  if(t1<0) {
    n1 = 0;
  }else{
    t1 *= t1;
    n1 = t1 * t1 * gi1.dot(new game.vector2(x1, y1));
  }
  var t2 = 0.5 - x2*x2-y2*y2;
  if(t2<0) {
    n2 = 0;
  }else{
    t2 *= t2;
    n2 = t2 * t2 * gi2.dot(new game.vector2(x2, y2));
  }
  // Add contributions from each corner to get the final noise value.
  // The result is scaled to return values in the interval [-1,1].
  return 70 * (n0 + n1 + n2);
}
game.village=function(xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  return this;
}
game.village.prototype=new game.graph();
game.village.prototype.constructor=game.graph;

game.village.prototype.init=function(xdiv,ydiv){

}
game.world=function(xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  return this;
}
game.world.prototype=new game.graph();
game.world.prototype.constructor=game.graph;

game.world.prototype.init=function(xdiv,ydiv){
  game.graph.prototype.init.call(this,xdiv,ydiv);
  this.camera=new game.camera();//now we have a camera for this shit
  this.geo = this.construct_geo();
}

game.world.prototype.construct_geo=function(){
  this.camera.cull(this);

  var noise = new game.perlin();

  var s= "<br>---------------------------<br>---------------------------<br><div style=\"font-size:8px;letter-spacing:5px\">";
  var rooms=0;

  for (var i =0; i<this.centers.length; i++){
    var scale = 0.045;
    var n = noise.simplex2(this.centers[i].lookup[0],this.centers[i].lookup[1],scale,scale,30);
    //s+=n+" ";
    if(this.centers[i].visible){
      s+=(n>0?"x":"&nbsp;");
    }
    if((i+1)%this.xdiv===0)s+="<br>";
  }

  s+="</div><br><br>";
  return s;
}
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
