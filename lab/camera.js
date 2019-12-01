game.camera=function(width,height){
  this.init(width,height);
  return this;
}

game.camera.prototype.init=function(width,height){
  this.width = width||49;//hd style rez
  this.height = height||27;//needs to be an even number otherwise we get weird shit
  this.position = new game.vector2(Math.ceil(this.width/2),Math.ceil(this.height/2));
  this.offset = this.position.duplicate();//make a clone, so that I know what the offset if from the center
  this.maxoffset = this.offset.add(new game.vector2(-1,-1));//need to subtract 1 otherwise we are one value too big in min max calc
}
//--------------position
/*game.camera.prototype.set_position=function(x,y){//
  this.position=new game.vector2(x,y);
}
game.camera.prototype.move=function(v){//we expect a vector2
  this.position.add(v);
}*/
//-------------
//mark visible graph cells
game.camera.prototype.cull=function(graph){
  //this tags only what is visible to the camera
  var min = this.position.subtract( this.offset );
  var max = this.position.add( this.maxoffset );
  //now loop the graph
  for (var i=0;i<graph.centers.length;i++){
    var x = graph.centers[i].lookup[0];
    var y = graph.centers[i].lookup[1];
    if( x>=min._x && x<max._x && y>=min._y && y<max._y){
      graph.centers[i].visible = true;
    }else{
      graph.centers[i].visible = false;
    }

  }
  //---------------
}
