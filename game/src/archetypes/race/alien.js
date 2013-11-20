game.archetypes.race.alien=function(){
	//game.race.call();
	//this.init('alien')
	return this.init();
}
game.archetypes.race.alien.prototype=new game.archetypes.object();
game.archetypes.race.alien.prototype.constructor=game.archetypes.object;

game.archetypes.race.alien.prototype.init = function(){
	game.archetypes.object.prototype.init.call(this,'alien');
	return this;
};

game.archetypes.race.alien.prototype.adjust_attributes=function(pawn){
	pawn.adjust_attribute_value('hp', 2.0);
	pawn.adjust_attribute_value('ap', 2.0);
	pawn.adjust_attribute_value('str',0.8);//strenght
	pawn.adjust_attribute_value('agi',0.8);//agility
	pawn.adjust_attribute_value('sta',2.0);//stamina
	pawn.adjust_attribute_value('int',2.0);//intellegence
	pawn.adjust_attribute_value('fai',0.5);//faith
	pawn.adjust_attribute_value('wis',2.0);//wisdon

	return true;
}

game.archetypes.race.alien.prototype.get_random_name = function(){
	var names = [
		'Grodanesh',
		'Slegraccck',
		'Prosgss',
		'verminini',
		'ggrrss',
		'hmmmnnng',
		'ssseleg'
	];

	var name = names[ Math.floor(Math.random()*names.length)];

	return name;
};