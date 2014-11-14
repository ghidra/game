game.server.worlds=function(){
  return this.init();
}
game.server.worlds.prototype.init=function(){
  this.count=0;//number of players on
  this.worlds={};//array to hold the players
}

game.server.worlds.prototype.build_world=function(){
  var world = new game.server.world(this.count);
  this.worlds[this.count] = world;
  console.log('new world created: '+this.count);
  this.count++;
}
game.server.worlds.prototype.get_key=function(index){
  var count = -1;
  var last_found = -1;//if we are looking for an id that does not exist, just give it the last one found
  for(var key in this.worlds) {
    if(count === index){
      return key;
    }
    count++;
    last_found=key;
  }
  return last_found;
}
