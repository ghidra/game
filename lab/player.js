game.player=function(id){
  return this.init(id);
}
game.player.prototype.init=function(i){
  this.id=i;
  this.position = new game.vector2();//the position of this player
  this.world = -1;//the world id that the player is in
  this.boundry = new game.vector2();

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
  var nx = this.position._x + x;
  var ny = this.position._y + y;
  //alert(nx+":"+ny);
  this.position._x = (nx<=this.boundry._x && nx>=0)?nx:this.position._x;
  this.position._y = (ny<=this.boundry._y && ny>=0)?ny:this.position._y;
  //this.position._x += x;
  //this.position._y += y;
  //alert(this.position._x+":"+this.position._y)
}
game.player.prototype.set_boundry=function(x,y){
  this.boundry=new game.vector2(x,y);
}
//this function is data that is sent to the server by the players client
//game.player.prototype.receive_data=function(data){
//  return;
//}
