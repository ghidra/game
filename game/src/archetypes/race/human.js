game.archetypes.race.human=function(){
	//game.race.call();
	//this.init('human')
	return this.init();
}
game.archetypes.race.human.prototype=new game.archetypes.object();
game.archetypes.race.human.prototype.constructor=game.archetypes.object;

game.archetypes.race.human.prototype.init = function(){
	game.archetypes.object.prototype.init.call(this,'human');
	return this;
};
game.archetypes.race.human.prototype.adjust_attributes=function(pawn){
	pawn.adjust_attribute_value('hp', 1.25);
	pawn.adjust_attribute_value('ap', 2.0);
	pawn.adjust_attribute_value('str',1.1);//strenght
	pawn.adjust_attribute_value('agi',1.1);//agility
	pawn.adjust_attribute_value('sta',1.1);//stamina
	pawn.adjust_attribute_value('int',1.1);//intellegence
	pawn.adjust_attribute_value('fai',1.1);//faith
	pawn.adjust_attribute_value('wis',1.1);//wisdon

	return true;
}

game.archetypes.race.human.prototype.get_random_name = function(){
	var first_names = [
		'Roger',
		'Dalph',
		'Jack'
	];
	var last_names = [
		'Smith',
		'Manson',
		'Slater',
		'Deston',
		'Kroger'
	];
	var first = first_names[ Math.floor(Math.random()*first_names.length)];
	var last = last_names[ Math.floor(Math.random()*last_names.length)];

	return first+' '+last;
}