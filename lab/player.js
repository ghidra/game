game.player=function(id){
  return this.init(id);
}
game.player.prototype.init=function(i){
  this.id=i;
  this.position = new game.vector2();//the position of this player
  this.world = -1;//the world id that the player is in

  this.speed = 1.0;
}
//this function is data that is set by the sever
game.player.prototype.set_data=function(data){
  for(var key in data) {
      switch(key){
        case "position":
          this.position.copy( data[key] );
          break;
        case "world":
          this.world = data[key];
          break;
      }
  }
}
game.player.prototype.move=function(x,y){
  this.position._x += x;
  this.position._y += y;
  //alert(this.position._x+":"+this.position._y)
}
//this function is data that is sent to the server by the players client
//game.player.prototype.receive_data=function(data){
//  return;
//}
