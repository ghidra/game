/////THIS FILE IS NOT EVEN USED
game.destination=function(type){
	//game.actor.call();
	//return this.init(type);
};

game.destination.prototype=new game.archetypes.type();
game.destination.prototype.constructor=game.archetypes.type;

game.destination.prototype.init = function(type){
	game.actor.prototype.init.call(this);

	this.archetypes=this.archetypes_group('destination');

	type = (this.archetypes.indexOf(type)!=-1) ? type : this.archetypes[0];//this.random();
	this.archetype = new game.archetypes.destination[type]();
	
	//game.archetypes.type.prototype.create.call(this,type);
	this.archetypes=[];
	this.type = this.archetype.type;

	return this;
};