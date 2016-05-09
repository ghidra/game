aed.size = 16;//pixel size of graph boxes
aed.graph_size;//the size of the graph

aed.panels={};

aed.frames=[];//we can hold multiple frames of palette canvases

aed.palette_symbols={};
aed.palette_canvas={};
aed.palette_canvas_settings={};
aed.palette_colors={};
aed.palette_parameters={};
aed.console={};
//aed.palette_colors_custom={};

aed.palette_large = new aed.graph_symbols("large",aed.size);
aed.colors = new aed.graph_colors("colorgraph",aed.size);
aed.colors_custom = new aed.graph_colors_custom("customcolorgraph",aed.size);

aed.file = new rad.io("aed");//method to save and load

//aed.colors.init(16,16);

//this will give all the ascii values to the main pallete

//http://unicode-table.com/en/#control-character
aed.windowresized=function(){
  console.log("resized");
}
aed.sanitize_for_save=function(src){
  //we should be getting an array of frames
  var clean=[];
  for(var i=0; i<src.length; i++){
    clean[i]={};
    clean[i].xdiv=src[i].xdiv;
    clean[i].ydiv=src[i].ydiv;
    clean[i].centers=[];
    //console.log(src[i].centers[0].string)
    for(var c=0; c<src[i].centers.length; c++){
      clean[i].centers[c]=[];
      clean[i].centers[c][0] = src[i].centers[c].string;
      clean[i].centers[c][1] = src[i].centers[c].color;
    }
  }

  //console.dir(clean);
  return clean;
}
aed.load_file=function(file){
  //console.dir(file);
  //set the canvas controls (number of frames, and the slider)

  //then set the graph frames
  //make one for each in the array
  //console.log(file.length);
  rad.flusharray(aed.frames);
  for(var g=0; g<file.length; g++){
    
    aed.frames[g] = new aed.graph_canvas("canvasgraph",aed.size,file[g].xdiv,file[g].xdiv);
    aed.frames[g].set_symbols_graph(aed.palette_large);
    
    //convert the simple array style to the expected object style
    var convert={};
    convert.centers=[];
    for(var i=0; i<file[g].centers.length;i++){
      convert.centers[i]={};
      convert.centers[i].string=file[g].centers[i][0];
      convert.centers[i].color=file[g].centers[i][1];
    }
    aed.frames[g].merge( convert );
    //aed.frames[g].merge( file[g] );
    //aed.palette_canvas.innerHTML="";
  }
  //aed.palette_canvas.appendChild(aed.frames[0].render());
  set_canvas_size(file[0].xdiv,1);
}
aed.make_io_window=function(){
  //make the window to import and export from
}
aed.export_graph=function(){
  //aed.make_io_window();
  //console.log("lets export this shit");
  var src = aed.sanitize_for_save(aed.frames);
  //console.log(JSON.stringify(src));
  var dia = new rad.dialogue( {
      "id":"export_window",
      "label":"export",
      "style":{"width":480,"height":600,"backgroundColor":"grey"}
    } , JSON.stringify(src) );
  var r = document.getElementById("layout");//at the root
  r.appendChild(dia.getelement());
}
aed.import_graph=function(){
  console.log("lets make a window to import from");
}

function init(){

  var layout = {
    'split':0,
    'size':90,
    'style':{'letterSpacing':2},
    'partitions':{
      'container_main':{
        'split':1,
        'size':50,
        'partitions':{
          'canvas':{
          //'container_canvas':{
           /* 'split':0,
            'size':70,
            'partitions':{
              'canvas':{},
              'canvas_settings':{}
            }*/
          },
          'container_palettes':{
            'split':1,
            'size':50,
            'partitions':{
              'symbols':{
                'style':{'fontSize':16}
              },
              'container_colors':{
                'split':0,
                'size':75,
                'partitions':{
                  'colors':{},
                  'parameters':{}
                }
              }
            }
          }
        }
      },
      'console':{
        'style':{'fontSize':8}
      }
    }
  };
  aed.panels = new rad.panels("layout",layout,rad.closure(aed,aed.windowresized));//,rad.closure(this,this.windowresized)

  //get all the panels to store for later
  aed.palette_symbols  = aed.panels.get_panel("symbols");
  aed.palette_canvas  = aed.panels.get_panel("canvas");
  //aed.palette_canvas_settings = aed.panels.get_panel("canvas_settings");
  aed.palette_colors  = aed.panels.get_panel("colors");
  aed.palette_parameters = aed.panels.get_panel("parameters");
  //aed.palette_colors_custom = aed.panels.get_panel("custom_colors");
  aed.console = aed.panels.get_panel("console");
  
  //set the palettes and colors up
  aed.palette_large.fetch_ascii(13312);//1305
  aed.colors.set_symbols_graph(aed.palette_large);
  aed.colors_custom.set_symbols_graph(aed.palette_large);
  
  aed.palette_symbols.innerHTML = "";
  aed.palette_symbols.appendChild(aed.palette_large.render());
  
  aed.palette_colors.innerHTML="";
  aed.palette_colors.appendChild(aed.colors.render());
  aed.palette_colors.appendChild(aed.colors_custom.render());

  aed.palette_parameters.innerHTML="";//add in the radio box for paint mode

  //now add in the canvas
  set_canvas_size();
   //canvas settings
  //aed.palette_canvas.innerHTML="";
  //just put something in the console, so that I know its there
  aed.console.innerHTML="initalized";
}

