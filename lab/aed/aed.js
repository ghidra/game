aed.size = 16;//pixel size of graph boxes
aed.graph_size;//the size of the graph

//aed.panels={};

aed.paintmodes=['character','color','trigger'];
aed.paintmode=aed.paintmodes[0];
aed.current_frame = -1;
aed.frames=[];//we can hold multiple frames of palette canvases

aed.palette_symbols={};
aed.palette_canvas={};
aed.palette_canvas_settings={};
aed.palette_colors={};
aed.palette_parameters={};
aed.console={};
//aed.palette_colors_custom={};

aed.set_active_palette = function(palette){
  aed.active_palette=palette;
}//single line functions dont work with my parser
aed.get_active_palette = function(){
  return aed.active_palette
}

aed._menu_bar = new aed.menu_bar("menubar");
//aed.palette_custom = new aed.graph_symbols_custom("symbolscustom",aed.set_active_palette,aed.size);
aed.palette_large = new aed.graph_symbols("large",aed.set_active_palette,aed.size);
aed.colors = new aed.graph_colors("colorgraph",aed.size);
aed.colors_custom = new aed.graph_colors_custom("customcolorgraph",aed.size);

aed.active_palette = aed.palette_large;//aed.palette_custom;//THIS IS HACKING TRYING TO GET THIS TO GO

_keys={};//for holding keypresses

//aed.file = new rad.io("aed");//method to save and load

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
    
    aed.frames[g] = new aed.graph_canvas("canvasgraph",aed.get_active_palette,aed.size,file[g].xdiv,file[g].xdiv);
    //aed.frames[g].set_symbols_graph(aed.active_palette);//aed.palette_large);
    
    //convert the simple array style to the expected object style
    var convert={};
    convert.centers=[];
    //console.dir(file[0]);
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
//set the paint mode
aed.set_paintmode=function(mode){
  ///[]
  aed.paintmode=mode;
  switch(mode){
    case aed.paintmodes[0]:
      console.log("character yay");
      break;
    case aed.paintmodes[1]:
      console.log("color yay");
      break;
    case aed.paintmodes[2]:
      console.log("trigger yay");
      break;
  }
  draw_frame_to_clean_palette_canvas(0);
  //aed.palette_canvas.appendChild(oniongraph.render( (aed.paintmode=='trigger') ));
  //console.log(mode+"------");
}

///-----------------------
///-----------------------

