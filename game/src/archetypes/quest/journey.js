game.archetypes.quest.journey=function(parent){
	return this.init(parent);
}
game.archetypes.quest.journey.prototype=new game.archetypes.quests();
game.archetypes.quest.journey.prototype.constructor=game.archetypes.quests;

game.archetypes.quest.journey.prototype.init = function(parent){
	game.archetypes.quests.prototype.init.call(this,parent);

	this.type = 'Expected Journey';
	this.id = 'journey';

	this.set_requirements(
		{
			'instigate':1,
			'thornwood':1
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

	return this;
};

game.archetypes.quest.journey.prototype.tick=function(){
	this.check_destination_reached('instigate',this.instigate_location,this.instigate_reached);
	if(this.check_requirement('instigate')) this.check_destination_reached('thornwood','',this.thornwood_reached);
	
	game.archetypes.quests.prototype.tick.call(this);

}
//-------------------
game.archetypes.quest.journey.prototype.begin=function(){
	this.parent.log('First you need to seek out the instigator');
}
game.archetypes.quest.journey.prototype.instigate_reached=function(){
	program.quest.archetype.parent.log(' You\'ve been sent to find the small village of Thornwood');
	return true;
}
game.archetypes.quest.journey.prototype.thornwood_reached=function(){
	//alert('how mnay times');
	program.quest.archetype.parent.log(' You\'ve found Thornwood, this is the end of the quest');
	program.quest.archetype.pawn_factory.inventory.items.berries = 1;	
	return true;
}
