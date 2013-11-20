game.archetypes={};

game.archetypes.race={};
game.archetypes.class={};

game.archetypes.weapon={};
game.archetypes.armor={};
game.archetypes.item={};//for inventory
game.archetypes.skill={};//skills for use, magic, special attacks etc
game.archetypes.vehicle={};//vehicle types
game.archetypes.damage_type={};//type of damage to deal

game.archetypes.planet={};
game.archetypes.destination={};
//game.archetypes.business={};

game.archetypes.quest={};//for our quests


//------------------------------
//base class of what and archtype is part of, basically the above types, race class etc
//------------------------------
//this is also kind of like an actor with out the representation needed, works good for race and class and damage type, or mahybe in the end just damage type

game.archetypes.type=function(){//i used to have type in here
	this.archetype = new game.archetypes.object();//i have to give is something to go on
	//return this.create(type);
	return this;
}
game.archetypes.type.prototype=new game.actor();
game.archetypes.type.prototype.constructor=game.actor;

game.archetypes.type.prototype.init=function(type){
	this.archetypes=[];
	this.type = this.archetype.type;
	return this;
}
game.archetypes.type.prototype.random=function(){//get a random class
	return  this.archetypes[ Math.floor(Math.random()*this.archetypes.length)];
};
//wrapper functions
game.archetypes.type.prototype.adjust_pawn_attributes=function(pawn){//wrapper function, used by race, class, weapin, and item so far
	this.archetype.adjust_pawn_attributes(pawn);
	return true;
}
game.archetypes.type.prototype.get_random_name = function(type){
	return this.archetype.get_random_name();
}
game.archetypes.type.prototype.archetypes_group = function(group){
	//this grabs the object that are created for each game phyisical object and gives us a list of them all
	var a = [];
	var o = game.archetypes[group];
	for(var i in o){
		if(o.hasOwnProperty(i)){
			a.push(i);
		}
	}
	return a;
}

//--------------------------------
//an extension of the 'type' object that is for weapons armor and vehicles
//this is the wrapper object, the actual weapon and armors and things are just archetypes.object	
//this is very similar to the above, type, class

game.archetypes.physical=function(){
	game.actor.call();
	this.archetype = new game.archetypes.object();//i have to give is something to go on
	return this;
}
game.archetypes.physical.prototype=new game.actor();
game.archetypes.physical.prototype.constructor=game.actor;

game.archetypes.physical.prototype.init=function(type,pawn,group){
	game.actor.prototype.init.call(this);

	this.parent = pawn;
	this.group=group;
	this.count=1;

	//if we do not have a weapon, this is the first time set up to give the weapon to inventory
	if(this.parent.inventory[group+'s'].d[type]==undefined){//if we do not have a type, this is the first time set up to give the weapon to inventory
		this.parent.inventory[group+'s'].d[type] = this.collect(this,['attributes','count']);
	}

	//type = (this.archetypes.indexOf(type)!=-1) ? type : 'bare_hands';//this.random();
	this.archetype = new game.archetypes[group][type]();

	this.archetypes=[];
	this.type = type;//this.archetype.type;

	this.make_base_attributes();//this can also be used as the max
	this.adjust_attributes();
	this.make_max_attributes();
	if(this.parent.inventory[group+'s'][type]){
		this.set_attributes(this.parent.inventory[group+'s'][type].attributes);
		this.count=this.parent.inventory[group+'s'][type].count;
	}

	return this;
}
game.archetypes.physical.prototype.adjust_pawn_attributes=function(pawn){//wrapper function, used by race, class, weapin, and item so far
	this.archetype.adjust_pawn_attributes(pawn);
	return true;
}

game.archetypes.physical.prototype.build_visual_stats = function(pawn,ally){
	return game.actor.prototype.build_visual_stats.call(this,pawn,ally,this.group);
}
game.archetypes.physical.prototype.archetypes_group = function(){
	//this grabs the object that are created for each game phyisical object and gives us a list of them all
	var a = [];
	var o = game.archetypes[this.group];
	for(var i in o){
		if(o.hasOwnProperty(i)){
			a.push(i);
		}
	}
	return a;
}
//--------------------------------

//------------------------------
//base class for anything that is an archetype in this game
//------------------------------

game.archetypes.object=function(){
	 return this.init();
}
game.archetypes.object.prototype.init=function(type){
	this.type = type;
	this.count = 1;
	return this;
}
game.archetypes.object.prototype.adjust_attributes=function(pawn){
	return true;
}
game.archetypes.object.prototype.get_random_name=function(){//this one is not used by class at the moment, not sure it will need to be
	return 'no name';
}

