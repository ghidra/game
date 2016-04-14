aed.size = 16;

aed.panels={};

aed.palette_symbols={};
aed.palette_canvas={};
aed.palette_canvas_settings={};
aed.palette_colors={};
aed.palette_parameters={};
//aed.palette_colors_custom={};

aed.palette_large = new aed.graph_symbols("large",aed.size);
aed.colors = new aed.graph_colors("colorgraph",aed.size);
aed.colors_custom = new aed.graph_colors_custom("customcolorgraph",aed.size);
//aed.colors.init(16,16);

//this will give all the ascii values to the main pallete

//http://unicode-table.com/en/#control-character
aed.windowresized=function(){
  console.log("resized");
}

function init(){

  var canvassize = new rad.dropdown({
    "id":"graphsize",
    "label":"graph size",
    "options":{
      0:"4x4",
      1:"8x8",
      2:"16x16",
      3:"32x32"
    },
    "value": "3",
    "callback":function(arg){
      set_canvas_size(Math.pow(2,Number(document.getElementById("dd_"+arg.id+"_"+arg.label).value)+2));
      //console.log(Number(document.getElementById("dd_"+arg.id+"_"+arg.label).value)+1);
    }
  });

  var numframes = new rad.textbox({
    "id":"numberofframe",
    "label":"frames",
    "value": "1",
    "callback":function(arg){
      //set_canvas_size(Math.pow(2,Number(document.getElementById("dd_"+arg.id+"_"+arg.label).value)+2));
      console.log(document.getElementById("tb_"+arg.id+"_"+arg.label).value);
    }
  });
  //aed.palette_symbols = document.getElementById("symbols");
  //aed.palette_canvas= document.getElementById("draw");
  //aed.palette_colors = document.getElementById("colors");
  //aed.palette_colors_custom = document.getElementById("colors_custom");

  //aed.layout_workspace("test");
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
            'size':90,
            'partitions':{
              'canvas':{},
              'canvas_settings':{}
            }
          },
          'container_palettes':{
            'split':1,
            'size':50,
            'partitions':{
              'symbols':{},
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


  aed.palette_symbols  = aed.panels.get_panel("symbols");
  aed.palette_canvas  = aed.panels.get_panel("canvas");
  aed.palette_canvas_settings = aed.panels.get_panel("canvas_settings");
  aed.palette_colors  = aed.panels.get_panel("colors");
  aed.palette_parameters = aed.panels.get_panel("parameters");
  //aed.palette_colors_custom = aed.panels.get_panel("custom_colors");

  set_canvas_size();
  
  ///aed.palette_large.fetch_ascii(13054);
  aed.palette_large.fetch_ascii(13312);//1305
  aed.ascii_canvas.set_symbols_graph(aed.palette_large);
  aed.colors.set_symbols_graph(aed.palette_large);
  aed.colors_custom.set_symbols_graph(aed.palette_large);
  //aed.draw.innerHTML = aed.palette_large.render();
  //console.log(aed.palette_large.render());
  aed.palette_symbols.innerHTML = "";
  aed.palette_symbols.appendChild(aed.palette_large.render());
 
 // console.log(aed.palette_symbols);

  //aed.palette_canvas.innerHTML="";
  //aed.palette_canvas.appendChild(dd.getelement());
  //aed.palette_canvas.appendChild(aed.ascii_canvas.render());
  
  aed.palette_canvas_settings.innerHTML="";
  aed.palette_canvas_settings.appendChild(canvassize.getelement());
  aed.palette_canvas_settings.appendChild(numframes.getelement());
  //add in the num of frames element
  //add in the slider element to control number of frames

  //console.log(aed.palette_canvas);
  //console.log(aed.ascii_canvas.render());
  aed.palette_colors.innerHTML="";
  aed.palette_colors.appendChild(aed.colors.render());
  aed.palette_colors.appendChild(aed.colors_custom.render());

  aed.palette_parameters.innerHTML="";
  //add in the radio box for paint mode

  //temp="";
  /*for(var i=0; i<aed.ascii.length;i++){
    temp+="&#"+aed.ascii[i];
  }*/
  //for(var i=0; i<13054;i++){
  //  temp+="&#"+i;
  //  if(i%50===0)temp+="<br>";
  //}

  //render_layer.innerHTML = temp;
}

function set_canvas_size( s ){
  s = s||32;
  aed.ascii_canvas = new aed.graph_canvas("canvasgraph",aed.size,s,s);
  aed.ascii_canvas.set_symbols_graph(aed.palette_large);
  aed.palette_canvas.innerHTML="";
  aed.palette_canvas.appendChild(aed.ascii_canvas.render());
}

window.onload=function(){
    init();
}
//aed.ascii_graph=new game.graph();
