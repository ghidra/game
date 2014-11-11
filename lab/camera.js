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
