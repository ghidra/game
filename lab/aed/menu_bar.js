aed.menu_bar=function(id){
	this.id = id;
  //this._this=this;
  this.file = new rad.io("aed","backend/aed.php",rad.closure(this,this.database_connected_callback));
  aed.file = this.file;
  this.div==null;
  return this;
}

aed.menu_bar.prototype.render=function(div,login){
  if(this.div==null){
    this.div=div;
  }
  if(this.div!=null){
    bar = document.createElement("DIV");

    if(login!=null){
      bar_login = document.createElement("DIV");
      bar_login.innerHTML=login;
      bar.appendChild( bar_login );
    }

    bar.appendChild( aed.graph_controls.canvassize.getelement() );
    bar.appendChild( aed.graph_controls.numframes.getelement()) ;
    bar.appendChild( aed.graph_controls.frameslider.getelement() );
    //save and load
    bar.appendChild( aed.graph_controls.saveas_tb.getelement()) ;
    bar.appendChild( aed.graph_controls.saveas_bu.getelement() );
    bar.appendChild( aed.graph_controls.load_dd.getelement()) ;
    bar.appendChild( aed.graph_controls.load_bu.getelement() );
    bar.appendChild( aed.graph_controls.import_bu.getelement()) ;
    bar.appendChild( aed.graph_controls.export_bu.getelement() );
    
    this.div.innerHTML="";//empty it
    this.div.appendChild(bar);
  }


  //return bar;
}

aed.menu_bar.prototype.mousedown=function(e,id){

}

aed.menu_bar.prototype.database_connected_callback=function(data){
  parsed = JSON.parse(data);
  //we need to basically reload everything
  //console.log(console.dir(this._this));
  this.render(null,parsed.http);
  console.log("---DATABASE CONNECTED, AND WE DID A CALL BACK");
  //console.log(console.dir(parsed))
}
aed.menu_bar.prototype.process_login=function(form_name){
  this.file.process_login(form_name,"backend/aed.php",rad.closure(this,this.login_callback));
}
aed.menu_bar.prototype.login_callback=function(data){
  //console.log(data);
  parsed = JSON.parse(data);
  this.render(null,parsed.http);
  console.log("---LOGGED IN, AND WE DID A CALL BACK");
}
aed.menu_bar.prototype.logout=function(){
  this.file.logout("backend/aed.php",rad.closure(this,this.logout_callback));
}
aed.menu_bar.prototype.logout_callback=function(data){
  parsed = JSON.parse(data);
  this.render(null,parsed.http);
  console.log("---LOG OUT IN, AND WE DID A CALL BACK");
}

/*
THE GUI STUFF
*/
aed.file = new rad.io("aed");//default, gets set again when menu bar is created
//aed.file = new rad.io("aed","backend/aed.php",aed.menu_bar.database_connected_callback);//method to save and load

aed.graph_controls={};

aed.graph_controls.canvassize = new rad.dropdown({
  "id":"graphsize",
  "label":"graph size",
  "style":{
    "clear":"left",
    "float":"left",
    "height":"auto"
  },
  "style_label":{"width":0},
  "options":{
    0:"4x4",
    1:"8x8",
    2:"16x16",
    3:"32x32"
  },
  "value": "3",
  "callback":function(arg){
    //set_canvas_size(Math.pow(2,Number(document.getElementById("dd_"+arg.id+"_"+arg.label).value)+2));
    set_canvas_size(Math.pow(2,Number(arg.getvalue())+2));
    //console.log(Number(document.getElementById("dd_"+arg.id+"_"+arg.label).value)+1);
  }
});

aed.graph_controls.numframes = new rad.textbox({
  "id":"numberofframe",
  "label":"frames",
  "value": "1",
  "style":{
    "clear":"none",
    "float":"left",
    "width":40,
    "height":"auto"
  },
  "style_textbox":{
    "width":40
  },
  "style_label":{
    "width":0
  },
  "callback":function(arg){
    //set_canvas_size(Math.pow(2,Number(document.getElementById("dd_"+arg.id+"_"+arg.label).value)+2));
    add_frames(arg.getvalue());
  }
});
aed.graph_controls.frameslider = new rad.slider({
  "id":"frameslider",
  "label":"frame",
  "value": "1",
  "fontsize":10,
  "settings":{
    "clamped":true,
    "upper":2,
    "lower":1,
    "max_upper":2,
    "max_lower":1,
    "int":true,
    "update":true
  },
  "style":{
    "clear":"none",
    "float":"left",
    "height":"auto"
  },
  "style_label":{
    "width":0
  },
  "callback":function(arg){
    //set_canvas_size(Math.pow(2,Number(document.getElementById("dd_"+arg.id+"_"+arg.label).value)+2));
    //console.log(arg.getvalue());
    change_frame(arg.getvalue());
  }
});
///------save and load
aed.graph_controls.saveas_tb = new rad.textbox({
  "id":"saveas",
  "label":"",
  "value":"",
  "style":{"width":140,"clear":"none","float":"left"},
  "style_label":{"width":0},
  "style_textbox":{"width":140}
});
aed.graph_controls.saveas_bu = new rad.button({
  "id":"saveas_bu",
  "label":"save",
  "style":{"float":"left","clear":"none"},
  "callback":function(arg){
    //get the save file name
    var filename = document.getElementById("tb_saveas_").value;
    if(filename===""){
      alert("save: no file name given");
      return null;
    }
    console.log(aed.sanitize_for_save(aed.frames));
    aed.file.save(filename,aed.frames,aed.sanitize_for_save);
    //now I can refresh the load drop box
  }
});

aed.graph_controls.file_list = aed.file.list();
if(!aed.graph_controls.file_list){//no files found,make the arrays we need
  aed.graph_controls.file_list = ["no files found"];
}

aed.graph_controls.load_dd = new rad.dropdown({
  "id":"load",
  "label":"",
  "options":aed.graph_controls.file_list,
  "value":0,
  "style":{"width":140,"clear":"none","float":"left"},
  "style_label":{"width":0},
  "style_dropdown":{"width":140}
});
aed.graph_controls.load_bu = new rad.button({
  "id":"bu_load",
  "label":"load",
  "style":{"float":"left","clear":"none"},
  "callback":function(arg){
    var fileid = document.getElementById("dd_load_").value;
    var filename = aed.graph_controls.file_list[aed.graph_controls.file_list.indexOf(fileid)];
    var loadedfile = aed.file.load(filename);
    if (loadedfile != 'none'){
      aed.load_file(loadedfile);//load the file
    }else{
      alert(filename+' file not found');
    }
  }
});

aed.graph_controls.export_bu = new rad.button({
  "id":"bu_export",
  "label":"export",
  "style":{"float":"left","clear":"none"},
  "callback":function(arg){
    aed.export_graph();//get the graph as string, and put it in the floating window
  }
});

aed.graph_controls.import_bu = new rad.button({
  "id":"bu_import",
  "label":"import",
  "style":{"float":"left","clear":"none"},
  "callback":function(arg){
    aed.import_graph();
  }
});
