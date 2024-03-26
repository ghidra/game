aed.graph_symbols=function(id,outside_active_flag,size,xdiv,ydiv,show_index=false){
  rad.graph.call();
  this.init(xdiv,ydiv);
  this.id = id;
  this.size=size||14;

  //this.canvas={};//we need a canvas to draw into
  this.selected_id=-1;//this hold the id so I can turn it off when another one is selected
  this.selected_value="&nbsp;";
  this.selected_color="#FFFFFF";

  this.outside_active_flag = outside_active_flag;///this is to try and set the outside value

  this.container={};

  this.centers.ascii_index=[];//store ascii index value on centers
  this.show_index=show_index;//wether we want to show it... we can not show it in the canvas part, it breas the saving of it

  return this;
}
aed.graph_symbols.prototype=new rad.graph();
aed.graph_symbols.prototype.constructor=rad.graph;

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
    if(this.show_index){
      tt = document.createElement("SPAN");
      tt.className = "symbol_tooltip";
      tt.innerHTML = this.centers[i].ascii_index;
      ge.appendChild(tt);
    }

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
aed.graph_symbols.ignore=[143,144,160,888,889,896,897,898,899,907,909,930,1328,1367,1368,1419,1420,1424,1480,1481,1482,1483,1484,1485,1486,1487];
aed.graph_symbols.allinclude=[11994,12040,12069,12197,12207,12272,12273,12274,12275,12276,12277,12278,12279,12280,12281,12282,12283,12295,12296,12297,12298,12299,12300,12301,12302,12303,12304,12305,12306,12308,12309,12310,12311,12312,12313,12314,12315,12349,12350,12539,12951,12953 ];//these are extra ones PAST the main block I've found works
aed.graph_symbols.prototype.fetch_ascii=function(total,width){
  this.show_index=true;
  width=width||16;
  if (total<0){
    //12954;
    total=11870;
  }
  //this.xdiv=width;
  height=Math.ceil(total/width);
  this.init(width,height);
  var offset=33;//the first 33 codes are nothing, 32 is actually a space
  var count=0;
  for(var i=offset;i<total;i++){
    if(aed.graph_symbols.ignore.indexOf(i)<0){
      this.centers[count].string="&#"+i;
      this.centers[count].ascii_index=i;//store the index with it
      count=count+1;
    }
  }
  for(var i=0;i<aed.graph_symbols.allinclude.length;i++){
    this.centers[count].string="&#"+aed.graph_symbols.allinclude[i];
    this.centers[count].ascii_index=aed.graph_symbols.allinclude[i];//store the index with it
    count=count+1;
  }
}

//aed.graph_symbols.prototype.set_canvas=function(g){
//  this.canvas = g;
//}
