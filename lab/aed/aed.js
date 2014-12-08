game={};
aed={};
//http://unicode-table.com/en/#control-character


window.onload=function(){
  render_layer = document.getElementById("render");
  temp="";
  /*for(var i=0; i<aed.ascii.length;i++){
    temp+="&#"+aed.ascii[i];
  }*/
  for(var i=0; i<13054;i++){
    temp+="&#"+i;
    if(i%50===0)temp+="<br>";
  }

  render_layer.innerHTML = temp;
}
//aed.ascii_graph=new game.graph();
