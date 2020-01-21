game.map_island=function(xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  return this;
}
game.map_island.prototype=new game.graph();
game.map_island.prototype.constructor=game.graph;

game.map_island.prototype.init=function(xdiv,ydiv){
  game.graph.prototype.init.call(this,xdiv,ydiv);
  //this.camera=new game.camera();//now we have a camera for this shit
  this.villages={};
  this.num_villages=16;

  this.caves={};
  this.num_caves=64;

  this.geo = this.construct_geo();
}

game.map_island.prototype.construct_geo=function(){
  //i wont be needing the camera here later,maybe
  //this.camera.cull(this);

  var noise = new game.perlin();

  //var s= "<br>---------------------------<br>---------------------------<br><div style=\"font-size:8px;letter-spacing:5px\">";
  //var rooms=0;

  var scale = 0.045;
  var islandwidth = 150;
  var islandheight = 10;

  for (var i =0; i<this.centers.length; i++){
    //get some math info for the center
    var pos = new game.vector2(this.centers[i].lookup[0],this.centers[i].lookup[1]);
    var centered = pos.subtract(this.offset);//
    var distance = centered.length();
    
    var edgenoise = noise.simplex2(this.centers[i].lookup[0],this.centers[i].lookup[1],scale,scale,30);
    var heightnoise = (noise.simplex2(this.centers[i].lookup[0],this.centers[i].lookup[1],scale,scale,-912.3,312.22)+1)*0.5;

    distance += edgenoise*4.2;

    //normalize distance for heightmap multiplication
    var flatten = (islandwidth-distance)/islandwidth;
    var height = heightnoise*flatten*islandheight;

    var rounded = Math.floor((height/islandheight)*10);
    var rgb = rad.hsvToRgb(0,0,rounded*0.1);
    var color = rad.rgbToHex(rgb[0],rgb[1],rgb[2]);
    //s+=n+" ";
    //if(this.centers[i].visible){
    //this.centers[i].string = (n>0?"x":"&nbsp;");
    this.centers[i].string = (distance<islandwidth)?"x":"&nbsp;";
    this.centers[i].color = color;
    //if(this.centers[i].visible){
      //s+=this.centers[i].string;
    //}
    //if((i+1)%this.xdiv===0)s+="<br>";
  }

  ///now lets make some villages
  console.log("MAKING:"+this.num_villages);
  for(var v =0; v<this.num_villages;v++)
  {
    //determine the sie (1x1 up to 4x4)
    var sizex = Math.ceil(Math.random()*4);
    var sizey = Math.ceil(Math.random()*4);
    
    //make a graph to represent the city
    var newcity = new game.graph();
    newcity.init(sizex,sizey);
    //just fill them for now, with the number of village this is
    for(var c=0;c<newcity.centers.length;c++)
    {
      newcity.centers[c].string = v;
      newcity.centers[c].color = "#FFFFFF";
    }
    //get a random point, and see if that will fit on the map

    var startx = Math.round(Math.random()*(this.xdiv-sizex));
    var starty = Math.round(Math.random()*(this.ydiv-sizey));

    console.log(v+"  :  "+sizex+","+sizey+" offset:"+startx+","+starty);
    //now merge them down
    this.merge(newcity,startx,starty);
  }

  ///make some caves:
  console.log("MAKING CAVES: "+this.num_caves);
  for(var c=0;c<this.num_caves;c++){

    var sizex = Math.ceil(Math.random()*8)+3;
    var sizey = Math.ceil(Math.random()*8)+3;

    this.caves[c] = new game.stage(sizex,sizey);//tmp.geo


    var startx = Math.round(Math.random()*this.xdiv);
    var starty = Math.round(Math.random()*this.ydiv);

    //i need to make a new center to copy to the center on the map
    var cid = startx+(starty*this.ydiv);
    this.centers[cid].string="O";
    this.centers[cid].color="#00ffff";
    this.centers[cid].callback_data={
        callback:'entrance',
        arguments:[c]
      };
  }

  //s+="</div><br><br>";
  //return s;
}
