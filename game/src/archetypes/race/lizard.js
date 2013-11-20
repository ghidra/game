game.archetypes.race.lizard=function(){
	//game.race.call();
	return this.init();
}
game.archetypes.race.lizard.prototype=new game.archetypes.object();
game.archetypes.race.lizard.prototype.constructor=game.archetypes.object;

game.archetypes.race.lizard.prototype.init = function(){
	game.archetypes.object.prototype.init.call(this,'lizard');
	return this;
};

game.archetypes.race.human.prototype.adjust_attributes=function(pawn){
	pawn.adjust_attribute_value('hp', 1.5);
	pawn.adjust_attribute_value('ap', 3.0);
	pawn.adjust_attribute_value('str',1.5);//strenght
	pawn.adjust_attribute_value('agi',3.0);//agility
	pawn.adjust_attribute_value('sta',0.8);//stamina
	pawn.adjust_attribute_value('int',0.6);//intellegence
	pawn.adjust_attribute_value('fai',2.0);//faith
	pawn.adjust_attribute_value('wis',0.8);//wisdon

	return true;
}

game.archetypes.race.lizard.prototype.get_random_name = function(){
	var names = [
		'Slither',
		'Scales',
		'Sidewinder',
		'Biforcion',
		'Slit',
		'Skunt'
	];
	var name = names[ Math.floor(Math.random()*names.length)];

	return name;
}