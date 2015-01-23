aed.graph=function(xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  return this;
}
aed.graph.prototype=new game.graph();
aed.graph.prototype.constructor=game.graph;

aed.graph.prototype.render=function(){
  var s = "";
  for (var i =0; i<this.centers.length; i++){
    s += this.centers[i].string;
    if((i+1)%this.xdiv===0)s+="<br>";
  }
  return s;
}


//---------------
//this function inits the pallet with ascii characters
//as many as the input value
aed.graph.prototype.fetch_ascii=function(total,width){
  width=width||24;
  height=Math.ceil(total/width);
  this.init(width,height)
  for(var i=0;i<total;i++){
    this.centers[i].string="&#"+i;
  }
}
