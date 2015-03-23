aed.graph_colors_custom=function(id,xdiv,ydiv){
  game.graph.call();
  this.id = id;

  xdiv=xdiv||4;
  ydiv=ydiv||4;

  this.symbols_graph={};//we need a canvas to draw into
  //this.selected_value={};
  this.palette_array=[];
  this.init(xdiv,ydiv);

  return this;
}
aed.graph_colors_custom.prototype=new aed.graph_colors();
aed.graph_colors_custom.prototype.constructor=aed.graph_colors;

aed.graph_colors_custom.prototype.render=function(){
 	gdiv = document.createElement("DIV");

 	var v = this.xdiv*this.ydiv;
  //var cube_root = Math.pow(v, 1/3);
  var quads=(this.xdiv>4)?this.xdiv/4:4;
  //var quads = this.xdiv/4;
  for(var i=0; i<v;i++){  
    //column = i%cube_root;
    //row = Math.floor(i/cube_root)%cube_root;
    //plane = Math.floor(i/(Math.pow(cube_root,2)));
    //column = i%this.xdiv;
    column=i%quads;
    row=Math.floor(i/quads)%quads;
    plane = Math.floor(i/this.xdiv)%this.xdiv;//Math.floor(i/(Math.pow(cube_root,2)));
    //row=0;
    //plane=0;
    red = Math.floor((column/(quads-1))*255.0);
    green = Math.floor((row/(quads-1))*255.0);
    blue = Math.floor((plane/(this.xdiv-1))*255.0);
    //red=r/255.0;
    //green=g/255.0;
    //blue=b/255.0;

    //var c = this.convert_color(red,green,blue);
    var c = this.convert_color(25,25,25);
    this.palette_array.push(c);
    var cdiv = document.createElement("DIV");
    cdiv.style.backgroundColor=c;
    cdiv.style.float="left";
    cdiv.style.margin = "0px 1px 1px 0px";
    cdiv.style.width = "16px";
    cdiv.style.height = "16px";
    cdiv.id=this.id+"_"+i;
    cdiv.onmousedown = game.util.closure(this,this.mousedown,i);
    
    cdiv.innerHTML=this.centers[i].string;
    if(i%this.xdiv===0){
      cdiv.style.clear="left";
    }
    gdiv.appendChild(cdiv);
  }

  return gdiv;
}

aed.graph_colors_custom.prototype.mousedown=function(e,index){
  var swatch = document.getElementById(this.id+"_"+index);
  swatch.style.backgroundColor=this.symbols_graph.selected_color;
  this.palette_array[index]=this.symbols_graph.selected_color;
  //this.symbols_graph.set_color(color);
}
