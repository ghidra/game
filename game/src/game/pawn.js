game.pawn=function(d,layer,ally){//if ally is set to true, i can allow certain styles
	game.actor.call();
	this.init(d,layer,ally);
	return this;

}
game.pawn.prototype=new game.actor();
game.pawn.prototype.constructor=game.actor;

game.pawn.prototype.init = function(d,layer,ally){
	
	game.actor.prototype.init.call(this);

	this.id = d.id;//this is what comes from loading a character from mysql. We only care about this variable for our character for saving purposes

	this.race = new game.race(d.race);
	this.class = new game.class(d.class);

	this.name = (d.name)?d.name:this.race.get_random_name();
	this.lvl = (d.level)?d.level:0;

	this.skill = new game.list(d.skill,this,'skills');//make a list that I can render with my collected skills
	this.vehicle = {};//holder

	this.inventory = new game.inventory(d.inventory,this);
	this.weapon = new game.weapon(d.equipped.weapon,this);//holder for weapon
	this.armor = new game.armor(d.equipped.armor,this);//holder for weapon

	this.purse = new game.purse(this);//a holder for the purse

	this.callback_died = (d.callback_died)?d.callback_died:undefined;//a call back function that can be called when the actor dies
	//in progress
	//this.purse = ;
	//this.vehicle = ;
	//---- this.skill = ;//
	//in progress


	//alert(program.object_to_string(d));
	//if(ally)alert(d.inventory);

	this.attributes.exp = (d.exp)?d.exp:0;//experience points

	this.attributes.ap=3;//action points
	this.attributes.at=10;//action time, time it takes until next move can be done

	this.attributes.str=1;//strength
	this.attributes.agi=1;//agilty
	this.attributes.sta=1;//stamina
	this.attributes.int=1;//intellegence
	this.attributes.fai=1;//faith
	this.attributes.wis=1;//wisdom

	this.states =[
		'walking',
		'driving',
		'riding',
		'swimming',
		'flying',
		'dying',
		'wounded',
		'dead'
	];
	this.state='walking';//set a default state
	
	this.configure_attributes(d.attributes);
	//alert('normal:'+d.attributes);

	this.target = false;//hold pawn that we want to attack
	this.target_group = false;//use for later when having to deal with a group of enemies
	this.last_defeated_actor = {};

	//this.ready_for_action=false;//boolean setting weather we are ready to act

	if(layer){//if we have been given a layer to put it, put it
		var con = document.getElementById( layer );
		con.appendChild(this.build_visual_stats(ally));
	}

	this.ally = (ally)?true:false;

	return this;

}

game.pawn.prototype.configure_attributes=function(set){//this goes through all the loops to set up max attributes set them etc
	this.make_base_attributes();//this can also be used as the max
	this.make_max_attributes();//
	this.level_attributes(set);
}
game.pawn.prototype.level_attributes=function(set){//this goes through all the loops to set up max attributes set them etc
	this.adjust_attributes();
	this.weapon.adjust_pawn_attributes(this);
	this.set_max_attributes();
	this.set_attributes(set);//set the attributes from imported data
}

game.pawn.prototype.adjust_attributes = function(){//here we adjust the values based on all the shit attacehd to this pawn

	game.actor.prototype.adjust_attributes.call(this);

	this.race.archetype.adjust_attributes(this);
	this.class.archetype.adjust_attributes(this);
	//this.inventory.adjust_attributes(this);
	//this.weapon.adjust_attributes(this);

	return true;
}

game.pawn.prototype.tick=function(){
	//alert('ticks');
	//here we need to grow back any bars that might be drained
	if( this.attributes_max.ap-this.attributes.ap>0 ){//we need to grow back the ap points
		this.alter_attribute_value('ap',1/this.attributes.at);//game.brain.framerate.sim_time
		var params = ['ap'];
		this.update_visual_stats(params);
	}

	//check if we can make an action, and if we want to make an action
	if( this.target && this.can_act( this.weapon.archetype.action_cost ) ){
		if(this.target.state!='dead'){
			this.attack(this.target,this.weapon);//there here is the cost of maing the action
		}
	}

	//now we go through out flicks array and tick off any of those
	//we arent making it in here for whatever reason

	for(var i=0; i<this.flicks.length; i++){
		this.flicks[i].tick();
	}
	return true;
}

