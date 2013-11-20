game.planet=function(type,layer){
	game.actor.call();
	return this.init(type,layer);
};

game.planet.prototype=new game.archetypes.type();
game.planet.prototype.constructor=game.archetypes.type;

game.planet.prototype.init = function(type,layer){
	game.actor.prototype.init.call(this);

	this.name='planet';

	this.archetypes=this.archetypes_group('planet');

	type = (this.archetypes.indexOf(type)!=-1) ? type : this.archetypes[0];//this.random();
	this.archetype = new game.archetypes.planet[type]();
	
	//game.archetypes.type.prototype.create.call(this,type);
	this.archetypes=[];
	this.type = this.archetype.type;

	this.attributes.travel=0;
	this.make_base_attributes();//this can also be used as the max
	this.make_max_attributes();//


	if(layer){//if we have been given a layer to put it, put it
		var con = document.getElementById( layer );
		con.appendChild(this.build_visual_stats());
	}
	
	return this;
};

game.planet.prototype.closest_destination = function(v){
	//get the closest location based on given coordinates.
	var closest = 'unknown';
	var distance = 999;
	/*for(var i=0;i<this.archetype.destinations_archetypes.length;i++){
		var destination_name = this.archetype.destinations_archetypes[i];
		var direction = this.archetype.destinations[destination_name].location.subtract(v);
		var len = direction.length();
		if(len<distance){
			distance = len;
			closest = this.archetype.destinations[destination_name].type;
		}
	}*/
	for(var n in this.archetype.destinations){
		var direction = this.archetype.destinations[n].location.subtract(v);
		var len = direction.length();
		if(len<distance){
			distance = len;
			closest = this.archetype.destinations[n].type;
		}

	}

	return [closest,distance];
}
game.planet.prototype.closest_destination_readable = function(v){
	var destination = this.closest_destination(v);
	return destination[0]+':'+destination[1];
}
//----build the representation of the map
game.planet.prototype.build_visual_stats=function(){

	var wrapper = game.dom.element('div',{'id':'planet_'+this.type,'class':'planet_visual_stats','style':'width:200px'});
	var container = new game.dom.pane('planet_'+this.type,'planet');

	var b0 = game.dom.element('div',{'id':'planet_name','class':'planet_name','style':'clear:right;height:12px;'});
	var b1 = game.dom.element('div',{'id':'planet_current_location','class':'planet_location'});
	//var b2 = game.dom.element('div',{'id':this.name+'_lvl','class':'pawn_lvl','style':'font-size:12px;clear:'+flo_op+';float:'+flo_op});

	b0.innerHTML=this.type+':';
	b1.innerHTML='location unknown';
	//b2.innerHTML='Level:'+this.lvl;

	container.palette.appendChild(b0);
	container.palette.appendChild(b1);
	//container.palette.appendChild(b2);


	this.attributes_visualized = {
		'name':b0,
		'current_location':b1
		//'lvl':b2
	};

	var travel_container = new game.dom.pane('planet_travel_pane','travelling');
	travel_container.module.style.display='none';//go ahead and turn it invisibl
	this.build_visual_bar('travel',travel_container.palette);
	container.palette.appendChild(travel_container.module);



	/*this.build_visual_bar('hp',container.palette);//new game.dom.progressbar(this.name+'_hp','hp',this.round_decimal(this.attributes.hp,10),this.round_decimal(this.attributes_max.hp,10));
	this.build_visual_bar('ap',container.palette);//new game.dom.progressbar(this.name+'_ap','ap',this.round_decimal(this.attributes.ap,10),this.round_decimal(this.attributes_max.ap,10));
	this.build_visual_bar('exp',container.palette);

	//-----more attributes
	var attributes_container = new game.dom.pane(this.name+'_attributes_pane','attributes','',true);

	this.build_visual_bar('at',attributes_container.palette);
	this.build_visual_bar('str',attributes_container.palette);
	this.build_visual_bar('agi',attributes_container.palette);
	this.build_visual_bar('sta',attributes_container.palette);
	this.build_visual_bar('int',attributes_container.palette);
	this.build_visual_bar('fai',attributes_container.palette);
	this.build_visual_bar('wis',attributes_container.palette);

	//attributes_container.appendChild(attributes_title);
	//attributes_container.appendChild(attributes_palette);

	container.palette.appendChild(attributes_container.module);

	//------now give a place for the weapon and armor
	var weapon_container = new game.dom.pane(this.name+'_weapon_pane','weapon');
	weapon_container.palette.appendChild(this.weapon.build_visual_stats(this,ally));
	container.palette.appendChild(weapon_container.module);

	var armor_container = new game.dom.pane(this.name+'_armor_pane','armor');
	armor_container.palette.appendChild(this.armor.build_visual_stats(this));
	container.palette.appendChild(armor_container.module);
	*/
	wrapper.appendChild(container.module);

	return wrapper;
}
//this should be called from the program
game.planet.prototype.tick=function(){
	if(program.character){//first make sure that there is a character
		//find the closest destination to the character to display it here
		var l = document.getElementById( this.attributes_visualized.current_location.id );
		var d = this.closest_destination(program.character.location);
		if(l.innerHTML!=d[0]){//dont bother changing it if it is the same, maybe that will save at least a little time
			l.innerHTML= d[0];
		}

		//if we are travelling turn on the damn thing
		var t = document.getElementById( 'gui_entry_'+this.attributes_visualized.travel.id + '_pane');//get the layer that has the travel bit in it
		if(program.character.distance_to_destination > program.character.distance_travelled){
			//we are indeed travelling
			if(t.style.display == 'none'){//lets set some data when we are first given to this
				t.style.display = 'block';
				this.attributes.travel = program.character.distance_to_destination;
				this.make_base_attributes();//this can also be used as the max
				this.make_max_attributes();//
				this.attributes.travel = program.character.distance_travelled;;
				this.attributes_visualized['travel'].refresh(this.attributes['travel'],this.attributes_max['travel']);
			}else{//now we just update our progress
				//we are still in here even after we are not updating the movement
				this.attributes.travel = program.character.distance_travelled;;
				this.attributes_visualized['travel'].update(this.attributes.travel);
			}
		}else{//hide the traveling layer

			if(t.style.display == 'block') t.style.display = 'none';
		}
		//this.attributes_visualized.current_location.innerHTML='its there;
		//this.closest_destination();

	}
}
