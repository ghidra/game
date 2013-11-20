//i am not using this to store in the inventory. I am not using this at all.
//this might become useful when we have graphics and we want to spawn an item in the game world
//but for now, this is not used.
game.item=function(type,pawn){
	return this.init(type,pawn);
};

game.item.prototype=new game.archetypes.physical();
game.item.prototype.constructor=game.archetypes.physical;

game.item.prototype.init = function(type,pawn){

	this.archetypes=this.archetypes_group();

	game.archetypes.physical.prototype.init.call(this,type,pawn,'weapon');

	return this;
};