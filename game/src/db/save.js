game.save=function(){//if ally is set to true, i can allow certain styles

	/*-------------
	here I am hard coding to get what I want to save from the program object.
	If in the future I want to save something specific, I need to change what it is I want to save from here
	-------------*/

	return this.bundle(program);
}
game.save.prototype.bundle=function(obj){
	var prune = {'action':'save'};//start off with the save action

	var relevant_character = ['id','lvl','attributes','armor','weapon','vehicle','skill','inventory'];

	var equipped = {};

	for(var member in obj.character){//I want to save character specific data
		if( relevant_character.indexOf(member)!=-1 ){//if this is of relevant data
			var collection = {};
			switch (member){
				case 'armor':
					equipped['armor'] = obj.character.armor.type;
				case 'weapon':
					equipped['weapon'] = obj.character.weapon.type;
				case 'vehicle':
					//equipped['vehicle'] = obj.character.vehicle.type;
					//	collection = 'vehicle';
					//collection = obj.character[member].type;
					for(var sub in obj.character.inventory[member+'s'].d){//i need to save each one
						collection[sub] = this.collect(obj.character.inventory[member+'s'].d[sub],['attributes','count'])
					}
					//collection = this.collect(obj.character.inventory[member+'s'],['type','attributes']);
					break;
				case 'skill':
					//collection = 'skill';
					break;
				case 'inventory':
				//i should make this one explicitly set the 'etc' var ,like the vehicles and armors and weapons one is above
					//collection = this.collect(obj.character[member].items.d,['d']);
					for(var sub in obj.character.inventory['items'].d){//i need to save each one
						collection[sub] = this.collect(obj.character.inventory['items'].d[sub],['count'])
					}
					break;
				default:
					collection = obj.character[member];//attributes, id,lvl
					break;
			}
			prune[member] = JSON.stringify(collection);
		}
	}

	prune['equipped']=JSON.stringify(equipped);

	//------ i also want to save quest relevant information
	var relevant_quest = ['attributes','attributes_aquired','attributes_had','id'];
	var relevant_from_character = ['destination','destination_past','direction_to_destination','distance_to_destination','distance_travelled','location'];//this data i need to grab from the character. the only reason this data exists on the quest object is because it inherits if from actor
	var non_relevant_attributes = ['hp','exp','spd'];//these are redundant variables that come with the class that are not needed
	var non_relevant_destinations = ['add','copy','dot','duplicate','length','multiply_scalar','normalize','set','subtract'];//these are function attaced to destination that I do not want to save
	var collection = {};
	for(member in obj.quest.archetype){
		if( relevant_quest.indexOf(member)!=-1 ){//if this is of relevant data	
			switch(member){
				case 'attributes':
					collection[member] = this.collect(obj.quest.archetype[member],non_relevant_attributes,1);
					break; 
				default:
					collection[member] =  obj.quest.archetype[member];//attributes_aquired, attributes_triggered
					break;
			}
		}
	}
	for(var member in obj.character){//grab the stuff from character as far as location and destination is concerned
		if(relevant_from_character.indexOf(member)!=-1){
			switch(member){
				case 'destination':
				case 'destination_past':
				case 'direction_to_destination':
				case 'location':
					collection[member] = this.collect(obj.character[member],non_relevant_destinations,1);
					break;
				default:
					collection[member] =  obj.character[member];//attributes_aquired, attributes_triggered
					break;
			}
		}
	}
	prune['quest'] = JSON.stringify(collection);
 
	//alert(this.object_to_string(prune));
	return prune;
}
//-------collect specific data

game.save.prototype.collect=function(o,relevant,inverse){//receive the object with armor data, control is if we are sending in NON relevant array 
	var collection = {};
	for(var i in o){
		if(inverse){
			if( relevant.indexOf(i)==-1 ){//if we have found a relevant member
				collection[i]=o[i];
			}
		}else{
			if( relevant.indexOf(i)!=-1 ){//if we have found a relevant member
				collection[i]=o[i];
			}
		}
	}
	return collection;
}