function init(){
  aed.dom_menu_bar  = document.getElementById("menu_bar");
  aed.palette_symbols  = document.getElementById("ascii_symbols");
  aed.palette_canvas  = document.getElementById("ascii_content");
  //aed.palette_canvas_settings = aed.panels.get_panel("canvas_settings");
  aed.palette_colors  = document.getElementById("palettes");
  //aed.palette_parameters = aed.panels.get_panel("parameters");
  //aed.palette_colors_custom = aed.panels.get_panel("custom_colors");
  //aed.console = aed.panels.get_panel("console");
  
  aed.palette_large.fetch_ascii(-1);//1305
  //aed.palette_custom.fetch_ascii();//the main one is automatic
  aed.colors.set_symbols_graph(aed.palette_large);
  aed.colors_custom.set_symbols_graph(aed.palette_large);
  
  //menu bar
  //var menu = document.createElement("DIV");
  //menu.innerHTML="menu";
  //aed.dom_menu_bar.appendChild( aed._menu_bar.render() );
  aed._menu_bar.render(aed.dom_menu_bar);

  //canvas
  set_canvas_size();
  //s = 32;
  //aed.frames[0] = new aed.graph_canvas("canvasgraph",aed.get_active_palette,aed.size,s,s);

  //aed.palette_canvas.innerHTML="";
  //aed.palette_canvas.appendChild(aed.frames[0].render());

  aed.palette_symbols.innerHTML = "";
  //aed.palette_symbols.appendChild(aed.palette_custom.render());
  aed.palette_symbols.appendChild(aed.palette_large.render());

  
  aed.palette_colors.innerHTML="";
  aed.palette_colors.appendChild(aed.colors.render());
  aed.palette_colors.appendChild(aed.colors_custom.render());

  ///set the keybindings
  //document.addEventListener('keyup', function(e){_key[e.keyCode] = false;} );
  //document.addEventListener('keydown', function(e){_key[e.keyCode] = true;} );
}
function set_canvas_size( s , from_load){
  from_load = from_load || 0;
  if(s==undefined){
    s = 32;
    aed.frames[0] = new aed.graph_canvas("canvasgraph",aed.get_active_palette,aed.size,s,s);
    //aed.frames[0].set_symbols_graph(aed.active_palette);//aed.palette_large);
  }
  if(s!=aed.graphsize && from_load<1){
    //this only makes a single one... we need to look at the number of frames too
    for(var nf=0; nf<aed.frames.length; nf++){
      aed.frames[nf] = new aed.graph_canvas("canvasgraph",aed.get_active_palette,aed.size,s,s);
      //aed.frames[nf].set_symbols_graph(aed.active_palette);//aed.palette_large);
    }
    //set the frame slider back to frame 0
    aed._menu_bar.graph_controls.frameslider.set_to_minimum();//set the value back to zero
    //aed.graph_controls.frameslider.refresh();
  }
  aed.graph_size=s;
  //get the number of frames
  //var frames = 1;//aed.graph_controls.numframes.getvalue();
  //for(var i=0; i<frames;i++){
  //  aed.frames[i] = new aed.graph_canvas("canvasgraph",aed.size,s,s);
  //  aed.frames[i].set_symbols_graph(aed.palette_large);
  //}
  
  //aed.palette_canvas.innerHTML="";
  //aed.palette_canvas.appendChild(aed.frames[0].render());//draw the specific frame
  //aed.current_frame=0;
  
  draw_frame_to_clean_palette_canvas(0);

  ///controls
  /*aed.palette_canvas.appendChild( aed.graph_controls.canvassize.getelement() );
  aed.palette_canvas.appendChild( aed.graph_controls.numframes.getelement()) ;
  aed.palette_canvas.appendChild( aed.graph_controls.frameslider.getelement() );
  //save and load
  aed.palette_canvas.appendChild( aed.graph_controls.saveas_tb.getelement()) ;
  aed.palette_canvas.appendChild( aed.graph_controls.saveas_bu.getelement() );
  aed.palette_canvas.appendChild( aed.graph_controls.load_dd.getelement()) ;
  aed.palette_canvas.appendChild( aed.graph_controls.load_bu.getelement() );
  aed.palette_canvas.appendChild( aed.graph_controls.import_bu.getelement()) ;
  aed.palette_canvas.appendChild( aed.graph_controls.export_bu.getelement() );
  */

  ///////////NEEED TO REFRESH THE MENU BAR

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
  aed._menu_bar.graph_controls.canvassize.getguielement().options[option].selected=true;
  aed._menu_bar.graph_controls.numframes.getguielement().value = aed.frames.length;
  //now I need to update the slider to it can go all the way to the right number of frames
  aed._menu_bar.graph_controls.frameslider.set_settings({"upper":aed.frames.length,"max_upper":aed.frames.length});
  aed._menu_bar.graph_controls.frameslider.refresh();
}
function add_frames(n){
  console.log("-- called: aed.js add_frames("+n+")")
  var nf = n-aed.frames.length;
  var offset=aed.frames.length;
  if(nf<0){
    console.log("remove frames - we have no logic to removes frames yet")
    //we need to remove frames
  }else{
    console.log("increase frames array")
    for(var i=0; i<nf;i++){
      aed.frames[i+offset] = new aed.graph_canvas("canvasgraph",aed.get_active_palette,aed.size,aed.graph_size,aed.graph_size);
      //aed.frames[i+offset].set_symbols_graph(aed.active_palette);//aed.palette_large);
    }
  }
  console.log("----frames array is now "+aed.frames.length+" frames long")
  //set the slider to have the right bounds
  aed._menu_bar.graph_controls.frameslider.set_settings({"upper":n,"upper_max":n});
  aed._menu_bar.graph_controls.frameslider.refresh();
}
function change_frame(f){
  //this is called from the slider...
  console.log("-- called aed.js change_frame("+f+")");  
  draw_frame_to_clean_palette_canvas(f-1);
}
function draw_frame_to_clean_palette_canvas(f){
  current_frame = Math.min(f,aed.frames.length-1);
  aed.palette_canvas.innerHTML="";//got to clear it out first
  var oniongraph = onion_skin_frames(current_frame);
  //console.log(aed.paintmode=='trigger');
  aed.palette_canvas.appendChild(oniongraph.render( aed.paintmode=='trigger' ));
  //aed.palette_canvas.appendChild(aed.frames[current_frame].render());
  aed.current_frame=current_frame;
}
function onion_skin_frames(f){
  ///this function will merge the frames together to see the other frames like a transparency
  ///make a new graph
  var oniongraph = new aed.graph_canvas("onionskincanvasgraph",aed.get_active_palette,aed.size,aed.graph_size,aed.graph_size);
  for (var i =0; i<aed.frames.length;i++){
    oniongraph.merge_onionskin(aed.frames[i],i-f);
  }
  return oniongraph;
}

///////LOGING STUFF
function process_login(form_name){
  aed._menu_bar.process_login(form_name);
}
function logout(){
  aed._menu_bar.logout();
}

window.onload=function(){
    init();
}
