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

  this.debug=0;
  this.debug_b=0;
  this.debug_seed=-1;
  this.debug_pos_seed=-1;
  this.debug_started_over=0;

  this.iterations=0;
  this.recursion_threshold=12;//12 times caught in a loop will be my treshold to start over again
  this.catch_recursion=0;

  this.start_position=-1;
  this.end_position=-1;
  while(this.start_position === this.end_position){
    this.terminal_positions();
  }

  this.travelled=[];//hold the path finding, where we have travelled
  this.backtracked=[];

  this.find_random_path(this.start_position,this.end_position);

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
        col = (this.centers[i].connection_step==1)?'red':''
        s+="<a id=graphsquare"+i+" style=\"color:"+col+"\">"+char+"</div>";
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
  s+="<br>iterations:"+this.iterations+"<br>";
  //s+="pos seed:"+this.debug_pos_seed+"<br>";
  //s+="seed:"+this.debug_seed+"<br>";
  s+="backtracked:"+this.debug+"<br>";
  s+="clear backtracked:"+this.debug_b+"<br>";
  s+="started over:"+this.debug_started_over+"<br>";
  return s;
}
///////
///////
//ok so i seem to be messing up when i backtrack more than i clear the back track.
//because i should be clearing the back track at least as many times as I backtrack, since I should find a solution
//no, thats no right.  I can always have more back tracks than clears...  but it still is when the errors occur
//////
//////

//----------------
game.stage.prototype.find_random_path=function(start,end,seed){
  this.next_position(start,end,seed);
}
game.stage.prototype.clear_backtrack=function(){
  if(this.backtracked.length>0){
    this.debug_b+=1;
  }
  while(this.backtracked.length > 0) {
    var i = this.backtracked[this.backtracked.length-1];
    this.centers[i].is_room=false;
    this.centers[i].visited=false;
    this.centers[i].connection_direction = -1;
    this.centers[i].connection_step = -1;
    this.backtracked.pop();
  }
}
game.stage.prototype.backtrack=function(position,end,seed){//send the backtrack position
  this.debug+=1;
  if(this.travelled.length<=1){
    this.clear_backtrack();
    this.next_position(this.travelled[this.travelled.length-1],end,seed)
  }else{
    var back = this.travelled.pop()
    this.backtracked.push(back);//add this point to the back tracked array
    //this.centers[back].is_room=false;
    //this.centers[back].visited=false;
    //this.centers[back].connection_direction=-1;
    //this.centers[back].connection_step = -1;
    this.centers[position].is_room=false;
    this.centers[position].visited=true;
    this.centers[position].connection_direction=-1;
    this.centers[position].connection_step = -1;
    this.next_position(back,end,seed);//recursion
  }
}
game.stage.prototype.startover=function(seed){
  console.log("STARTOVER:"+this.debug_started_over+":"+this.iterations)
  this.debug_started_over+=1;

  this.clear_backtrack();
  while(this.travelled.length > 0) {
    var p = this.travelled.pop();
    /*this.centers[p].is_room=false;
    this.centers[p].visited=false;
    this.centers[p].connection_direction=-1;
    this.centers[p].connection_step = -1;*/
  }
  for(var i=0;i<this.centers.length;i++){
    this.centers[i].is_room=false;
    this.centers[i].visited=false;
    this.centers[i].connection_direction = -1;
    this.centers[i].connection_step = -1;
  }
  this.centers[this.end_position].is_room = true;
  this.centers[this.end_position].visited = true;

  //console.log(this.travelled)
  console.log(this.start_position+":"+this.end_position);
  var n1 = this.centers[this.start_position].neighbor_ids[0];
  var n2 = this.centers[this.start_position].neighbor_ids[2];
  var n3 = this.centers[this.start_position].neighbor_ids[4];
  var n4 = this.centers[this.start_position].neighbor_ids[6];
  console.log(n1+":"+n2+":"+n3+":"+n4)
  //console.log(this.centers[n1].visited+":"+this.centers[n2].visited+":"+this.centers[n3].visited+":"+this.centers[n4].visited)

  //this.travelled=[];//hold the path finding, where we have travelled
  //this.backtracked=[];


  //this.debug=0;
  //this.debug_b=0;
  //this.debug_seed=-1;
  //this.debug_pos_seed=-1;
  //this.iterations=0;
  this.catch_recursion=0;

  this.find_random_path(this.start_position,this.end_position,seed);
}
game.stage.prototype.next_position=function(position,end,seed,search){
  //i should ust build it in, that if we get an undefind value, to just start over.
  //or if we iterate x number of times, like 500, then just start over.
  //basically, just return false, and if false, go again
  seed = seed||0;
  search = search||[0,2,4,6];
  seed+=1;
  this.iterations+=1;
  if(this.iterations==1)this.debug_seed=Math.asin(seed-1)*(180/Math.PI);
  //console.log("search length:"+search.length);
  var direction_index = Math.floor(this.random(seed)*search.length);//get a random direction
  var this_point = this.centers[position];
  var direction = search[direction_index];

  //if(this.debug_started_over>0)alert(this_point.neighbor_ids[direction]);

  //console.log("direction:"+direction+",direction index:"+direction_index+",id:"+position+",npos"+search.length)
  var next = this_point.neighbor_ids[direction];//get the id of that neighboring point
  search.splice(search.indexOf(search[direction_index]),1);//remove the direction

  if(this.catch_recursion>=this.recursion_threshold){
    this.startover(seed);
  }

  if(next === end){//if this equals, we have rached the end
    this.clear_backtrack();
    this_point.connection_direction = direction;
    this_point.connection_step = this.travelled.length;
    return
  }else{
    //first, is this point locked in
    var epn = (this_point.neighbor_ids[0]>=0)?this.centers[this_point.neighbor_ids[0]].visited:true;
    var spn = (this_point.neighbor_ids[2]>=0)?this.centers[this_point.neighbor_ids[2]].visited:true;
    var wpn = (this_point.neighbor_ids[4]>=0)?this.centers[this_point.neighbor_ids[4]].visited:true;
    var npn = (this_point.neighbor_ids[6]>=0)?this.centers[this_point.neighbor_ids[6]].visited:true;

    var is_trapped = (epn && spn && wpn && npn);
    var is_graph = (next>=0);
    var is_nextvalid = (is_graph)?(this.centers[next].visited === false && this.centers[next].is_room === false):false;
    var is_exausted = (search.length<1);

    if(!is_trapped && is_graph && is_nextvalid && !is_exausted){
      this.clear_backtrack();
      this.catch_recursion=0;
      this_point.is_room = true;
      this_point.visited = true;
      this_point.connection_direction = direction;
      this_point.connection_step = this.travelled.length;
      //this.travelled.push(next);
      this.travelled.push(position);
      console.log("send:1");
      this.next_position(next,end,seed);//recursion
    }else{
      if(is_exausted || is_trapped){//we need to go back
        console.log("send:-1:"+is_exausted+":"+is_trapped);
        this.catch_recursion+=1;
        this.backtrack(position,end,seed);//add this point to the back tracked array
      }else{//we need to try again
        console.log("send:0");
        this.catch_recursion+=1;
        this.next_position(position,end,seed,search);
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

  //this.centers[this.start_position].is_room = true;
  //this.centers[this.start_position].visited = true;
  this.centers[this.end_position].is_room = true;
  this.centers[this.end_position].visited = true;

  this.debug_pos_seed = Math.asin(start)*(180/Math.PI);
}

game.stage.prototype.random=function(seed){
  seed = seed||Math.round(Math.random()*999);
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
