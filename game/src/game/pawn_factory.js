game.pawn_factory=function(d,world,layer){
	game.actor.call();
	this.init(d,world,layer);
	return this;
}
game.pawn_factory.prototype=new game.actor();
game.pawn_factory.prototype.constructor=game.actor;

game.pawn_factory.prototype.init=function(d,world,layer){

	game.actor.prototype.init.call(this);

	this.world = world;
	this.layer = layer;

	this.callback_died = undefined;//a placeholder for possible function incase we want to call it

	//before setting everything, convert the inventory data so that it only happens once instead of everytime
	if(!this.inventory_converted){
		d.inventory = this.convert_inventory(d.inventory);
	}

	//---------------------------

	this.set(d);

	//---------------------------

	//this.equipped = {'weapon':this.get_key(game.archetypes.weapon),'armor':this.get_key(game.archetypes.armor)};//d.equipped; //game.archetypes.weapon[0],game.archetypes.armor[0]

	this.current_spawn=[];//this is the current spawned enmies. if empty we can spawn again
	this.spawns_killed = false;//if we are allowed to spawn

	return this;
}
//this is to convert the basic inventory set up to objects of archetypes. and we only want to do it once.
//because when i update later based on characters level I want to make sure that I dont keep converting this data
game.pawn_factory.prototype.convert_inventory=function(d){
	var converted = {};
	for (var group in d){//this should be weapons, armor and items, loop through each of those first
		if(game.archetypes[group.slice(0,-1)]){
			converted[group]={};
			for (var single in d[group]){//now we are delaing on on individual item basis, which should also be a list, of object
				//first i should make sure that the object exist before trying to make one
				if(game.archetypes[group.slice(0,-1)][single]){
					converted[group][single]= new game.archetypes[group.slice(0,-1)][single];
					for(var attr in d[group][single]){//now go through the attributes and assign them
						converted[group][single][attr]=d[group][single][attr];
					}
				}
			}
		}
	}
	this.inventory_converted=true;
	return converted;
}

//this set function alows us to put new data to spawn with, without replacing the spawn factory, instead just changing the values
game.pawn_factory.prototype.set=function(d){
	this.callback_died = (d.callback_died)?d.callback_died:undefined;

	this.race = (d.race)?d.race:[ this.get_key(game.archetypes.race) ];
	this.class = (d.class)?d.class:[ this.get_key(game.archetypes.class) ];

	this.name = (d.name)?d.name:'';
	if(d.lvl){//if we explicitly set a level then we might want to keep it as such and not make it change as character levels
		this.lvl=d.lvl;
		this.persistant_level=true;
	}else{//otherwise set it to the character, and allow it to dynamically change
		this.lvl = this.world.lvl+(Math.round(Math.random()*2));
		this.persistant_level=false;
	}

	this.skill = (d.skill)?d.skill:[];//make a list that I can render with my collected skills
	this.vehicle = (d.vehicle)?d.vehicle:[];//holder

	this.inventory = d.inventory;

	//--------working on inventory shit right here
	//this.inventory = (d.inventory)?d.inventory:[];
	//i need to give the spawn items from the list that is passed here, adn convert it to objects
	/*this.inventory={};
	for (var group in d.inventory){//this should be weapons, armor and items, loop through each of those first
		if(game.archetypes[group.slice(0,-1)]){
			this.inventory[group]={};
			for (var single in d.inventory[group]){//now we are delaing on on individual item basis, which should also be a list, of object
				//first i should make sure that the object exist before trying to make one
				if(game.archetypes[group.slice(0,-1)][single]){
					this.inventory[group][single]= new game.archetypes[group.slice(0,-1)][single];
					for(var attr in d.inventory[group][single]){//now go through the attributes and assign them
						this.inventory[group][single][attr]=d.inventory[group][single][attr];
					}
				}
			}
		}
	}*/
	//-------------------------------------

	this.weapon = (d.weapon)?d.weapon:[ this.get_key(game.archetypes.weapon) ];//holder for weapon
	this.armor = (d.armor)?d.armor:[ this.get_key(game.archetypes.armor) ];//holder for weapon

	//this.purse =d.purse;//a holder for the purse

	this.equipped=(d.equipped)?d.equipped:{'weapon':this.get_key(game.archetypes.weapon),'armor':this.get_key(game.archetypes.armor)};
}


game.pawn_factory.prototype.tick=function(){
	if(this.current_spawn.length==0){//we can spawn a baddie
		if(this.persistant_level==false) this.lvl = this.world.lvl+(Math.round(Math.random()*2));//update the level of this factory
		this.current_spawn[0] = new game.pawn({
			'race':this.choose_random(this.race),
			'class':this.choose_random(this.class),
			'name':this.name,
			'level':this.lvl,
			'equipped':this.equipped,
			'inventory':this.inventory,
			'skill':this.skill,
			'vehicle':this.vehicle,
			'weapon':this.choose_random(this.weapon),
			'armor':this.choose_random(this.armor),
			'callback_died':this.callback_died
		},this.layer);

		this.world.target=this.current_spawn[0];

		//this.spawn=true;

	}else{//we have spawns, lets find them
		var con = document.getElementById('pawn_'+this.current_spawn[0].name);
		if(!con){//if we dont find a spawn when we should, clear out the current spawn array
			this.current_spawn=[];
			this.spawns_killed=true;
		}else{
			this.current_spawn[0].tick();
		}
	}
	return true;
}


//---utility functions
//THIS FUNCTION IS OBSOLETE NOW, IN FRAMEWORK, object just needs to call first()
game.pawn_factory.prototype.get_key=function(obj){//this function is to get the first value of an archetype object, like weapons, so that I can set it dynamically without having to manually put it here
	var k = '';
	for (var key in obj){
		k = key;
		break;
	}
	return k;
}

//-----
game.pawn_factory.prototype.choose_random=function(a){//picks a random value from an array of possible choices
	var i = Math.round(Math.random()*(a.length-1));
	return a[i];
}