//-----------------------------
//Here is the base class for all quests
//-----------------------------
game.archetypes.quests=function(){
	return this;
}
game.archetypes.quests.prototype=new game.actor();
game.archetypes.quests.prototype.constructor=game.actor;
game.archetypes.quests.prototype.init=function(parent){
	game.actor.prototype.init.call(this);
	this.type = 'unknown';
	this.parent = parent;
	this.complete = false;
	this.fighting = false;//flag for when fighting or not

	this.pawn_factory = new game.pawn_factory({},this.parent.program.character,'palette_character_enemy');

	this.attributes_aquired = {};
	this.attributes_had = {};
	this.attributes_triggered = {};//for when the requirementshas been used to log something to the console on completion, so i only do it once

	this.attributes_ignore = ['exp','hp','spd'];//ignore the base attributes that are inherited from the actor class

	this.rewards=[];//what you get for completion

}
game.archetypes.quests.prototype.begin=function(){
	return true;
}
game.archetypes.quests.prototype.set_requirements=function(a,sa){//attributes and saved attributes
	for(var r in a){//make the attributes
		this.attributes[r]=a[r];
		//-----now we set up the variables to account for items already had in inventory, so they are not counted toward fullfilling the quest
		//only deal with items that require more than 1. needing one is just a boolean
	 	if(a[r]>1){
	 		this.attributes_aquired[r]=0;
	 		this.attributes_had[r]=(this.parent.program.character.inventory.items[r])?this.parent.program.character.inventory.items[r].count:0;
	 	}
	 	this.attributes_triggered[r]=false;
	}
	this.make_max_attributes();
	for(var r in a){//now set them all to 0
		this.attributes[r]=0;
	}
	this.set_attributes(sa);
}
game.archetypes.quests.prototype.check_destination_reached=function(dest,loc,callback){

	/*
	we only bother checking if we havent already made it

	if we have not made it
		make sure we have set the destination
		if we are not near it
			move toward it
		if we have reached it
			update quest parameters
			callback function
	else it is a saved completed part of the quest
		set the variables that reflect that fact

	*/

	if(this.attributes[dest]<1 && this.complete==false){//only check if we havent made it already at least once
		var ch = this.parent.program.character;
		var d = this.parent.program.planet.closest_destination(ch.location);

		//if( d[0]!=dest && ch.distance_travelled<=0){//if we are not near it, and if we have not set the destination yet
		if( ch.distance_travelled<=0){
			var l = (typeof(loc)=='string')?this.parent.program.planet.archetype.destinations[dest].location:loc;
			ch.set_destination( l );//set destination
		}

		//now if we are not there yet move it
		if(ch.get_remaining_travel_distance()>0 && this.attributes[dest]<1){//we have not reached the destination yet
			if(this.fighting==false){//as long as we are not fighting, we can advance
				ch.advance_travel();
			}
		}else{//we've reached the destination, set the value
			this.attributes[dest]=1;
			this.attributes_visualized[dest].update(this.attributes[dest]);
			this.attributes_triggered[dest] = true;

			ch.reset_travel();
			//now we can also give the pawn factory berries to start dropping
			//this.pawn_factory.inventory.items.berries = 1;
			callback();
		}
	}else{//this is a saved value, and we have already accoplished this, we need to set the data to reflect it
		this.attributes_visualized[dest].update(this.attributes[dest]);
		this.attributes_triggered[dest] = true;
		callback();		
	}
}
game.archetypes.quests.prototype.trigger_requirement=function(req,callback){//used to call back once
	if(this.attributes_triggered[req]==false){
		this.attributes_triggered[req]=true;
		callback();
	}
}
game.archetypes.quests.prototype.tick_pawn_factory=function(){
	//control the pawn factory
	if(this.fighting==false){
		if( Math.random() < 0.01 ){
			this.fighting = true;
		}
	}
	if(this.fighting){
		if(this.pawn_factory.spawns_killed==false){
			this.pawn_factory.tick();
		}else{
			this.fighting=false;
			this.pawn_factory.spawns_killed=false;
		}
	}
}
game.archetypes.quests.prototype.update_inventory_requirements=function(){//this checks that all the requirements have been met, and if so, ,dols out the rewards
	var ch = this.parent.program.character;//this is calling the dynamic refernce to thie program. not the actual object program at the root during nuilding this

	for(var attr in this.attributes){//search requirements

		//i need to check if this attribute is not part of the irrelevant ones, bcause those are not objects and will break the chain
		//also check that I have any at all, and that the atttribute exists before touching it, otherwise it breaks the code

		if(this.attributes_ignore.indexOf(attr)<0 && ch.inventory.items.d[attr] && this.attributes_max[attr]>1){//only give a shit about the requirements that are not booleans, and thus inventory related
			//looking at the object in items portion of our inventory object
			//alert(attr + ':' +ch.inventory.items.d[attr]);
			var b = ch.inventory.items.d[attr].count;
			var a = (b)?b:0;
			var n = a-this.attributes_had[attr];
			if(n>0 && this.attributes[attr]<this.attributes_max[attr]){//if we have more berries
				this.attributes_aquired[attr] = n+0;
				this.attributes_had[attr] = a+0;
				this.attributes[attr]+=n;
				this.attributes_visualized[attr].update(this.attributes[attr]);
			}
		}
	}

}
game.archetypes.quests.prototype.update_bool_requirements=function(attr){
	this.attributes_aquired[attr] = 1;
	this.attributes[attr]=1;
	this.attributes_visualized[attr].update(this.attributes[attr]);
}
game.archetypes.quests.prototype.check_requirement=function(req){//this checks if a specific requirements has been met
	return this.attributes[req]>=this.attributes_max[req];
}
game.archetypes.quests.prototype.check_requirements=function(){//this checks that all the requirements have been met, and if so, ,dols out the rewards
	var done = true;
	for(var r in this.attributes){
		if(r!='exp'){//we need to ignore the exp varible
			if(this.attributes[r] < this.attributes_max[r]){
				done = false;
				break;
			}
		}
	}
	if(done){
		//alert('you finished quest: '+this.type);
		this.complete=true;
	}
}
game.archetypes.quests.prototype.tick=function(){//this checks that all the requirements have been met, and if so, ,dols out the rewards
	this.tick_pawn_factory();//tick the pawn factory
	this.update_inventory_requirements();//now check and see if we have gained any new berries in our travels, update any requirements that are inventory related
	this.check_requirements();///now chec to see if we have met all the requirements for the quest, if so, remove the quest and give up the rewards
}
game.archetypes.quests.prototype.build_visual_stats=function(){
	var container = game.dom.element('div',{'id':this.type+'_requirements','class':'quest_requirements_visual_stats','style':'width:200px'});
	for(var r in this.attributes){
		if(this.attributes_ignore.indexOf(r)<0){
			this.build_visual_bar(r,container);
		}
	}
	return container;
}