game.damage_type=function(type){
	return this.init(type);
};

game.damage_type.prototype=new game.archetypes.type();
game.damage_type.prototype.constructor=game.archetypes.type;


game.damage_type.prototype.init = function(type){
	
	this.archetypes=this.archetypes_group('damage_type');

	type = (this.archetypes.indexOf(type)!=-1) ? type : this.archetypes[0];//this.random();
	this.archetype = new game.archetypes.damage_type[type]();
	
	game.archetypes.type.prototype.init.call(this,type); 

	return this;
};