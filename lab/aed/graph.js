aed.graph=function(id,xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  this.id = id;

  return this;
}
aed.graph.prototype=new game.graph();
aed.graph.prototype.constructor=game.graph;

aed.graph.prototype.render=function(){
  g = document.createElement("DIV");
  g.style.width = "400px";
  //var s = "";
  for (var i =0; i<this.centers.length; i++){

    ge = document.createElement("DIV");
    ge.style.float="left";
    //ge.style.margin = "1px";
    ge.id = "graph_"+this.id+"_"+i;
    ge.onmouseover = game.util.closure(this,this.mouseover,"graph_"+this.id+"_"+i);
    ge.onmouseout = game.util.closure(this,this.mouseout,"graph_"+this.id+"_"+i);
    ge.innerHTML=this.centers[i].string;
    g.appendChild(ge);

    //if((i+1)%this.xdiv===0){
      //g.appendChild(document.createElement("BR"));//s+="<br>";
      //g.appendChild(document.createElement("BR"));
    //}
  }
  //alert(g);
  return g;
}

///called from on rollover
aed.graph.prototype.mouseover=function(e,id){
  //alert(id);
  var elem = document.getElementById(id);
  elem.style.color="red";
}
aed.graph.prototype.mouseout=function(e,id){
  var elem = document.getElementById(id);
  elem.style.color="white";
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
