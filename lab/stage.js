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
  this.start_position=0;
  this.end_position=1;
  this.terminal_positions();
  return this;

}
//---------------
game.stage.prototype.construct_geo=function(){
  //game.graph.prototype.construct_geo.call(this);
  s = "";

  for (var i =0; i<this.centers.length; i++){

    if(this.centers[i].is_border){
      char = (i===this.start_position || i===this.end_position)?'x':'&square;';
      s+="<a id=graphsquare"+i+" onmouseover=\"graphover("+i+")\" onmouseout=\"graphout("+i+")\">"+char+"</a>";
    }else{
      char = (i===this.start_position || i===this.end_position)?'x':'&nbsp;';
      s+="<a id=graphsquare"+i+" onmouseover=\"graphover("+i+")\" onmouseout=\"graphout("+i+")\">"+char+"</a>";
    }
    if((i+1)%this.xdiv===0)s+="<br>";
  }
  return s;
}

game.stage.prototype.random_spawn=function(seed){
  //var cell = Math.round(Math.random()*(this.centers.length-1));
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
}

game.stage.prototype.random=function(seed){
  seed = seed||Math.random()*999;
  return Math.abs(Math.sin(seed++));
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
