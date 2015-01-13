game.keyevent=function(){
	this.init();
}
game.keyevent.prototype.init = function(){
	_this = this;
	document.onkeydown = function(event){_this.keypressed(event)};
}
game.keyevent.prototype.keypressed = function(e){
	switch(e.keyCode){
		case 87://w
			this.move_player(3);
			break;
		case 65://a
			this.move_player(0);
			break;
		case 83://s
			this.move_player(1);
			break;
		case 68://d
			this.move_player(2);
			break;
	}
	//graphmove(e.keyCode);
	//alert(e.keyCode);//charCode
	//w=87
	//a=65
	//s=83
	//d=68
}

//--------------------------
game.keyevent.prototype.move_player = function(dir){
	switch(dir){
		case 0:
			mygame.player.move(1,0);
			break;
		case 1:
			mygame.player.move(0,-1);
			break;
		case 2:
			mygame.player.move(-1,0);
			break;
		case 3:
			mygame.player.move(0,1);
			break
	}
}
