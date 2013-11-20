game.quest=function(program,type,layer){
	game.actor.call();
	return this.init(program,type,layer);
};

game.quest.prototype=new game.archetypes.type();
game.quest.prototype.constructor=game.archetypes.type;

game.quest.prototype.init = function(program,type,layer){
	game.actor.prototype.init.call(this);

	this.archetypes=this.archetypes_group('quest');

	this.program = program;//doing this so that the reference to this is dynamic
	this.console = undefined;//this is for holding the HTML object that will hold all the text to go over what is going on in the game
	this.layer = layer;

	this.set_quest(type);
	
	return this;
};

game.quest.prototype.set_quest = function(q){
	var t = (this.archetypes.indexOf(q)!=-1) ? q : this.archetypes[0];//this.random();
	this.archetype = new game.archetypes.quest[t](this);
	this.type = this.archetype.type;
	this.id = this.archetype.id;
	if(this.layer){//if we have been given a layer to put it, put it
		var con = document.getElementById( this.layer );
		con.innerHTML='';//remove what is there
		con.appendChild(this.build_visual_stats());
	}
	this.archetype.begin();//trigger the begin function
}

game.quest.prototype.set_saved_quest = function(d){//here I can set the data from a saved character
	if(d){
		//first set the quest
		this.set_quest(d.id);
		//these are the relevant character attributes that need to be set on the character
		var relevant_from_character = ['destination','destination_past','direction_to_destination','distance_to_destination','distance_travelled','location'];//this data i need to grab from the character. the only reason this data exists on the quest object is because it inherits if from actor
		//i need to set all the data that comes with this quest
		for (var a in d){
			if(this.is_object(d[a])){//if this has more attributes to set
				for(var sub_a in d[a]){
					if( relevant_from_character.indexOf(a)==-1 ){
						this.archetype[a][sub_a]=d[a][sub_a];
						if(a==='attributes'){//now we need to update the visual stats for attributes specifically
							this.archetype.attributes_visualized[sub_a].update(d[a][sub_a]);//now this is updating the visual stats for the quest stuff.
						}
					}else{
						this.program.character[a][sub_a]=d[a][sub_a];
					}
				}
			}else{
				if( relevant_from_character.indexOf(a)==-1 ){
					this.archetype[a]=d[a];
				}else{
					//distance to destination, distance travelled
					this.program.character[a]=d[a];
				}
			}
		}
	}
	/*
	"attributes":{"instigate":1,"valhalla":1,"berries":10,"return":0},
	"attributes_aquired":{"berries":1},
	"id":"introduction",
	"location":{"_x":9.372416707864009,"_y":5.5648724202942415},
	"destination":{"_x":32,"_y":19},
	"destination_past":{"_x":0,"_y":0},
	"distance_to_destination":37.21558813185679,
	"distance_travelled":10.899999999999999,
	"direction_to_destination":{"_x":0.8598547438407345,"_y":0.5105387541554361}
	*/
}
game.quest.prototype.is_object=function(i){
	return typeof i === 'object' && i != null;
}

game.quest.prototype.next = function(){
	var i = this.archetypes.indexOf(this.id)+1;
	this.set_quest(this.archetypes[i]);
}

//----build the representation of the map
game.quest.prototype.build_visual_stats=function(){

	var wrapper = game.dom.element('div',{'id':'quest_'+this.type,'class':'quest_visual_stats','style':'width:200px'});
	var container = new game.dom.pane('quest_'+this.type,'quest');

	var b0 = game.dom.element('div',{'id':'quest_name','class':'quest_name'});

	b0.innerHTML=this.type;

	container.palette.appendChild(b0);

	this.attributes_visualized = {
		'name':b0
	};

	//this part holds the quest requirements
	var quest_container = new game.dom.pane(this.type+'_requirements_pane','requirements');
	quest_container.palette.appendChild(this.archetype.build_visual_stats());
	container.palette.appendChild(quest_container.module);

	//stuff for the story to be shown
	this.console = new game.dom.element('div',{'id':'quest_console_'+this.type,'class':'quest_console','style':'font-size:12px;line-height:14px'});
	//this.console.innerHTML = 'what the fuck';

	var console_container = new game.dom.pane(this.type+'_console_pane','log');
	console_container.palette.appendChild(this.console);
	container.palette.appendChild(console_container.module);

	wrapper.appendChild(container.module);

	return wrapper;
}

game.quest.prototype.tick=function(){
	if(program.character){
		if(this.archetype.complete){
			this.next();
		}else{
			this.archetype.tick();//tick the actual archetype
		}
	}
}

game.quest.prototype.log=function(t,append){
	if(append){
		this.console.innerHTML+=this.console.innerHTML+t;
	}else{
		this.console.innerHTML = t;
	}
}