game.archetypes.race.cyborg=function(){
	//game.race.call();
	return this.init();
}
game.archetypes.race.cyborg.prototype=new game.archetypes.object();
game.archetypes.race.cyborg.prototype.constructor=game.archetypes.object;

game.archetypes.race.cyborg.prototype.init = function(){
	game.archetypes.object.prototype.init.call(this,'cyborg');
	return this;
};

game.archetypes.race.cyborg.prototype.adjust_attributes=function(pawn){
	pawn.adjust_attribute_value('hp', 0.6);
	pawn.adjust_attribute_value('ap', 1.0);
	pawn.adjust_attribute_value('str',2.0);//strenght
	pawn.adjust_attribute_value('agi',2.0);//agility
	pawn.adjust_attribute_value('sta',4.0);//stamina
	pawn.adjust_attribute_value('int',3.0);//intellegence
	pawn.adjust_attribute_value('fai',0.3);//faith
	pawn.adjust_attribute_value('wis',0.3);//wisdon

	return true;
}

game.archetypes.race.cyborg.prototype.get_random_name = function(){
	var names = [
		'Cyrex',
		'Secktor',
		'Bytor',
		'T100',
		'2286i',
		'iSkel'
	];
	var name = names[ Math.floor(Math.random()*names.length)];

	return name;
}