aed.graph_colors=function(id,size,xdiv,ydiv){
  rad.graph.call();
  this.id = id;
  this.size=size||16;

  xdiv=xdiv||16;
  ydiv=ydiv||16;

  this.symbols_graph={};//we need a canvas to draw into
  this.swatch={};//hold the swatch div
  //this.selected_value={};//this is redundant, but we reference it from the custom palette graph
  this.init(xdiv,ydiv);

  return this;
}
aed.graph_colors.prototype=new rad.graph();
aed.graph_colors.prototype.constructor=rad.graph;

aed.graph_colors.prototype.render=function(){
  ///color picker example for colors
  //http://jsfiddle.net/spmbt/6943a/
 	adiv = document.createElement("DIV");
  adiv.className="palette_container";

  this.swatch = document.createElement("DIV");
  //this.swatch.className="palette_swatch";
  this.swatch.style.width=this.size*2+"px";
  this.swatch.style.height=this.size*2+"px";
  this.swatch.style.backgroundColor='#ffffff';

  adiv.appendChild(this.swatch);

  gdiv = document.createElement("DIV");
  gdiv.className="palette_wrapper";

 	var v = this.xdiv*this.ydiv;
  //var cube_root = Math.pow(v, 1/3);
  var quads = this.xdiv/4;
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

    var c = this.convert_color(red,green,blue);
    var cdiv = document.createElement("DIV");
    cdiv.style.backgroundColor=c;
    //cdiv.style.float="left";
    //cdiv.style.margin = "0px 1px 1px 0px";
    cdiv.style.width=this.size+"px";
    cdiv.style.height=this.size+"px";
    cdiv.onmousedown = game.util.closure(this,this.mousedown,c);
    
    cdiv.innerHTML=this.centers[i].string;
    //if(i%this.xdiv===0){
    //  cdiv.style.clear="left";
    //}
    gdiv.appendChild(cdiv);
  }

  adiv.appendChild(gdiv);
  return adiv;
}

aed.graph_colors.prototype.mousedown=function(e,color){
  this.swatch.style.backgroundColor=color;
  this.symbols_graph.set_color(color);
}


aed.graph_colors.prototype.set_symbols_graph=function(g){
  this.symbols_graph = g;
}

aed.graph_colors.prototype.convert_color=function(r, g, b){
    var decColor =0x1000000+ b + 0x100 * g + 0x10000 *r ;
    return '#'+decColor.toString(16).substr(1);
}
