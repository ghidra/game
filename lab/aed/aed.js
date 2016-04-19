aed.size = 16;//pixel size of graph boxes
aed.graph_size;//the size of the graph

aed.panels={};

aed.frames=[];//we can hold multiple frames of palette canvases

aed.palette_symbols={};
aed.palette_canvas={};
aed.palette_canvas_settings={};
aed.palette_colors={};
aed.palette_parameters={};
//aed.palette_colors_custom={};

aed.palette_large = new aed.graph_symbols("large",aed.size);
aed.colors = new aed.graph_colors("colorgraph",aed.size);
aed.colors_custom = new aed.graph_colors_custom("customcolorgraph",aed.size);

aed.graph_controls={};//hold the graph control elements

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
      clean[i].centers[c]={};
      clean[i].centers[c].string = src[i].centers[c].string;
      clean[i].centers[c].color = src[i].centers[c].color;
    }
  }

  console.dir(clean);
  return clean;
}
aed.load_file=function(file){
  //console.dir(file);
  //set the canvas controls (number of frames, and the slider)

  //then set the graph frames
  //make one for each in the array
  for(var g=0; g<file.length; g++){
    rad.flusharray(aed.frames);
    aed.frames[g] = new aed.graph_canvas("canvasgraph",aed.size,file[g].xdiv,file[g].xdiv);
    aed.frames[g].set_symbols_graph(aed.palette_large);
    aed.frames[g].merge( file[g] );
    aed.palette_canvas.innerHTML="";
  }
  aed.palette_canvas.appendChild(aed.frames[0].render());
}

function init(){

  aed.graph_controls.canvassize = new rad.dropdown({
    "id":"graphsize",
    "label":"graph size",
    "style":{
      "clear":"none",
      "float":"left"
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
      "width":40
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
      "float":"left"
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
  var saveas_tb = new rad.textbox({
    "id":"saveas",
    "label":"save as",
    "value":""
  });
  var saveas_bu = new rad.button({
    "id":"bu_saveass",
    "label":"save",
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
  
  var file_list = aed.file.list();
  if(!file_list){//no files found,make the arrays we need
    file_list = ["no files found"];
  }

  var load_dd = new rad.dropdown({
    "id":"load",
    "label":"load",
    "options":file_list,
    "value":0
  });
  var load_bu = new rad.button({
    "id":"bu_load",
    "label":"load",
    "callback":function(arg){
      var fileid = document.getElementById("dd_load_load").value;
      var filename = file_list[fileid];
      var loadedfile = aed.file.load(filename);
      if (loadedfile != 'none'){
        aed.load_file(loadedfile);//load the file
      }else{
        alert(filename+' file not found');
      }
    }
  });

  var layout = {
    'split':0,
    'size':90,
    'partitions':{
      'container_main':{
        'split':1,
        'size':50,
        'partitions':{
          'container_canvas':{
            'split':0,
            'size':70,
            'partitions':{
              'canvas':{},
              'canvas_settings':{}
            }
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
      'console':{}
    }
  };
  aed.panels = new rad.panels("layout",layout,rad.closure(aed,aed.windowresized));//,rad.closure(this,this.windowresized)

  //get all the panels to store for later
  aed.palette_symbols  = aed.panels.get_panel("symbols");
  aed.palette_canvas  = aed.panels.get_panel("canvas");
  aed.palette_canvas_settings = aed.panels.get_panel("canvas_settings");
  aed.palette_colors  = aed.panels.get_panel("colors");
  aed.palette_parameters = aed.panels.get_panel("parameters");
  //aed.palette_colors_custom = aed.panels.get_panel("custom_colors");
  
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

  //canvas settings
  aed.palette_canvas_settings.innerHTML="";
  aed.palette_canvas_settings.appendChild( aed.graph_controls.canvassize.getelement() );
  aed.palette_canvas_settings.appendChild( aed.graph_controls.numframes.getelement()) ;
  aed.palette_canvas_settings.appendChild( aed.graph_controls.frameslider.getelement() );
  //save and load
  aed.palette_canvas_settings.appendChild( saveas_tb.getelement()) ;
  aed.palette_canvas_settings.appendChild( saveas_bu.getelement() );
  aed.palette_canvas_settings.appendChild( load_dd.getelement()) ;
  aed.palette_canvas_settings.appendChild( load_bu.getelement() );

  //now add in the canvas
  set_canvas_size();
}

function set_canvas_size( s ){
  s = s||32;
  aed.graph_size=s;
  //get the number of frames
  var frames = aed.graph_controls.numframes.getvalue();
  for(var i=0; i<frames;i++){
    aed.frames[i] = new aed.graph_canvas("canvasgraph",aed.size,s,s);
    aed.frames[i].set_symbols_graph(aed.palette_large);
    aed.palette_canvas.innerHTML="";
    aed.palette_canvas.appendChild(aed.frames[i].render());
  }
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
  //console.log(aed.frames);
  aed.palette_canvas.innerHTML="";
  aed.palette_canvas.appendChild(aed.frames[rad.clamp(Math.round(f)-1,0,aed.frames.length-1)].render());
}

window.onload=function(){
    init();
}
//aed.ascii_graph=new game.graph();
