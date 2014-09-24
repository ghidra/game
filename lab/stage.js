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

game.stage.prototype.random_spawn=function(){
  var cell = Math.round(Math.random()*(this.centers.length-1));
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
