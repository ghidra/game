game.keyevent=function(){
	this.init();
}
game.keyevent.prototype.init = function(){
	_this = this;
	_player = {};
	document.onkeydown = function(event){_this.keypressed(event)};
}
game.keyevent.prototype.set_player = function(player){
	this._player = player;
}
game.keyevent.prototype.keypressed = function(e){
	switch(e.keyCode){
		case 87://w
			this._player.move(0,-1);
			break;
		case 65://a
			this._player.move(-1,0);
			break;
		case 83://s
			this._player.move(0,1);
			break;
		case 68://d
			this._player.move(1,0);
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
