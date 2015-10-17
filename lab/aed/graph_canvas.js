aed.graph_canvas=function(id,size,xdiv,ydiv){
  rad.graph.call();
  this.id = id;
  this.size=size||14;

  this.symbols_graph={};//we need a canvas to draw into
  //this.selected_value={};
  this.init(xdiv,ydiv);

  return this;
}
aed.graph_canvas.prototype=new rad.graph();
aed.graph_canvas.prototype.constructor=rad.graph;

aed.graph_canvas.prototype.render=function(){
  g = document.createElement("DIV");
  //g.style.width = "900px";
  //var s = "";
  for (var i =0; i<this.centers.length; i++){

    ge = document.createElement("DIV");
    ge.style.float="left";
    ge.style.border = "dotted #222222";
    ge.style.borderWidth = "0px 1px 1px 0px";
    //ge.style.margin = "1px";
    ge.id = "graph_"+this.id+"_"+i;
    ge.style.width=this.size+"px";
    ge.style.height=this.size+"px";
    //ge.onmouseover = game.util.closure(this,this.mouseover,"graph_"+this.id+"_"+i);
    //ge.onmouseout = game.util.closure(this,this.mouseout,"graph_"+this.id+"_"+i);
    ge.onmousedown = game.util.closure(this,this.mousedown,"graph_"+this.id+"_"+i);
    ge.innerHTML=this.centers[i].string;

    if((i)%this.xdiv===0){
      ge.style.clear="left";
      //g.appendChild(document.createElement("BR"));//s+="<br>";
      //g.appendChild(document.createElement("BR"));
    }
    g.appendChild(ge);
  }
  //alert(g);
  return g;
}

aed.graph_canvas.prototype.mousedown=function(e,id){
  var elem = document.getElementById(id);
  var paint_mode = document.getElementById("paint_mode");
  if(!paint_mode.checked){
    elem.innerHTML = this.symbols_graph.selected_value;
  }
  elem.style.color = this.symbols_graph.selected_color;
}

/*
///called from on rollover
aed.graph_canvas.prototype.mouseover=function(e,id){
  //alert(id);
  var elem = document.getElementById(id);
  elem.style.color="red";
}
aed.graph_canvas.prototype.mouseout=function(e,id){
  var elem = document.getElementById(id);
  elem.style.color="white";
}


//---------------
//this function inits the pallet with ascii characters
//as many as the input value
aed.graph_canvas.prototype.fetch_ascii=function(total,width){
  width=width||24;
  height=Math.ceil(total/width);
  this.init(width,height)
  for(var i=0;i<total;i++){
      this.centers[i].string="&#"+i;
  }
}*/

aed.graph_canvas.prototype.set_symbols_graph=function(g){
  this.symbols_graph = g;
}
