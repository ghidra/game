game.archetypes.quest.where_am_i=function(parent){
	return this.init(parent);
}
game.archetypes.quest.where_am_i.prototype=new game.archetypes.quests();
game.archetypes.quest.where_am_i.prototype.constructor=game.archetypes.quests;

game.archetypes.quest.where_am_i.prototype.init = function(parent){
	game.archetypes.quests.prototype.init.call(this,parent);

	this.type = 'where am i';
	this.id = 'where_am_i';

	this.set_requirements(
		{
			'investigate':1,//search around for supplies
			'coconut':2,
			'berries':2,
			'boss':1 //boss
		}
	);

	//----enemies
	this.spawn_pawn = 
		{
			'race':['lizard','caveman'],
			'class':['warrior'],
			'inventory':{
				'weapons':{},
				'armors':{},
				'items':{'money':{'count':1}}
			}
		};

	_this = this;
	this.spawn_boss = 
		{
			'race':['lizard'],
			'class':['warrior'],
			'name':'lizard breath',
			'lvl':10,
			'inventory':{
				'weapons':{},
				'armors':{},
				'items':{'money':{'count':1}}
			},
			'callback_died':_this.boss_defeated
		};

	this.investigate_location =  new game.vector2(10,-3);//new game.archetypes.destination.arbitrary( new game.vector2(10,21),'return');
	this.pawn_factory.set(this.spawn_pawn);
	return this;
};

//---------------------------------
/*
check_destination_reached
	checks if we have made it to this destination at least once, or if it was saved as complete
	moves toward destination if we hve not
	----------used to move

attributes_triggered
	if a requirement has been reached, the trigger is flipped.
	when we see that we run a function and flip it back, so that this runs only once
	when the requirement has been reached
	----------used to run some code once after a requirement has been reached

check_requirement
	check to see if a requirement is met
	-------used to determine if a requirement is fullfilled 

trigger requirement
	used to trigger a call back once after a requirement has been met
*/
game.archetypes.quest.where_am_i.prototype.tick=function(){
	if(!this.attributes_triggered['investigate']) this.check_destination_reached('investigate',this.investigate_location,this.investigate_reached);
	if(this.check_requirement('coconut') && this.check_requirement('berries')) {
		this.trigger_requirement('berries',this.survival_reached)
		//now we can make the lizard man attack
		//this.trigger_requirement('boss',this.boss_defeated);
	}
	//if(program.character.last_defeated_actor.name == 'lizard breath'){
	//	this.trigger_requirement('boss',this.boss_defeated);
	//}

	game.archetypes.quests.prototype.tick.call(this);

}
//-------------------
game.archetypes.quest.where_am_i.prototype.begin=function(){
	this.parent.log('Where am I?');
}
game.archetypes.quest.where_am_i.prototype.investigate_reached=function(){
	//alert('come one');
	program.quest.archetype.parent.log(' You\'ve found a decent spot to set up camp');
	//program.quest.archetype.pawn_factory.inventory.items.berries = 0.8;
	//program.quest.archetype.pawn_factory.inventory.items.coconuts = 0.8;	
	program.quest.archetype.pawn_factory.inventory.items.berries=new game.archetypes.item.berries(0.8);
	program.quest.archetype.pawn_factory.inventory.items.coconut=new game.archetypes.item.coconut(0.6);
	return true;
}
game.archetypes.quest.where_am_i.prototype.survival_reached=function(){
	//alert('how mnay times');
	program.quest.archetype.parent.log(' You\'ve found enough food to last you a little while');
	//now we need to change the pawn factory to the one with lizard man to initiate the attack
	program.quest.archetype.pawn_factory.set(program.quest.archetype.spawn_boss);	
	return true;
}
game.archetypes.quest.where_am_i.prototype.boss_defeated=function(){
	program.character.skill.give_object({'fire':new game.archetypes.skill.fire()});
	//so i am getting the fire object, however, it gets a NaN and not showing up in the d array
	program.quest.archetype.update_bool_requirements('boss');
	//alert('you defeated the boss');
}