function set_canvas_size( s , from_load){
  from_load = from_load || 0;
  if(s==undefined){
    s = 32;
    aed.frames[0] = new aed.graph_canvas("canvasgraph",aed.size,s,s);
    aed.frames[0].set_symbols_graph(aed.palette_large);
  }
  if(s!=aed.graphsize && from_load<1){
    //this only makes a single one... we need to look at the number of frames too
    for(var nf=0; nf<aed.frames.length; nf++){
      aed.frames[nf] = new aed.graph_canvas("canvasgraph",aed.size,s,s);
      aed.frames[nf].set_symbols_graph(aed.palette_large);
    }
    //set the frame slider back to frame 0
    aed.graph_controls.frameslider.set_to_minimum();//set the value back to zero
    //aed.graph_controls.frameslider.refresh();
  }
  aed.graph_size=s;
  //get the number of frames
  //var frames = 1;//aed.graph_controls.numframes.getvalue();
  //for(var i=0; i<frames;i++){
  //  aed.frames[i] = new aed.graph_canvas("canvasgraph",aed.size,s,s);
  //  aed.frames[i].set_symbols_graph(aed.palette_large);
  //}
  aed.palette_canvas.innerHTML="";
  aed.palette_canvas.appendChild(aed.frames[0].render());
  ///controls
  aed.palette_canvas.appendChild( aed.graph_controls.canvassize.getelement() );
  aed.palette_canvas.appendChild( aed.graph_controls.numframes.getelement()) ;
  aed.palette_canvas.appendChild( aed.graph_controls.frameslider.getelement() );
  //save and load
  aed.palette_canvas.appendChild( aed.graph_controls.saveas_tb.getelement()) ;
  aed.palette_canvas.appendChild( aed.graph_controls.saveas_bu.getelement() );
  aed.palette_canvas.appendChild( aed.graph_controls.load_dd.getelement()) ;
  aed.palette_canvas.appendChild( aed.graph_controls.load_bu.getelement() );
  aed.palette_canvas.appendChild( aed.graph_controls.import_bu.getelement()) ;
  aed.palette_canvas.appendChild( aed.graph_controls.export_bu.getelement() );

  //set the values in optoins
  var option = 0;
  switch(s){
    case 8:
      option = 1;
      break;
    case 16:
      option = 2;
      break;
    case 32:
      option = 3;
      break;
  }
  //console.log(aed.graph_controls.canvassize.getguielement());
  aed.graph_controls.canvassize.getguielement().options[option].selected=true;
  aed.graph_controls.numframes.getguielement().value = aed.frames.length;
  //now I need to update the slider to it can go all the way to the right number of frames
  aed.graph_controls.frameslider.set_settings({"upper":aed.frames.length,"max_upper":aed.frames.length});
  aed.graph_controls.frameslider.refresh();
}
function add_frames(n){
  var nf = n-aed.frames.length;
  var offset=aed.frames.length;
  if(nf<0){
    console.log("remove frames")
    //we need to remove frames
  }else{
    for(var i=0; i<nf;i++){
      aed.frames[i+offset] = new aed.graph_canvas("canvasgraph",aed.size,aed.graph_size,aed.graph_size);
      aed.frames[i+offset].set_symbols_graph(aed.palette_large);
    }
  }
  //set the slider to have the right bounds
  aed.graph_controls.frameslider.set_settings({"upper":n,"upper_max":n});
  aed.graph_controls.frameslider.refresh();
}
function change_frame(f){
  //HERE WE NEED TO DO SOME PREPENDING TO THE CANVAS LAYER
  //insertBefore(child, parent.firstchild)
  //console.log(aed.frames);
  var parent=document.getElementById("partition_canvas");
  var firstchild=document.getElementById("graphsize");
  parent.removeChild(parent.firstChild);
  parent.insertBefore( aed.frames[ rad.clamp(Math.round(f)-1,0,aed.frames.length-1) ].render(),firstchild);
  //aed.palette_canvas.innerHTML="";
  //aed.palette_canvas.appendChild(aed.frames[rad.clamp(Math.round(f)-1,0,aed.frames.length-1)].render());
}


//GUI CRAP
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
  "label":"save as",
  "value":"",
  "style":{"width":280,"clear":"left","float":"left"},
  "style_label":{"width":140},
  "style_textbox":{"width":140}
});
aed.graph_controls.saveas_bu = new rad.button({
  "id":"saveas_bu",
  "label":"save",
  "style":{"width":40,"float":"left","clear":"none"},
  "callback":function(arg){
    //get the save file name
    var filename = document.getElementById("tb_saveas_save as").value;
    if(filename===""){
      alert("save: no file name given");
      return null;
    }
    //aed.sanitize_for_save(aed.frames);
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
  "label":"load",
  "options":aed.graph_controls.file_list,
  "value":0,
  "style":{"width":280,"clear":"left","float":"left"},
  "style_label":{"width":140},
  "style_dropdown":{"width":140}
});
aed.graph_controls.load_bu = new rad.button({
  "id":"bu_load",
  "label":"load",
  "style":{"width":40,"float":"left","clear":"none"},
  "callback":function(arg){
    var fileid = document.getElementById("dd_load_load").value;
    var filename = aed.graph_controls.file_list[fileid];
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
  "callback":function(arg){
    aed.export_graph();//get the graph as string, and put it in the floating window
  }
});

aed.graph_controls.import_bu = new rad.button({
  "id":"bu_import",
  "label":"import",
  "callback":function(arg){
    aed.import_graph();
  }
});
//----
//----
window.onload=function(){
    init();
}
//aed.ascii_graph=new game.graph();
