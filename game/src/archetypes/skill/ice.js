game.archetypes.skill.ice=function(){
	return this.init();
}
game.archetypes.skill.ice.prototype=new game.archetypes.object();
game.archetypes.skill.ice.prototype.constructor=game.archetypes.object;

game.archetypes.skill.ice.prototype.init = function(){
	game.archetypes.object.prototype.init.call(this,'ice');

	this.damage_type = new game.damage_type('basic');
	this.action_cost = 5;//what it cost to use this weapon
	this.damage_base = 1.0;

	return this;
};
game.archetypes.skill.ice.prototype.adjust_pawn_attributes=function(pawn){
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

game.archetypes.skill.fire.prototype.get_random_name = function(){
	return 'ice';
}