//--------------------------
game.pawn.prototype.build_visual_stats=function(ally){
	var flo=(ally)?'right':'left';
	var flo_op=(ally)?'left':'right;'

	var character_label = (ally)?'player':'enemy';

	var wrapper = game.dom.element('div',{'id':'pawn_'+this.name,'class':'pawn_visual_stats','style':'width:200px'});
	var container = new game.dom.pane('pawn_'+this.name,character_label);

	var b0 = game.dom.element('div',{'id':this.name+'_name','class':'pawn_name','style':'height:12px;clear:'+flo+';float:'+flo});
	var b1 = game.dom.element('div',{'id':this.name+'_type','class':'pawn_type','style':'height:12px;font-size:12px;clear:'+flo+';float:'+flo});
	var b2 = game.dom.element('div',{'id':this.name+'_lvl','class':'pawn_lvl','style':'font-size:12px;clear:'+flo_op+';float:'+flo_op});

	b0.innerHTML=this.name;
	b1.innerHTML=this.race.type+':'+this.class.type;
	b2.innerHTML='Level:'+this.lvl;

	container.palette.appendChild(b0);
	container.palette.appendChild(b1);
	container.palette.appendChild(b2);

	this.attributes_visualized = {
		'name':b0,
		'type':b1,
		'lvl':b2
	};

	this.build_visual_bar('hp',container.palette);//new game.dom.progressbar(this.name+'_hp','hp',this.round_decimal(this.attributes.hp,10),this.round_decimal(this.attributes_max.hp,10));
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
	this.build_visual_bar('spd',attributes_container.palette);

	//attributes_container.appendChild(attributes_title);
	//attributes_container.appendChild(attributes_palette);

	container.palette.appendChild(attributes_container.module);

	//------now give a place for the weapon and armor
	var weapon_container = new game.dom.pane(this.name+'_weapon_pane','weapon','',true);
	weapon_container.palette.appendChild(this.weapon.build_visual_stats(this,ally));
	//weapon_container.palette.appendChild(this.inventory.weapons[this.weapon].build_visual_stats(this,ally));
	container.palette.appendChild(weapon_container.module);

	var armor_container = new game.dom.pane(this.name+'_armor_pane','armor','',true);
	armor_container.palette.appendChild(this.armor.build_visual_stats(this));
	//armor_container.palette.appendChild(this.inventory.armors[this.armor].build_visual_stats(this));
	container.palette.appendChild(armor_container.module);

	//------now put in the inventory slot if we are an ally
	if(ally){
		//var inventory_container = new game.dom.pane(this.name+'_inventory_pane','invenetory','',true);
		//inventory_container.palette.appendChild(this.inventory.build_visual_stats(this,ally));
		//container.palette.appendChild(inventory_container.module);
		container.palette.appendChild(this.skill.build_visual_stats());
		container.palette.appendChild(this.purse.build_visual_stats());
		container.palette.appendChild(this.inventory.build_visual_stats());
	}


	wrapper.appendChild(container.module);

	return wrapper;
}
/*game.pawn.prototype.build_visual_bar=function(attr,container){//build the progress bar for a specific stat
	var b = new game.dom.progressbar(this.name+'_'+attr,attr,this.round_decimal(this.attributes[attr],10),this.round_decimal(this.attributes_max[attr],10));
	container.appendChild(b.module);
	this.attributes_visualized[attr]=b;
	return true;
}*/

game.pawn.prototype.update_visual_stats=function(identifiers){//identifiers is an array of the ones we want to change
	for(var i in identifiers){
		this.attributes_visualized[identifiers[i]].update(this.attributes[identifiers[i]]);
	}
	return true;
}
game.pawn.prototype.remove_visual_stats=function(){
	var con = document.getElementById( 'pawn_'+this.name );
	con.parentNode.removeChild(con);
}
game.pawn.prototype.recieve_exp=function(v){
	//this.attributes_visualized['travel'].refresh(this.attributes['travel'],this.attributes_max['travel']);

	this.alter_attribute_value('exp',v);

	if(this.attributes.exp>=this.attributes_max.exp){//if the added exp is going to bump us up a level we need to increment and represent everything
		//now update all the other attributes based on level
		//alert(this.attributes_string())
		
		//maybe we should set everything as max values, since we leveled, its the fair thing to do
		//it also might keep my shit from fucking up, since the ap is still adjusting every frame, as well as whatever other values

		this.set_attributes(this.attributes_max);//set it once so nothing fucks up, with smaller values as the game is still updating
		this.level_attributes(this.attributes_max);
		this.set_attributes(this.attributes_max);//then set it again, so that it takes the new values

		//this.configure_attributes
		for(var attr in this.attributes){
			this.attributes_visualized[attr].refresh(this.attributes[attr],this.attributes_max[attr]);	
		}

		//now take care of the exp shit 
		this.lvl+=1;//increment the level
		this.make_exp_attribute();//we need to reset the max and base values with this function
		this.attributes_visualized.exp.refresh(this.attributes.exp,this.attributes_max.exp);
		//now I need to update the characters read out of this level value
		this.attributes_visualized.lvl.innerHTML = 'Level:'+this.lvl;
	}else{
		var params = ['exp'];
		this.update_visual_stats(params);
	}


	return true;
}
//---------------------------------
game.pawn.prototype.can_act=function(points){//return weather or not we can act, based on points needed
	points = (points)?points:0;
	return (this.attributes.ap-points) > 0;
}
game.pawn.prototype.attack=function(actor,attack_type){//actor is whom we are going to attack
	
	//i need to figure out what the cost to attack is, and remove it from the ap

	this.alter_attribute_value('ap',-attack_type.archetype.action_cost);//this.attributes.ap-damage_type;//take the cost from action points

	actor.attacked(this,attack_type);//damage type here needs to include the amount of damage expected to deal

	var params = ['ap'];
	this.update_visual_stats(params);

	return true;
}

game.pawn.prototype.attacked=function(actor,attack_type){//actor is whom attacked us
	//figure out the damage that we will be taking
	//we know how we were attacked, and by whom, now we need to figure out what the damage is
	//attack_type.archetype.damage_type
	var damage = attack_type.archetype.damage_base*actor.attributes.str;

	//damage=2;
	//send the value to subtract to parent function
	game.actor.prototype.attacked.call(this,actor,damage);

	var params = ['hp'];
	this.update_visual_stats(params);

	//this.flicks[this.flicks.length] = new game.flick('palette_info',damage,this,'hp');;//give this to the object so that I can control it 
	//this.flicks_id=this.flicks_id+1;
	
	return true;
}
game.pawn.prototype.died=function(actor){//actor is whom attacked us
	actor.target=false;//remove the target from the object
	this.state='dead';
	this.remove_visual_stats();
	//give exp to the acor that killed me
	actor.recieve_exp(this.lvl*5);
	//now i need to give my inventroy away to my killer
	actor.inventory.give(this.inventory,'items');//right now I am just giving away everything in the etc column
	actor.last_defeated_actor = this;//give the actor this actor as the defeated guy. so that we can save data from it, or better yet, so that a quest can check if we beat a boss, of specific character

	if(this.callback_died)this.callback_died();

	return true;
}
