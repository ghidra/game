//this class expect the game.vector2 class
game.stage=function(xdiv,ydiv){
  game.graph.call();
  this.init(xdiv,ydiv);
  return this;
}
game.stage.prototype=new game.graph();
game.stage.prototype.constructor=game.graph;

game.stage.prototype.init=function(xdiv,ydiv){
  game.graph.prototype.init.call(this,xdiv,ydiv);

  this.start_position=-1;
  this.end_position=-1;
  while(this.start_position === this.end_position){
    this.terminal_positions();
  }

  this.travelled=[];//hold the path finding, where we have travelled
  this.backtracked=[];
  this.find_random_path(this.start_position,this.end_position);

  this.debug=0;
  this.debug_b=0;

  return this;

}
//---------------
game.stage.prototype.construct_geo=function(){
  //game.graph.prototype.construct_geo.call(this);
  s = "";

  for (var i =0; i<this.centers.length; i++){
    var char = '';
    if(i===this.start_position || i===this.end_position){
      char = (i===this.start_position)?'i':'o';
      s+="<a id=graphsquare"+i+">"+char+"</div>";
    }else{
      //if(this.centers[i].is_room===true){//some are still considers rooms?
        switch(this.centers[i].connection_direction){
          case 0:
            char = '&rightarrow;';
            break;
          case 2:
            char = '&downarrow;';
            break;
          case 4:
            char = '&leftarrow;';
            break;
          case 6:
            char = '&uparrow;';
            break;
          default:
            char = 'x';
            break;
        }
        //s+="<a id=graphsquare"+i+">"+char+"</div>";
        //char = (this.centers[i].connection_step>=0)?this.centers[i].connection_step:'&nbsp;'
        s+="<a id=graphsquare"+i+">"+char+"</div>";
      //}
      /*else{
        if(this.centers[i].is_border){
          s+="<a id=graphsquare"+i+">&square;</div>";
        }else{
          s+="<a id=graphsquare"+i+">&nbsp;</div>";
        }
      }*/
    }
    if((i+1)%this.xdiv===0)s+="<br>";
  }
  return s;
}

//----------------
game.stage.prototype.find_random_path=function(start,end){
  this.next_position(start,end,this.random());
}
game.stage.prototype.clear_backtrack=function(){
  this.debug_b+=1;
  while(this.backtracked.length > 0) {
    var i = this.backtracked[this.backtracked.length-1];
    this.centers[i].is_room=false;
    this.centers[i].visited=false;
    this.centers[i].connection_direction = -1;
    this.centers[i].connection_step = -1;
    this.backtracked.pop();
  }
}
game.stage.prototype.backtrack=function(end,seed){//send the backtrack position
  this.debug+=1;
  if(this.travelled.length<=1){
    this.clear_backtrack();
    this.next_position(this.travelled[this.travelled.length-1],end,seed)
  }else{
    var back = this.travelled.pop()
    this.backtracked.push(back);//add this point to the back tracked array
    this.centers[back].is_room=false;
    this.centers[back].visited=false;
    this.centers[back].connection_direction=-1;
    this.centers[back].connection_step = -1;
    this.next_position(back,end,seed);//recursion
  }
}
game.stage.prototype.next_position=function(position,end,seed,search){
  //i should ust build it in, that if we get an undefind value, to just start over.
  //or if we iterate x number of times, like 500, then just start over.
  //basically, just return false, and if false, go again
  seed = seed||0;
  search = search||[0,2,4,6];
  seed+=1;
  //console.log("search length:"+search.length);
  var direction_index = Math.floor(this.random(seed)*search.length);//get a random direction
  var this_point = this.centers[position];
  var direction = search[direction_index];
  console.log("direction:"+direction+",direction index:"+direction_index+",id:"+position+",npos"+search.length)
  var next = this_point.neighbor_ids[direction];//get the id of that neighboring point
  search.splice(search.indexOf(search[direction_index]),1);//remove the direction

  if(next === end){//if this equals, we have rached the end
    this.clear_backtrack();
    this_point.connection_direction = direction;
    this_point.connection_step = this.travelled.length;
    console.log(this.debug+":"+this.debug_b);
    return
  }else{
    //first, is this point locked in
    var epn = (this_point.neighbor_ids[0]>=0)?this.centers[this_point.neighbor_ids[0]].visited:true;
    var spn = (this_point.neighbor_ids[2]>=0)?this.centers[this_point.neighbor_ids[2]].visited:true;
    var wpn = (this_point.neighbor_ids[4]>=0)?this.centers[this_point.neighbor_ids[4]].visited:true;
    var npn = (this_point.neighbor_ids[6]>=0)?this.centers[this_point.neighbor_ids[6]].visited:true;

    if(epn && spn && wpn && npn){//we are trapped, begin the backtrack process
      console.log("send:-1")
      this.backtrack(end,seed);
    }else{//we are not trapped, and can look forward
      if (next>=0){//if the next neightbor is inside the borders, we can continue
        next_point = this.centers[next];
        if(next_point.visited === false && next_point.is_room === false){//this is a valid point we can assume to continue
          this.clear_backtrack();
          this_point.is_room = true;
          this_point.visited = true;
          this_point.connection_direction = direction;
          this_point.connection_step = this.travelled.length;
          this.travelled.push(next);
          console.log("send:1");
          this.next_position(next,end,seed);//recursion
        }else{//try the point again
          if(search.length<1){
            console.log("send:-2");
            this.backtrack(end,seed);//add this point to the back tracked array
          }else{
            console.log("send:2");
            this.next_position(position,end,seed,search);
          }
        }
      }else{//we were gonna try a point outside the border, send againtry the point again
        if(search.length<1){
          console.log("send:-3");
          this.backtrack(end,seed);
        }else{
          console.log("send:3");
          this.next_position(position,end,seed,search);
        }
      }
    }
  }

}
//----------------

game.stage.prototype.random_spawn=function(seed){
  //var cell = Math.round(Math.random()*(this.centers.length-1));
  var cell = Math.round(this.random(seed)*(this.centers.length-1));
  if(this.centers[cell].is_border===true){
    this.random_spawn();
  }else{
    return cell;
  }
}
//-------
game.stage.prototype.terminal_positions=function(seed){
  start = this.random(seed);
  end = this.random(seed+23);
  this.start_position = Math.round(start*(this.centers.length-1));
  this.end_position = Math.round(end*(this.centers.length-1));

  this.centers[this.start_position].is_room = true;
  this.centers[this.start_position].visited = true;
  this.centers[this.end_position].is_room = true;
  this.centers[this.end_position].visited = true;
}

game.stage.prototype.random=function(seed){
  seed = seed||Math.random()*999;
  return Math.abs(Math.sin(seed++));
}

/*game.stage.prototype.construct_graph=function(){
  game.graph.prototype.construct_graph.call();
}

game.stage.prototype.construct_geo=function(){
  game.graph.prototype.construct_geo.call();
}*/

//----------------
//server related functions, to minimize the amount of data
//to be transfered to client to rebuild this particular graph
//----------------


//client related data, to use the data send from the server
//to rebuild the particular graph

//-----------------
//-----------------

/*game.graph_center=function(id,lu,n,bo){
  //id, lookup,neighbor, is border
  this.init(id,lu,n,bo);
  return this;
}
game.graph_center.prototype.init=function(id,lu,n,bo){
  this.index_ = id;
  this.lookup = lu;//an array of x y coordinate
  this.neighbor_ids = n;//array of ints

  this.is_border = bo || false;//bool

  //this.is_wall = false;
  //this.is_occupied = false;
  //this.is_collidable = false;
}*/
