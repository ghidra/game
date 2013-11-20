game.archetypes.damage_type.basic=function(){
	return this.init();
}
game.archetypes.damage_type.basic.prototype=new game.archetypes.object();
game.archetypes.damage_type.basic.prototype.constructor=game.archetypes.object;

game.archetypes.damage_type.basic.prototype.init = function(){
	game.archetypes.object.prototype.init.call(this,'basic');
	return this;
};
game.archetypes.damage_type.basic.prototype.adjust_attributes=function(pawn){
	/*pawn.adjust_attribute_value('hp', 1.25);
	pawn.adjust_attribute_value('ap', 2.0);
	pawn.adjust_attribute_value('str',1.1);//strenght
	pawn.adjust_attribute_value('agi',1.1);//agility
	pawn.adjust_attribute_value('sta',1.1);//stamina
	pawn.adjust_attribute_value('int',1.1);//intellegence
	pawn.adjust_attribute_value('fai',1.1);//faith
	pawn.adjust_attribute_value('wis',1.1);//wisdon*/

	return true;
}

game.archetypes.damage_type.basic.prototype.get_random_name = function(){
	return 'Basic';
}