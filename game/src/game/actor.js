game.actor=function(){
	return this;
}

game.actor.prototype.init=function(){
	this.lvl=0;
	this.attributes = {};
	this.attributes_base={};
	this.attributes_max={};
	this.attributes_visualized={};

	this.attributes.hp=3;//everything has hit points
	this.attributes.exp=0;//experience
	this.attributes.spd=0.1;//the speed this character can travel

	this.flicks=[];//an array to hold any flicks that we might be controlling, created when attacked
	this.flicks_id=0;//a counter to keep up with flicks, since I am shuffling arrays and such

	this.location = new game.vector2(0,0);
	this.destination= new game.vector2();;//where the player is going
	this.destination_past= new game.vector2();;//where the player was
	this.distance_to_destination=0;//the distance it will take to get to current destination
	this.distance_travelled=0;//the distance covered so far
	this.direction_to_destination = new game.vector2();

	return this;
}
game.actor.prototype.configure_attributes=function(set){//this goes through all the loops to set up max attributes set them etc
	//alert(set)
	this.make_base_attributes();//this can also be used as the max
	this.make_max_attributes();//
	this.adjust_attributes();
	//this.weapon.adjust_pawn_attributes(this);
	this.set_max_attributes();//now that we should know the max value of my attributes, I can save them
	this.set_attributes(set);//set the attributes from imported data
}
game.actor.prototype.set_attributes = function(obj){//here we adjust the values based on all the shit attacehd to this pawn
	//here we need to set the value from the imported inf
	for(var prop in obj){
		if (this.attributes.hasOwnProperty(prop)){
			this.attributes[prop]=obj[prop]; 
		}
	}
	//since we only run this after everything has been set up, now is a good time to fix the ext attribute
	this.make_exp_attribute();
	//
	return true;
}
game.actor.prototype.set_max_attributes=function(){
	this.attributes_max=this.make_attributes();
	return true;
}
game.actor.prototype.make_base_attributes=function(){
	this.attributes_base=this.make_attributes();
	return true;
}
game.actor.prototype.make_max_attributes=function(){
	this.attributes_max=this.make_attributes();
	return true;
}
game.actor.prototype.make_attributes=function(){//this is more or less a function that dups attributes to save in other objects
	var o = {};
	for(var prop in this.attributes){
		o[prop] = this.attributes[prop];
	}
	return o;
}
game.actor.prototype.make_exp_attribute=function(){//this specifically handles ho the exp is incremented for each level as well as sets the max
	var mult = (this.lvl+1)*(this.lvl+1);//multiplier for what level we are
	var epl = 10.0*(this.lvl+1);//experience per level. The value that we need to use to multiply against the mult to know how many points we need to level

	this.attributes_base.exp = this.lvl*epl;
	this.attributes_max.exp = mult*epl;

	if(this.attributes.exp<this.attributes_base.exp) this.attributes.exp = this.attributes_base.exp;  
}

