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
//aed.colors.init(16,16);

//this will give all the ascii values to the main pallete

//http://unicode-table.com/en/#control-character
aed.windowresized=function(){
  console.log("resized");
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
  if(nf<0){
    console.log("remove frames")
    //we need to remove frames
  }else{
    for(var i=0; i<nf;i++){
      aed.frames[i] = new aed.graph_canvas("canvasgraph",aed.size,aed.graph_size,aed.graph_size);
      aed.frames[i].set_symbols_graph(aed.palette_large);
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
