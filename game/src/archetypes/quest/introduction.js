game.archetypes.quest.introduction=function(parent){
	return this.init(parent);
}
game.archetypes.quest.introduction.prototype=new game.archetypes.quests();
game.archetypes.quest.introduction.prototype.constructor=game.archetypes.quests;

game.archetypes.quest.introduction.prototype.init = function(parent){
	game.archetypes.quests.prototype.init.call(this,parent);

	this.type = 'Introduction';
	this.id = 'introduction';

	this.set_requirements(
		{
			'instigate':1,
			'valhalla':1,
			'berries':10,
			'return':1
		},
		{
			'instigate':0
		}
	);

	//----enemies
	this.pawn_factory = new game.pawn_factory(
		{
			'race':['human','caveman','alien','lizard','cyborg'],
			'class':['programmer','artist','warrior'],
			'inventory':{
				'weapons':{},
				'armors':{},
				'items':{'money':1}
			}
		},
		program.character,
		'palette_character_enemy'
	);

	this.instigate_location =  new game.vector2(2,-4);//new game.archetypes.destination.arbitrary( new game.vector2(10,21),'return');
	this.return_location =  new game.vector2(32,19);//new game.archetypes.destination.arbitrary( new game.vector2(10,21),'return');

	return this;
};

game.archetypes.quest.introduction.prototype.tick=function(){
	if(!this.attributes_triggered['instigate']) this.check_destination_reached('instigate',this.instigate_location,this.instigate_reached);
	if(this.check_requirement('instigate')){
		if(!this.attributes_triggered['valhalla']) this.check_destination_reached('valhalla','',this.valhalla_reached);
	}
	if(this.check_requirement('berries')){
		this.trigger_requirement('berries',this.berries_reached);
		this.check_destination_reached('return',this.return_location,this.return_reached);
	}
	game.archetypes.quests.prototype.tick.call(this);

}
//-------------------
game.archetypes.quest.introduction.prototype.begin=function(){
	this.parent.log('First you need to seek out the instigator');
}
game.archetypes.quest.introduction.prototype.instigate_reached=function(){
	program.quest.archetype.parent.log(' You\'ve been sent to find the small village of Valhalla, in search of berries');
	return true;
}
game.archetypes.quest.introduction.prototype.valhalla_reached=function(){
	//alert('how mnay times');
	program.quest.archetype.parent.log(' You\'ve found Valhalla, now find those berries');
	program.quest.archetype.pawn_factory.inventory.items.berries = 1;	
	return true;
}
game.archetypes.quest.introduction.prototype.berries_reached=function(){
	program.quest.archetype.parent.log(' You\'ve found all the berries you need, return to x to claim your reward');
	return true;
	//alert('well i made it to the end');
}
game.archetypes.quest.introduction.prototype.return_reached=function(){
	program.quest.archetype.parent.log(' You\'ve returned the berries, carry on');
	return true;
	//alert('well i made it to the end');
}
