game.server.worlds=function(){
  return this.init();
}
game.server.worlds.prototype.init=function(){
  this.count=0;//number of worlds created
  this.worlds={};//array to hold the worlds
}

game.server.worlds.prototype.build_world=function(){
  var world = new game.world(this.count,96,96);
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
