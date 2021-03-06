game.viewport=function(xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  return this;
}
game.viewport.prototype=new game.graph();
game.viewport.prototype.constructor=game.graph;

game.viewport.prototype.init=function(xdiv,ydiv){
  this.camera=new game.camera(xdiv,ydiv);//now we have a camera for this shit
  game.graph.prototype.init.call(this,this.camera.width,this.camera.height);
  this.player={};//the player that we want to follow around in the viewport
  this.buffer={};//this will be the buffer to draw, and to merge all the passes into
  this.mapBuffer={};//buffer to hold the map only
  //this.geo = this.construct_geo();
}

/*game.viewport.prototype.construct_geo=function(){
  var s = "<div id=\"viewport\">";

  for (var i =0; i<this.centers.length; i++){
    s+="<div id=\"veiwport"+i+"\" style=\"float:left;\">&nbsp;</div>";
    if((i+1)%this.xdiv===0)s+="<br>";
  }

  s+="</div><br><br>";
  return s;
}*/
game.viewport.prototype.set_player=function(player){
  this.player = player;
}
//send a graph in to render a pass
game.viewport.prototype.set_buffer=function(g){
  this.buffer=new game.graph();
  this.buffer.init(g.xdiv,g.ydiv);

  this.mapBuffer=new game.graph();
  this.mapBuffer.init(g.xdiv,g.ydiv);
  this.mapBuffer.merge(g);
}
game.viewport.prototype.merge=function(graph){
  /*for (var i =0; i<this.buffer.centers.length; i++){
    this.buffer.centers[i].string = graph.centers[i].string;
  }*/
  this.buffer.merge(graph);

  /*this.camera.cull(graph);
  var count = 0;
  for (var i =0; i<graph.centers.length; i++){
    if(graph.centers[i].visible){
      this.centers[count].string = graph.centers[i].string;
      //this.buffer.centers[i].string = graph.centers[i].string;
      count+=1;
    }
  }*/
}
game.viewport.prototype.merge_cell=function(v,x,y){
  x = x||0;
  y = y||0;
  this.buffer.centers[ (this.buffer.xdiv*y)+x ].string=v;
}
game.viewport.prototype.clear=function(){
  for (var i=0; i<this.centers.length; i++){
    this.centers[i].string="";
    //this.centers[i].color="#FFFFFF";
    //this.centers[i].visible=false;
  }
}
///////////////////////
// since we knoe about the map, and whatever else needs to be drawn, we can check status here
game.viewport.prototype.queryMap=function(x,y){
  return this.mapBuffer.query_center(x,y);
}

///////////////////////
game.viewport.prototype.clearToMap=function(){
  this.buffer.merge(this.mapBuffer);
}

game.viewport.prototype.render=function(){//was construct_geo
  //first lets move the camera relative to the player, but allowing it not to go past the borders of the buffer
  var move_camera = new game.vector2();
  if (this.player.position._x>this.camera.offset._x-1 && this.player.position._x<this.buffer.xdiv-this.camera.offset._x+2) this.camera.position._x = this.player.position._x;
  if (this.player.position._y>this.camera.offset._y-1 && this.player.position._y<this.buffer.ydiv-this.camera.offset._y+2) this.camera.position._y = this.player.position._y;
  //this.camera.move(move_camera);

  this.camera.cull(this.buffer,this);//copy the correct graph parts into the viewpoets graph
  var s = "";
  //for (var i =0; i<this.centers.length; i++){
  //  s += this.centers[i].string;
  //  if((i+1)%this.camera.width===0)s+="<br>";
  //}
  /*var count = 0;
  for (var i =0; i<this.buffer.centers.length; i++){
    if(this.buffer.centers[i].visible){
      //this.centers[count].string = this.buffer.centers[i].string;
      //grab color
      s += "<span style=\"color:"+this.buffer.centers[i].color+"\";>"+this.buffer.centers[i].string+"</span>";
      //s += this.buffer.centers[i].string;
      if(count>0 &&(count)%this.camera.width===0)s+="<br>";
      count+=1;
    }
  }*/

  ///LOOP THE VIEWPORT GRAPH
  for (var i =0; i<this.centers.length; i++){
    s += "<span style=\"color:"+this.centers[i].color+"\";>"+this.centers[i].string+"</span>";
    if( (i+1)%(this.xdiv)===0 ) s+="<br>";
  }
  //console.log(this.xdiv);
  return s;
}
