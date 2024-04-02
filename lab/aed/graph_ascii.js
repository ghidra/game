aed.graph_ascii=function(){
  return this;
}

aed.graph_ascii.prototype=new rad.graph();
aed.graph_ascii.prototype.constructor=rad.graph;

aed.graph_ascii.prototype.init=function(id,size,xdiv,ydiv){
  this.id = id;
  this.size=size||14;

  //super.init(xdiv,ydiv);
  rad.graph.prototype.init.call(this,xdiv,ydiv);
  for (var i =0; i<this.centers.length; i++){
    this.centers[i].trigger=0;
  }
  //this.pivot=new rad.vector2();
}