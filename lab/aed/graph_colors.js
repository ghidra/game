aed.graph_colors=function(id,xdiv,ydiv){
  game.graph.call();
  this.id = id;

  this.symbols_graph={};//we need a canvas to draw into
  //this.selected_value={};
  this.init(xdiv,ydiv);

  return this;
}
aed.graph_colors.prototype=new game.graph();
aed.graph_colors.prototype.constructor=game.graph;

aed.graph_colors.prototype.render=function(){
 	gdiv = document.createElement("DIV");

 	//var off = 3/(256/(this.xdiv*this.ydiv));
 	var off =1;
 	i = 0; 
 	for (red = 0; red <= 5; red+= off) {
 		for (green = 0; green <= 5; green += off) { 
 			for (blue = 0; blue <= 5; blue+= off) { 
 				/*var c = this.convert_color(red,green,blue);
	            var cdiv = document.createElement("DIV");
	            cdiv.style.backgroundColor=c;
	            cdiv.style.float="left";
	            //cdiv.style.border = "dotted "+c;
    			//cdiv.style.borderWidth = "0px 1px 1px 0px";
    			cdiv.innerHTML="&nbsp;";//this.centers[i].string;
	            gdiv.appendChild(cdiv);
 				//table[i].r = red; 
 				//table[i].g = green; 
 				//table[i].b = blue; 
 				 
 				//if((i)%this.xdiv===0){
			    //  cdiv.style.clear="left";
			    //}*/
			    i++;
 			} 
 		} 
 	}
 	//alert(off);
 	alert(i);

 	/*var value = (xdiv*ydiv);

  	var v = 255/value;
	for( var rStep = 0, r = 0; rStep < v; rStep++) {    
	    for( var gStep = 0, g = 0; gStep < v; gStep++ ) {       
	        for( var bStep = 0, b = 0; bStep < v; bStep++ ) {                                                  
	            var c = this.convert_color(r,g,b);
	            var cdiv = document.createElement("DIV");
	            cdiv.style.backgroundColor=c;
	            cdiv.style.float="left";
	            //cdiv.style.border = "dotted "+c;
    			//cdiv.style.borderWidth = "0px 1px 1px 0px";
    			cdiv.innerHTML="2";//this.centers[r+g+b].string;
	            gdiv.appendChild(cdiv);
	            b += value;
	        }
	        g += value;
	    }
	    r += value;
	}*/
  //g.style.width = "900px";
  //var s = "";
  /*for (var i =0; i<this.centers.length; i++){

    ge = document.createElement("DIV");
    ge.style.float="left";
    ge.style.border = "dotted #222222";
    ge.style.borderWidth = "0px 1px 1px 0px";
    //ge.style.margin = "1px";
    ge.id = "graph_"+this.id+"_"+i;
    //ge.onmouseover = game.util.closure(this,this.mouseover,"graph_"+this.id+"_"+i);
    //ge.onmouseout = game.util.closure(this,this.mouseout,"graph_"+this.id+"_"+i);
    ge.onmousedown = game.util.closure(this,this.mousedown,"graph_"+this.id+"_"+i);
    ge.innerHTML=this.centers[i].string;

    if((i)%this.xdiv===0){
      ge.style.clear="left";
      //g.appendChild(document.createElement("BR"));//s+="<br>";
      //g.appendChild(document.createElement("BR"));
    }
    g.appendChild(ge);
  }*/
  //alert(g);
  return gdiv;
}

/*aed.graph_colors.prototype.mousedown=function(e,id){
  var elem = document.getElementById(id);
  elem.innerHTML = this.symbols_graph.selected_value;
}*/


aed.graph_colors.prototype.set_symbols_graph=function(g){
  this.symbols_graph = g;
}

aed.graph_colors.prototype.convert_color=function(r, g, b){
    var decColor =0x1000000+ b + 0x100 * g + 0x10000 *r ;
    return '#'+decColor.toString(16).substr(1);
}
