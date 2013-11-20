game.weapon=function(type,pawn){
	return this.init(type,pawn);
};

game.weapon.prototype=new game.archetypes.physical();
game.weapon.prototype.constructor=game.archetypes.physical;

game.weapon.prototype.init = function(type,pawn){

	this.archetypes=this.archetypes_group();

	game.archetypes.physical.prototype.init.call(this,type,pawn,'weapon');

	return this;
};