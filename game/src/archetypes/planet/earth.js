game.archetypes.planet.earth=function(){
	return this.init();
}
game.archetypes.planet.earth.prototype=new game.archetypes.object();
game.archetypes.planet.earth.prototype.constructor=game.archetypes.object;

game.archetypes.planet.earth.prototype.init = function(){
	game.archetypes.object.prototype.init.call(this,'Earth');

	//this is the array of destinations that are on this planet. later we will load in the destination objects
	this.destinations_archetypes = [
		'thornberry',
		'valhalla',
		'thornwood'
	];

	this.destinations = this.load_destinations();

	return this;
};

game.archetypes.planet.earth.prototype.load_destinations=function(pawn){
	var a = {};
	for (var i=0; i<this.destinations_archetypes.length; i++){
		var d = this.destinations_archetypes[i];
		a[d] = new game.archetypes.destination[d];
	}
	return a;
}

game.archetypes.planet.earth.prototype.adjust_pawn_attributes=function(pawn){
	return true;
}

game.archetypes.planet.earth.prototype.get_random_name = function(){
	return 'Earth';
}