game.actor.prototype.adjust_attributes=function(){
	this.adjust_attribute_value('hp', ((this.lvl*0.2)+1));
	return true;
}
game.actor.prototype.adjust_attribute_value=function(prop,multiplier){
	//alert(this.name)
	if (this.attributes.hasOwnProperty(prop)){
		var addition = this.attributes_base[prop] * multiplier ; //(base hp * math) - base hp 
		this.alter_attribute_value(prop,addition);
	}
	return true;
}
///------
game.actor.prototype.build_visual_stats=function(pawn,ally,actor_type){//so far used by weapon and armor, pawns have thier own build_visual_stats
	var flo=(ally)?'right':'left';
	var flo_op=(ally)?'left':'right;'

	var container = game.dom.element('div',{'id':actor_type+'_'+pawn.name,'class':actor_type+'_visual_stats','style':'width:200px'});

	var b0 = game.dom.element('div',{'id':actor_type+'_name_'+pawn.name,'class':actor_type+'_name','style':'height:12px;clear:'+flo+';float:'+flo});
	var b1 = game.dom.element('div',{'id':actor_type+'_lvl_'+pawn.name,'class':actor_type+'_lvl','style':'font-size:12px;clear:'+flo_op+';float:'+flo_op});

	b0.innerHTML=this.type;
	b1.innerHTML='Level:'+this.lvl;

	container.appendChild(b0);
	container.appendChild(b1);

	this.attributes_visualized = {
		'type':b0,
		'level':b1
	};

	this.build_visual_bar('hp',container);//new game.dom.progressbar(this.name+'_hp','hp',this.round_decimal(this.attributes.hp,10),this.round_decimal(this.attributes_max.hp,10));
	this.build_visual_bar('exp',container);

	return container;
}
game.actor.prototype.build_visual_bar=function(attr,container){//build the progress bar for a specific stat
	var b = new game.dom.progressbar(this.name+'_'+attr,attr,this.round_decimal(this.attributes[attr],10),this.round_decimal(this.attributes_max[attr],10));
	container.appendChild(b.module);
	this.attributes_visualized[attr]=b;
	return true;
}
//------------------
//this is here more for basic addition and subtraction
game.actor.prototype.alter_attribute_value=function(prop,add){
	if (this.attributes.hasOwnProperty(prop)){
		this.attributes[prop] = this.attributes[prop] + add;
	}
	return true;
}
//---
//THIS FUNCTION IS OBSOLETE NOW, IT IS IN THE FRAMWORK FILE
game.actor.prototype.round_decimal=function(v,d){//round to decimal 10=0.1,100=0.01,etc
	return Math.round(v*d)/d;
}
//------------------------
game.actor.prototype.set_destination=function(d){//set the new destination
	this.destination_past = this.location;//program.planet.closest_destination(this.location)[0];//where the player was
	this.destination = d;//where the player is going

	//var dir = program.planet.archetype.destinations[d].location.subtract(this.location);//get the direction vector to the destination
	var dir = d.subtract(this.location);//get the direction vector to the destination

	this.direction_to_destination.copy(dir);
	this.direction_to_destination = this.direction_to_destination.normalize();
	this.distance_to_destination=dir.length();
	
	return true;
}
game.actor.prototype.reset_travel=function(){
	this.distance_travelled=0;
	this.distance_to_destination=0;
	this.direction_to_destination = new game.vector2();
}
game.actor.prototype.get_remaining_travel_distance=function(){//get the remaining travel distance to destination
	return this.distance_to_destination-this.distance_travelled;
}
game.actor.prototype.advance_travel=function(){//advace toward destination
	var speed = this.attributes.spd;
	var remain = this.get_remaining_travel_distance();

	if( remain < speed ){ //just go ahead and put it where it needs to be
		////this.location = program.planet.archetype.destinations[this.destination].location.duplicate();
		this.location = this.destination.duplicate();
		this.distance_travelled = this.distance_to_destination+0;
	}else{
		this.location = this.location.add(this.direction_to_destination.multiply_scalar(speed));
		////this.distance_travelled = this.distance_to_destination - this.location.subtract(program.planet.archetype.destinations[this.destination].location).length();
		this.distance_travelled = this.distance_to_destination - this.location.subtract(this.destination).length();
	}
	return true;
}
//------------------------
game.actor.prototype.attacked=function(actor,damage){//actor is whom attacked us
	if(this.attributes.hp>0){
		this.alter_attribute_value('hp',-(damage));//the damage type here is expected to be the damge dealt
		
		//add the flck to the scene to show the damage that was dealt
		
		//get the container to put it in
		//make the flick with the right data
		//put it in the containor
		//figure out a way to animate it, fade it off etc
	}else{
		this.attributes.hp=0;
		this.died(actor);
	}
	return true;
}
game.actor.prototype.died=function(actor){
	//'i am dead';
	return true;
}
//---------------------
game.actor.prototype.collect=function(o,relevant,inverse){//receive the object with armor data, control is if we are sending in NON relevant array 
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
/*game.actor.prototype.attributes_array=function(){
	//this just returns the attributes object as an array of attribute identifiers so that I can send it to the configure_attributes function
	var array = [];
	for(var attr in this.attributes){
		array.push(attr);
	}
	return array;
}*/
/*game.actor.prototype.attributes_string=function(){
	var attributes = '{';
	for (var attr in this.attributes){
		attributes+='"'+attr+'":'+this.attributes[attr]+',';
	}
	attributes=attributes.substring(0,attributes.length-1);
	attributes+='}';
	return attributes;
}*/
