aed.graph_symbols=function(id,outside_active_flag,size,xdiv,ydiv,show_index){
  //rad.graph.call();
  aed.graph_ascii.call();
  //this.init(xdiv,ydiv);
  this.id = id;
  this.size=size||14;
  this.init(id,size,xdiv,ydiv);

  //this.canvas={};//we need a canvas to draw into
  this.selected_id=-1;//this hold the id so I can turn it off when another one is selected
  this.selected_value="&nbsp;";
  this.selected_color="#FFFFFF";

  this.outside_active_flag = outside_active_flag;///this is to try and set the outside value

  this.container={};

  //this.centers.ascii_index=[];//store ascii index value on centers
  this.show_index=show_index||false;//wether we want to show it... we can not show it in the canvas part, it breas the saving of it

  return this;
}
//aed.graph_symbols.prototype=new rad.graph();
//aed.graph_symbols.prototype.constructor=rad.graph;

aed.graph_symbols.prototype=new aed.graph_ascii();
aed.graph_symbols.prototype.constructor=aed.graph_ascii;

aed.graph_symbols.prototype.render=function(){
  this.container = document.createElement("DIV");
  this.container.style.color=this.selected_color;

  //this.container.style.maxHeight="300px";//"auto";//"100%";
  //this.container.style.overflowY="scroll";

  this.container.className="palette_wrapper";
  //g.style.width = "300px";
  //var s = "";
  for (var i =0; i<this.centers.length; i++){
    //console.log("hi");
    ge = document.createElement("DIV");
    //ge.style.float="left";
    //ge.style.margin = "1px";
    ge.style.border = "dotted #FFFFFF";//#222222
    ge.style.borderWidth = "0px 1px 1px 0px";

    ge.id = "graph_"+this.id+"_"+i;
    ge.className = "symbol_button";
    ge.style.width=this.size+"px";
    ge.style.height=this.size+"px";
    ge.onmouseover = game.util.closure(this,this.mouseover,"graph_"+this.id+"_"+i);
    ge.onmouseout = game.util.closure(this,this.mouseout,"graph_"+this.id+"_"+i);
    ge.onmousedown = game.util.closure(this,this.mousedown,"graph_"+this.id+"_"+i);
    ge.innerHTML=this.centers[i].string;
    

    //make a tooltip to show the value
    //this is braking saving
    /*if(this.show_index){
      tt = document.createElement("SPAN");
      tt.className = "symbol_tooltip";
      tt.innerHTML = this.centers[i].ascii_index;
      ge.appendChild(tt);
    }*/

    //if((i)%this.xdiv===0){
    //  ge.style.clear="left";
    //}
    this.container.appendChild(ge);
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

  this.outside_active_flag(this);//set the outside flag to this object
}

aed.graph_symbols.prototype.set_color=function(c){
  this.selected_color=c;
  this.container.style.color=c;
}

//---------------
//this function inits the pallet with ascii characters
//as many as the input value
///include an array to IGNORE

aed.graph_symbols.prototype.fetch_ascii=function(total,width){
  this.show_index=true;
  width=width||16;
  //ok..so we need to build an array of the value we want to use here.. and make a new graph with that same length
  if (total<0){
    //12954;
    total=11870;
  }
  var legal_str = "33-126,128,130-140,142,145-156,158,159,161-887,891-895,900-906,908,910-929,931-1327,1329-1366,1369-1418,1421-1423,2273,2274,2288-2386,2389-2435,2437-2444,2447,2448,2451-2472,2474-2480,2482,2486-2489,2493-2500,2503,2504,2507-2510,1519,2524,2525,2527-2531,2434-2558,2565-4351,4608-6862,6912-11843";
  var legal = rad.indexstringtoarray(legal_str);
  //var ignore=[143,144,160,888,889,896,897,898,899,907,909,930,1328,1367,1368,1419,1420,1424,1480,1481,1482,1483,1484,1485,1486,1487];
  //var addPastInitLength=[11994,12040,12069,12197,12207,12272-12283,12295-12306,12308-12315,12349,12350,12539,12951,12953 ];//these are extra ones PAST the main block I've found works

  total=legal.length;
  //total+=addPastInitLength.length;

  //re-init this thing with the real shit
  this.init(this.id,this.size,16,Math.ceil(total/16));

  for(var i=0;i<total;i++){
      this.centers[i].string="&#"+legal[i];
      this.centers[i].ascii_index=legal[i];//store the index with it
  }
}

//aed.graph_symbols.prototype.set_canvas=function(g){
//  this.canvas = g;
//}
