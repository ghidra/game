//this class is actually not used at all
//it might become usefull when having to represent a skill in a graphics
//right now a skill archetype is given straigt to the skill list object
game.skill=function(type,pawn){
	return this.init(type,pawn);
};

game.skill.prototype=new game.archetypes.physical();
game.skill.prototype.constructor=game.archetypes.physical;

game.skill.prototype.init = function(type,pawn){

	this.archetypes=this.archetypes_group();

	game.archetypes.physical.prototype.init.call(this,type,pawn,'skill');

	return this;
};
