//This class, extends graph.
//It is a graph that is based on the first2 inputs for width and height
//te second inputs are the sub graphs, that are at each point on the main graph
//
//The main graph determines the main path,
//the sub graph, represents each room.
//so there should be a sub graph only for each room

game.stage=function(xdiv,ydiv,subdiv){
  game.graph.call();
  this.init(xdiv,ydiv,subdiv);
  return this;
}
game.stage.prototype=new game.graph();
game.stage.prototype.constructor=game.graph;

game.stage.prototype.init=function(xdiv,ydiv,subdiv){
  game.graph.prototype.init.call(this,xdiv,ydiv);

  //main graph variables
  this.iterations=0;
  this.recursion_threshold=12;//12 times caught in a loop will be my treshold to start over again
  this.catch_recursion=0;
  this.started_over=0;

  this.start_position=-1;
  this.end_position=-1;
  while(this.start_position === this.end_position){
    this.terminal_positions();
  }

  this.travelled=[];//hold the path finding, where we have travelled
  this.backtracked=[];
  this.min_rooms = Math.ceil((xdiv+ydiv)/2);
  //---
  //sub graph variables
  this.subdiv = subdiv||10;
  this.subgraphs = [];//the array to hold the subgraphs

  //drawing variables
  this.chars_horizontal = xdiv*subdiv;//the number of characters in one horizontal line
  this.chars_vertical = ydiv*subdiv;

  this.find_random_path(this.start_position,this.end_position);//main raph find the random path
  this.make_subgraphs();//now make the subgraphs based on the path

  this.geo = this.construct_geo();
  this.geo += this.construct_geo_sub();

  return this;

}
//---------------
game.stage.prototype.construct_geo=function(){
  //game.graph.prototype.construct_geo.call(this);
  var s = "";
  var rooms=0;

  for (var i =0; i<this.centers.length; i++){
    var char = '';
    if(i===this.start_position || i===this.end_position){
      char = (i===this.start_position)?'i':'o';
      s+="<a stlye=\"float:left\" id=graphsquare"+i+">"+char+"</a>";
      rooms+=1;
    }else{
      //if(this.centers[i].is_room===true){//some are still considers rooms?
        switch(this.centers[i].connection_direction){
          case 0:
            char = '&rightarrow;';
            rooms+=1;
            break;
          case 2:
            char = '&downarrow;';
            rooms+=1;
            break;
          case 4:
            char = '&leftarrow;';
            rooms+=1;
            break;
          case 6:
            char = '&uparrow;';
            rooms+=1;
            break;
          default:
            char = '&nbsp;';
            break;
        }
        //s+="<a id=graphsquare"+i+">"+char+"</div>";
        col = (this.centers[i].connection_step==1)?'red':''
        s+="<a stlye=\"float:left;\" id=graphsquare"+i+" style=\"color:"+col+"\">"+char+"</a>";
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
  s+="started over:"+this.started_over+"<br>";

  s+="<br>steps:"+rooms+"<br>";
  s+="travelled:"+this.travelled.length;
  s+="<br><br>";
  return s;
}

game.stage.prototype.construct_geo_sub=function(){
  var s='';
  var count = 0;
  var debug = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'];

  for(var yd = 0; yd < this.ydiv*this.subdiv; yd++){//do the verticals first,for each line of characters, so this is ydiv * sibdiv
    for(var xd = 0; xd < this.xdiv; xd++){//then do the horizontal,for each main graph point

      var row = Math.floor(yd/this.subdiv);
      var cid = (row*this.xdiv)+xd;

      if(this.centers[cid].is_room){//now if this is a center, we have a corresponding sub graph
        var char = '';
        switch(this.centers[cid].connection_direction){
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
        s+=Array(this.subdiv + 1).join(char);
      }else{
        s+=Array(this.subdiv + 1).join('&nbsp');
      }
      if(xd==this.xdiv-1) s+='<br>';//this is the end of the row
    }

  }
  return s;
}

//----------------


/////
//The below functions build the main graph
//----------------
//----------------
game.stage.prototype.clear_backtrack=function(){
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
  if(this.travelled.length<=1){
    this.clear_backtrack();
    this.next_position(this.travelled[this.travelled.length-1],end,seed)
  }else{
    var back = this.travelled.pop()
    this.backtracked.push(back);//add this point to the back tracked array
    this.centers[position].is_room=false;
    this.centers[position].visited=true;
    this.centers[position].connection_direction=-1;
    this.centers[position].connection_step = -1;
    this.next_position(back,end,seed);//recursion
  }
}
game.stage.prototype.startover=function(seed){
  this.started_over+=1;

  this.clear_backtrack();
  while(this.travelled.length > 0) {
    var p = this.travelled.pop();
  }
  for(var i=0;i<this.centers.length;i++){
    this.centers[i].is_room=false;
    this.centers[i].visited=false;
    this.centers[i].connection_direction = -1;
    this.centers[i].connection_step = -1;
  }

  this.start_position=-1;
  this.end_position=-1;
  while(this.start_position === this.end_position){
    this.terminal_positions();
  }

  this.catch_recursion=0;

  this.find_random_path(this.start_position,this.end_position,seed);
}
//------
//------
game.stage.prototype.next_position=function(position,end,seed,search){

  seed = seed||0;
  search = search||[0,2,4,6];
  seed+=1;
  this.iterations+=1;

  var direction_index = Math.floor(this.random(seed)*search.length);//get a random direction
  var this_point = this.centers[position];
  var direction = search[direction_index];

  var next = this_point.neighbor_ids[direction];//get the id of that neighboring point
  search.splice(search.indexOf(search[direction_index]),1);//remove the direction

  if(this.catch_recursion>=this.recursion_threshold){
    this.startover(seed);
    return;
  }

  if(next === end){//if this equals, we have rached the end
    if(this.travelled.length<this.min_rooms){
      this.startover(seed);
      return;
    }
    this.clear_backtrack();
    this_point.is_room = true;
    this_point.visited = true;
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
      this.travelled.push(position);
      this.next_position(next,end,seed);//recursion
    }else{
      if(is_exausted || is_trapped){//we need to go back
        this.catch_recursion+=1;
        this.backtrack(position,end,seed);//add this point to the back tracked array
      }else{//we need to try again
        this.catch_recursion+=1;
        this.next_position(position,end,seed,search);
      }
    }


  }

}
//----------------
game.stage.prototype.find_random_path=function(start,end,seed){
  this.next_position(start,end,seed);
}
//-------
game.stage.prototype.random_spawn=function(seed){
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

  this.centers[this.end_position].is_room = true;
  this.centers[this.end_position].visited = true;

  this.debug_pos_seed = Math.asin(start)*(180/Math.PI);
}

game.stage.prototype.random=function(seed){
  seed = seed||Math.round(Math.random()*999);
  return Math.abs(Math.sin(seed++));
}

////
////
//these function below build the sub graphs

game.stage.prototype.make_subgraphs=function(){
  for (var i =0; i<this.centers.length; i++){
      if(this.centers[i].is_room){
        this.subgraphs.push(new game.graph());
        this.subgraphs[this.subgraphs.length-1].init(this.subdiv);//init the graph
      }
  }
}
