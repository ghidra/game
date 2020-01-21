game.player=function(id){
  return this.init(id);
}
game.player.prototype.init=function(i){
  this.id=i;
  this.position = new game.vector2();//the position of this player
  this.positionFloat = new game.vector2();
  //cache to test before setting
  this.position_cache = new game.vector2();
  this.positionFloat_cache = new game.vector2();
  //this.world = -1;//the world id that the player is in
  this.boundry = new game.vector2();

  this.speed = 10.0;
}
//this function is data that is set by the sever
game.player.prototype.set_data=function(data){
  for(var key in data) {
      switch(key){
        case "position":
          //this.position.copy( data[key] );
          this.positionFloat.copy( data[key] );
          this.position.init( Math.round(this.positionFloat._x),Math.round(this.positionFloat._y) );
          break;
        //case "world":
        //  this.world = data[key];
        //  break;
      }
  }
}
game.player.prototype.move=function(x,y){
  this.position_cache = this.position.duplicate();
  this.positionFloat_cache = this.positionFloat.duplicate();

  var nx = this.positionFloat._x + x;
  var ny = this.positionFloat._y + y;
  //alert(nx+":"+ny);
  this.positionFloat._x = (nx<this.boundry._x && nx>=0)?nx:this.positionFloat._x;
  this.positionFloat._y = (ny<this.boundry._y && ny>=0)?ny:this.positionFloat._y;
  
  this.position._x = Math.round(this.positionFloat._x);
  this.position._y = Math.round(this.positionFloat._y);
  //alert(this.position._x+":"+this.position._y)
}
game.player.prototype.revert_move=function(){
  this.position = this.position_cache.duplicate();
  this.positionFloat = this.positionFloat_cache.duplicate();
}
game.player.prototype.set_boundry=function(x,y){
  this.boundry=new game.vector2(x,y);
}
//this function is data that is sent to the server by the players client
//game.player.prototype.receive_data=function(data){
//  return;
//}
