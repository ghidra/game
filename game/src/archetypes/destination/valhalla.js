game.archetypes.destination.valhalla=function(){
	return this.init();
}
game.archetypes.destination.valhalla.prototype=new game.archetypes.object();
game.archetypes.destination.valhalla.prototype.constructor=game.archetypes.object;

game.archetypes.destination.valhalla.prototype.init = function(){
	game.archetypes.object.prototype.init.call(this,'Valhalla');

	this.location = new game.vector2(30,-8);//this is the location relative to the planet where this destination is

	return this;
};
game.archetypes.destination.valhalla.prototype.get_random_name = function(){
	return 'Valhalla';
}