game.archetypes.destination.thornberry=function(){
	return this.init();
}
game.archetypes.destination.thornberry.prototype=new game.archetypes.object();
game.archetypes.destination.thornberry.prototype.constructor=game.archetypes.object;

game.archetypes.destination.thornberry.prototype.init = function(){
	game.archetypes.object.prototype.init.call(this,'Thornberry');

	this.location = new game.vector2(0,0);//this is the location relative to the planet where this destination is

	return this;
};
game.archetypes.destination.thornberry.prototype.get_random_name = function(){
	return 'Thornberry';
}