game.archetypes.race.caveman=function(){
	//game.race.call();
	return this.init();
}
game.archetypes.race.caveman.prototype=new game.archetypes.object();
game.archetypes.race.caveman.prototype.constructor=game.archetypes.object;

game.archetypes.race.caveman.prototype.init = function(){
	game.archetypes.object.prototype.init.call(this,'caveman');
	return this;
};

game.archetypes.race.caveman.prototype.adjust_attributes=function(pawn){
	pawn.adjust_attribute_value('hp', 2.0);
	pawn.adjust_attribute_value('ap', 2.0);
	pawn.adjust_attribute_value('str',2.0);//strenght
	pawn.adjust_attribute_value('agi',2.0);//agility
	pawn.adjust_attribute_value('sta',1.4);//stamina
	pawn.adjust_attribute_value('int',0.4);//intellegence
	pawn.adjust_attribute_value('fai',2.0);//faith
	pawn.adjust_attribute_value('wis',1.0);//wisdon

	return true;
}

game.archetypes.race.caveman.prototype.get_random_name = function(){
	var first_names = [
		'Scar',
		'Drago',
		'Hun',
		'Chorte',
		'Grunt'
	];
	var last_names = [
		'The Gatherer',
		'The Hunter',
		'The Collector',
		'The Wanderer',
		'The Loner'
	];
	var first = first_names[ Math.floor(Math.random()*first_names.length)];
	var last = last_names[ Math.floor(Math.random()*last_names.length)];

	return first+' '+last;
}