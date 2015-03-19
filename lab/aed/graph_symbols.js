aed.graph_symbols=function(id,xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  this.id = id;

  //this.canvas={};//we need a canvas to draw into
  this.selected_id=-1;//this hold the id so I can turn it off when another one is selected
  this.selected_value="&nbsp;";
  this.selected_color="#FFFFFF";

  this.container={};

  return this;
}
aed.graph_symbols.prototype=new game.graph();
aed.graph_symbols.prototype.constructor=game.graph;

aed.graph_symbols.prototype.render=function(){
  this.container = document.createElement("DIV");
  this.container.style.color=this.selected_color;
  //g.style.width = "300px";
  //var s = "";
  for (var i =0; i<this.centers.length; i++){

    ge = document.createElement("DIV");
    ge.style.float="left";
    //ge.style.margin = "1px";
    ge.id = "graph_"+this.id+"_"+i;
    ge.onmouseover = game.util.closure(this,this.mouseover,"graph_"+this.id+"_"+i);
    ge.onmouseout = game.util.closure(this,this.mouseout,"graph_"+this.id+"_"+i);
    ge.onmousedown = game.util.closure(this,this.mousedown,"graph_"+this.id+"_"+i);
    ge.innerHTML=this.centers[i].string;
    this.container.appendChild(ge);

    if((i)%this.xdiv===0){
      ge.style.clear="left";
    }
  }
  //alert(g);
  return this.container;
}

///called from on rollover
aed.graph_symbols.prototype.mouseover=function(e,id){
  //alert(id);
  var elem = document.getElementById(id);
  if(elem.innerHTML != this.selected_value){
    elem.style.color="red";
  }
}
aed.graph_symbols.prototype.mouseout=function(e,id){
  var elem = document.getElementById(id);
  if(elem.innerHTML != this.selected_value){
    //elem.removeAttribute("style");
    elem.style.color="";
  }
}
aed.graph_symbols.prototype.mousedown=function(e,id){
  if(this.selected_id!=-1){
    var oldelem = document.getElementById(this.selected_id);
    oldelem.style.color="";
  }
  var elem = document.getElementById(id);
  elem.style.color="yellow";
  this.selected_value=elem.innerHTML;
  this.selected_id=id;
}

aed.graph_symbols.prototype.set_color=function(c){
  this.selected_color=c;
  this.container.style.color=c;
}

//---------------
//this function inits the pallet with ascii characters
//as many as the input value
aed.graph_symbols.prototype.fetch_ascii=function(total,width){
  width=width||16;
  //this.xdiv=width;
  height=Math.ceil(total/width);
  this.init(width,height);
  var offset=33;//the first 33 codes are nothing, 32 is actually a space
  for(var i=offset;i<total;i++){
      this.centers[i-offset].string="&#"+i;
  }
}

//aed.graph_symbols.prototype.set_canvas=function(g){
//  this.canvas = g;
//}
