game.armor=function(type,pawn){
	return this.init(type,pawn);
};

game.armor.prototype=new game.archetypes.physical();
game.armor.prototype.constructor=game.archetypes.physical;

game.armor.prototype.init = function(type,pawn){

	this.archetypes=this.archetypes_group();//game.descriptions.armor;

	game.archetypes.physical.prototype.init.call(this,type,pawn,'armor');

	return this;
};