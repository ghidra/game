game.class=function(type){
	return this.init(type);
};

game.class.prototype=new game.archetypes.type();
game.class.prototype.constructor=game.archetypes.type;

game.class.prototype.init = function(type){
	game.actor.prototype.init.call(this);
	
	this.archetypes=this.archetypes_group('class');

	type = (this.archetypes.indexOf(type)!=-1) ? type : this.random();
	this.archetype = new game.archetypes.class[type]();

	game.archetypes.type.prototype.init.call(this,type); 

	return this;
};
