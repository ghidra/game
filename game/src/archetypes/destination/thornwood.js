game.archetypes.destination.thornwood=function(){
	return this.init();
}
game.archetypes.destination.thornwood.prototype=new game.archetypes.object();
game.archetypes.destination.thornwood.prototype.constructor=game.archetypes.object;

game.archetypes.destination.thornwood.prototype.init = function(){
	game.archetypes.object.prototype.init.call(this,'Thornwood');

	this.location = new game.vector2(-30,69);//this is the location relative to the planet where this destination is

	return this;
};
game.archetypes.destination.thornwood.prototype.get_random_name = function(){
	return 'Thornwood';
}