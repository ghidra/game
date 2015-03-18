aed.palette_symbols={};
aed.palette_canvas={};
aed.palette_colors={};

aed.ascii_canvas = new aed.graph_canvas("canvasgraph",32,32);
aed.palette_large = new aed.graph_symbols("large");
aed.colors = new aed.graph_colors("colorgraph",16,16);
//aed.colors.init(16,16);

//this will give all the ascii values to the main pallete

//http://unicode-table.com/en/#control-character


window.onload=function(){
  aed.palette_symbols = document.getElementById("symbols");
  aed.palette_canvas= document.getElementById("draw");
  aed.palette_colors = document.getElementById("colors");

  ///aed.palette_large.fetch_ascii(13054);
  aed.palette_large.fetch_ascii(1305);
  aed.ascii_canvas.set_symbols_graph(aed.palette_large);
  //aed.draw.innerHTML = aed.palette_large.render();
  aed.palette_symbols.innerHTML = "";
  aed.palette_symbols.appendChild(aed.palette_large.render());

  aed.palette_canvas.innerHTML="";
  aed.palette_canvas.appendChild(aed.ascii_canvas.render());

  aed.palette_colors.innerHTML="";
  aed.palette_colors.appendChild(aed.colors.render());
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
//aed.ascii_graph=new game.graph();
