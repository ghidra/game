aed.size = 16;

aed.panels={};

aed.palette_symbols={};
aed.palette_canvas={};
aed.palette_colors={};
aed.palette_colors_custom={};

aed.ascii_canvas = new aed.graph_canvas("canvasgraph",aed.size,32,32);
aed.palette_large = new aed.graph_symbols("large",aed.size);
aed.colors = new aed.graph_colors("colorgraph",aed.size);
aed.colors_custom = new aed.graph_colors_custom("customcolorgraph",aed.size);
//aed.colors.init(16,16);

//this will give all the ascii values to the main pallete

//http://unicode-table.com/en/#control-character
aed.layout_workspace=function(id){
  var layout = {
    'split':0,
    'size':80,
    'partitions':{
      'container_main':{
        'split':1,
        'size':20,
        'partitions':{
          'parameters':{},
          'container_workspace':{
            'split':1,
            'partitions':{
              'canvas':{},
              'output_preview':{}
            }
          }
        }
      },
      'console':{}
    }
  };
  this.aed = new rad.panels(id,layout,rad.closure(this,this.windowresized));//,rad.closure(this,this.windowresized)
}
aed.windowresized=function(){
  console.log("resized");
}

function init(){
  var dd = new rad.dropdown({
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
      console.log(document.getElementById(arg.id).value);
    }
  });
  aed.palette_symbols = document.getElementById("symbols");
  aed.palette_canvas= document.getElementById("draw");
  aed.palette_colors = document.getElementById("colors");
  aed.palette_colors_custom = document.getElementById("colors_custom");
  
  ///aed.palette_large.fetch_ascii(13054);
  aed.palette_large.fetch_ascii(1305);
  aed.ascii_canvas.set_symbols_graph(aed.palette_large);
  aed.colors.set_symbols_graph(aed.palette_large);
  aed.colors_custom.set_symbols_graph(aed.palette_large);
  //aed.draw.innerHTML = aed.palette_large.render();
  //console.log(aed.palette_large.render());
  aed.palette_symbols.innerHTML = "";
  aed.palette_symbols.appendChild(aed.palette_large.render());
 
 // console.log(aed.palette_symbols);

  aed.palette_canvas.innerHTML="";
  aed.palette_canvas.appendChild(dd.getelement());
  aed.palette_canvas.appendChild(aed.ascii_canvas.render());
  //console.log(aed.palette_canvas);
  //console.log(aed.ascii_canvas.render());
  aed.palette_colors.innerHTML="";
  aed.palette_colors.appendChild(aed.colors.render());

  aed.palette_colors_custom.innerHTML="";
  aed.palette_colors_custom.appendChild(aed.colors_custom.render());
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

window.onload=function(){
    init();
}
//aed.ascii_graph=new game.graph();
