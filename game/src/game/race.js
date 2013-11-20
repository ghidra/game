game.race=function(type){
	return this.init(type);
};

game.race.prototype=new game.archetypes.type();
game.race.prototype.constructor=game.archetypes.type;


game.race.prototype.init = function(type){

	game.actor.prototype.init.call(this);
	
	this.archetypes=this.archetypes_group('race');

	type = (this.archetypes.indexOf(type)!=-1) ? type : this.random();
	this.archetype = new game.archetypes.race[type]();
	
	game.archetypes.type.prototype.init.call(this,type); 

	return this;
};
