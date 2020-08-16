aed.graph_symbols_custom=function(id,outside_active_flag,size,xdiv,ydiv){
  rad.graph.call();
  this.id = id;
  this.size=size||16;

  xdiv=xdiv||4;
  ydiv=ydiv||4;

  this.symbols_graph={};//we need a canvas to draw into
  //this.selected_value={};
  this.palette_array=[];
  this.palette_set=[];
  this.init(xdiv,ydiv);

  this.outside_active_flag = outside_active_flag;///this is to try and set the outside value

  return this;
}
aed.graph_symbols_custom.prototype=new aed.graph_symbols();
aed.graph_symbols_custom.prototype.constructor=aed.graph_symbols;

/*aed.graph_symbols_custom.prototype.mousedown=function(e,index){
  if(this.palette_set[index]){
    //this.symbols_graph.mousedown(e,this.palette_array[index]);
    this.symbols_graph.set_color(this.palette_array[index]);
  }else{

    var swatch = document.getElementById(this.id+"_"+index);
    swatch.style.backgroundColor=this.symbols_graph.selected_color;
    this.palette_array[index]=this.symbols_graph.selected_color;
    this.palette_set[index]=1;
    //this.symbols_graph.set_color(color);
  }
}*/

/*aed.graph_symbols_custom.prototype.render=function(){
  this.container = document.createElement("DIV");
  this.container.style.color=this.selected_color;
  this.container.style.height="300px";//"auto";//"100%";
  this.container.style.overflowY="scroll";
  //g.style.width = "300px";
  //var s = "";
  for (var i =0; i<this.centers.length; i++){
    //console.log("hi");
    ge = document.createElement("DIV");
    ge.style.float="left";
    //ge.style.margin = "1px";
    ge.id = "graph_"+this.id+"_"+i;
    ge.style.width=this.size+"px";
    ge.style.height=this.size+"px";
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
}*/

aed.graph_symbols_custom.prototype.mousedown=function(e,id){
  aed.graph_symbols.prototype.mousedown.call(this,e,id);

  this.outside_active_flag(this);//set the outside flag to this object
  //alert("something");
}

aed.graph_symbols_custom.prototype.fetch_ascii=function(width,height){
  width=width||16;
  height=height||4;
  this.init(width,height);
  var characters=[
    "&#33","&#34","&#35","&#36","&#37","&#38","&#39","&#40","&#41","&#42","&#43","&#44","&#45","&#46","&#47","&#58",
    "&#59","&#60","&#61","&#62","&#63","&#64","&#91","&#92","&#93","&#94","&#95","&#96","&#123","&#124","&#125","&#126",
    "&#132","&#133","&#134","&#135","&#136","&#137","&#139","&#145","&#146","&#147","&#148","&#149","&#155","&#161","&#162","&#164",
    "&#166","&#171","&#172","&#176","&#177","&#181","&#187","&#247","&#47","&#47","&#47","&#47","&#47","&#47","&#47","&#47"
    ];
  for(var i=0;i<characters.length;i++){
      this.centers[i].string = characters[i];
  }
}
