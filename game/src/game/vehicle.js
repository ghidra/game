game.vehicle=function(type,pawn){
	return this.init(type,pawn);
};

game.vehicle.prototype=new game.archetypes.physical();
game.vehicle.prototype.constructor=game.archetypes.physical;

game.vehicle.prototype.init = function(type,pawn){

	this.archetypes=this.archetypes_group();

	game.archetypes.physical.prototype.init.call(this,type,pawn,'vehicle');

	return this;
};