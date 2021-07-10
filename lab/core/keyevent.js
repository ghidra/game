game.keyevent=function(){
	this.init();
}
game.keyevent.prototype.init = function(){
	_this = this;
	//this._player = {};
	this._key = {};
	//document.onkeydown = function(event){_this.keypressed(event)};
	//document.onkeyup = function(e) { _this.keypressed(e);}//this._k[e.keyCode] = false; }
	//document.onkeydown = function(e) { _this.keyreleased(e);}//this._k[e.keyCode] = true; }
	document.onkeyup = function(e) { _this._key[e.keyCode] = false; }
	document.onkeydown = function(e) { _this._key[e.keyCode] = true; }

	////soon to be nessisary.... to test
	//document.addEventListener('keyup', function(e){_this._key[e.keyCode] = false;} );
	//document.addEventListener('keydown', function(e){_this._key[e.keyCode] = true;} );

}
/*game.keyevent.prototype.set_player = function(player){
	this._player = player;
}*/
game.keyevent.prototype.get_keys = function(){
	return this._k;
}
/*game.keyevent.prototype.keypressed = function(e){
	switch(e.keyCode){
		case 87://w
			this._k["87"]=true;
			//this._player.move(0,-1);
			break;
		case 65://a
			this._k["65"]=true;
			//this._player.move(-1,0);
			break;
		case 83://s
			this._k["83"]=true;
			//this._player.move(0,1);
			break;
		case 68://d
			this._k["68"]=true;
			//this._player.move(1,0);
			break;
	}
	//graphmove(e.keyCode);
	//alert(e.keyCode);//charCode
	//w=87
	//a=65
	//s=83
	//d=68
}
game.keyevent.prototype.keyreleased = function(e){
	switch(e.keyCode){
		case 87://w
			this._k["87"]=false;
			break;
		case 65://a
			this._k["65"]=false;
			break;
		case 83://s
			this._k["83"]=false;
			break;
		case 68://d
			this._k["68"]=false;
			break;
	}
}
*/



//--------------------------
