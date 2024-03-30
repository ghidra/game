aed.graph_canvas=function(id,outside_active_flag,size,xdiv,ydiv){
  rad.graph.call();
  this.id = id;
  this.size=size||14;

  this.symbols_graph={};//we need a canvas to draw into
  //this.selected_value={};
  this.init(xdiv,ydiv);

  for (var i =0; i<this.centers.length; i++){
    this.centers[i].trigger=0;
  }
  this.trigger_color=["#111111","#FF0000","#00FF00","#0000FF","#222222","#333333","#444444","#555555",]
  
  this.outside_active_flag = outside_active_flag;

  this.onionskin = false; //flag for if this is an onionskin graph.. we have diffrent logic if so on mousedown

  return this;
}
aed.graph_canvas.prototype=new rad.graph();
aed.graph_canvas.prototype.constructor=rad.graph;

aed.graph_canvas.prototype.render=function(render_trigger){
  var _render_trigger=render_trigger||false;
  /*if(_render_trigger){
    console.log("we in here");
  }*/
  //g = document.getElementById("ascii_content");
  g = document.createElement("DIV");
  g.style.display = "grid";
  g.style.gridTemplateColumns = "repeat("+ this.xdiv +",14px)";
  //this.container.className="palette_wrapper";
  //g.style.width = "900px";
  //var s = "";
  for (var i =0; i<this.centers.length; i++){

    ge = document.createElement("DIV");
    //ge.style.float="left";
    ge.style.border = "dotted #222222";
    ge.style.borderWidth = "0px 1px 1px 0px";
    //ge.style.margin = "1px";
    ge.id = "graph_"+this.id+"_"+i;
    ge.className = "symbol_button";//makes it so the span fades out
    ge.style.width=this.size+"px";
    ge.style.height=this.size+"px";
    //ge.onmouseover = game.util.closure(this,this.mouseover,"graph_"+this.id+"_"+i);
    //ge.onmouseout = game.util.closure(this,this.mouseout,"graph_"+this.id+"_"+i);
    ge.onmousedown = game.util.closure(this,this.mousedown,"graph_"+this.id+"_"+i);
    ge.innerHTML=this.centers[i].string;
    ge.style.color=this.centers[i].color;

    if(_render_trigger){
      ge.style.backgroundColor=this.trigger_color[this.centers[i].trigger];
      //console.log("we in here");
    }

    //if((i)%this.xdiv===0){
    //  ge.style.clear="left";
      //g.appendChild(document.createElement("BR"));//s+="<br>";
      //g.appendChild(document.createElement("BR"));
    //}
    g.appendChild(ge);
  }
  //alert(g);
  return g;
}

aed.graph_canvas.prototype.mousedown=function(e,id){
  var elem = document.getElementById(id);
  //var paint_mode = document.getElementById("dd_paintmode_").value;//document.getElementById("paint_mode");

  //get the id to store the value in object
  var sgid = id.split("_");
  var gid = sgid[sgid.length-1];

  if(aed.paintmode==aed.paintmodes[2]){
      this.centers[gid].trigger+=1;
      this.centers[gid].trigger%=8;
      elem.style.backgroundColor=this.trigger_color[this.centers[gid].trigger];
      if (this.onionskin)
      {
        aed.frames[aed.current_frame].centers[gid].trigger = this.centers[gid].trigger;
      }
  }else{

    //get the symbols graph we are using
    var symbols_graph = this.outside_active_flag();

    ///set this on the onionskinned and non onion skin graph
    this.centers[gid].string = symbols_graph.selected_value;///I ALSO NEED TO STORE THE COLOR
    this.centers[gid].color = symbols_graph.selected_color;
    elem.innerHTML = symbols_graph.selected_value;
    elem.style.color = symbols_graph.selected_color;

    if (this.onionskin)
    {
      //we need to also set this in the correct graph
      //we are using a hard reference to aed.frame_number, maybe there is a better way?
      aed.frames[aed.current_frame].centers[gid].string = symbols_graph.selected_value;///I ALSO NEED TO STORE THE COLOR
      aed.frames[aed.current_frame].centers[gid].color = symbols_graph.selected_color;
    }
  }
  
}

aed.graph_canvas.prototype.merge_onionskin=function(g,depth){
  //console.log("merge graph_canvas");
  //specific merge function that modifies colors... because this isbasically for onion skinning
  //depth is if we are not the main frame.... 0 for main frame, -n for previous frames, +n for post frames
  //this also just assumes that all the graphs are the exact same size... no logic for otherwise
  this.onionskin = true;
  //get the color of onion skin
  var depth_gradient = Math.round(Math.pow((1.0-(Math.min((Math.abs(depth)/5.0),1.0))),3.8)*255);
  var color = rad.rgbToHex(depth_gradient,depth_gradient,depth_gradient);
  //console.log( Math.round((1.0-(Math.min((Math.abs(depth)/3.0),1.0)))*255) );
  for(var i=0;i<this.centers.length;i++){//loop the incoming graph, it should be smaller, but if not, we can handle that too
    
    if (depth<0)
    {
      if(g.centers[i].string!="&nbsp;"){
        this.centers[i].string = g.centers[i].string;
        this.centers[i].color = color;
      } 
    }
    if (depth>0)
    {
      if(this.centers[i].string=="&nbsp;" && g.centers[i].string!="&nbsp;"){
        this.centers[i].string = g.centers[i].string;
        this.centers[i].color = color;
      }
    }
    if (depth==0){
      if(g.centers[i].string!="&nbsp;"){
        this.centers[i].string = g.centers[i].string;
        this.centers[i].color = g.centers[i].color;
      }
      this.centers[i].trigger = g.centers[i].trigger;
    }
  }
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
}

aed.graph_canvas.prototype.set_symbols_graph=function(g){
  this.symbols_graph = g;
}*/
