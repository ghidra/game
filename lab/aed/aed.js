aed.draw={};
aed.ascii_canvas = new game.graph("console",128,128);
aed.palette_large = new aed.graph("large");

//this will give all the ascii values to the main pallete

//http://unicode-table.com/en/#control-character


window.onload=function(){
  aed.draw = document.getElementById("render");
  aed.palette_large.fetch_ascii(13054);
  //aed.draw.innerHTML = aed.palette_large.render();
  aed.draw.innerHTML = "";
  aed.draw.appendChild(aed.palette_large.render());
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
