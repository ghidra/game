game.archetypes.armor.dead_leaves=function(){
	return this.init();
}
game.archetypes.armor.dead_leaves.prototype=new game.archetypes.object();
game.archetypes.armor.dead_leaves.prototype.constructor=game.archetypes.object;

game.archetypes.armor.dead_leaves.prototype.init = function(){
	game.archetypes.object.prototype.init.call(this,'dead leaves');

	return this;
};
game.archetypes.armor.dead_leaves.prototype.adjust_attributes=function(pawn){
	pawn.adjust_attribute_value('hp', 1.25);
	pawn.adjust_attribute_value('ap', 2.0);

	return true;
}

game.archetypes.armor.dead_leaves.prototype.get_random_name = function(){
	return 'Bare Hands';
}