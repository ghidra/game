game.keyevent=function(){
	this.init();
}
game.keyevent.prototype.init = function(){
	_this = this;
	document.onkeydown = function(event){_this.keypressed(event)};
}
game.keyevent.prototype.keypressed = function(e){
	graphmove(e.keyCode);
	//alert(e.keyCode);//charCode
	//w=87
	//a=65
	//s=83
	//d=68
}
