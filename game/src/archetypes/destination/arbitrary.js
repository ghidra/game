game.archetypes.destination.arbitrary=function(location,label){
	return this.init(location,label);
}
game.archetypes.destination.arbitrary.prototype=new game.archetypes.object();
game.archetypes.destination.arbitrary.prototype.constructor=game.archetypes.object;

game.archetypes.destination.arbitrary.prototype.init = function(location,label){
	game.archetypes.object.prototype.init.call(this,label);

	this.location = location;//this is the location relative to the planet where this destination is

	return this;
};
game.archetypes.destination.arbitrary.prototype.adjust_pawn_attributes=function(pawn){
	return true;
}

game.archetypes.destination.arbitrary.prototype.get_random_name = function(){
	return 'Somewhere';
}