game.list=function(d,parent,id){//this is a list of item, used in inventory and in skill and a list to hold anything that is grouped
	this.init(d,parent,id);
	return this;
}
game.list.prototype.init = function(d,parent,id){
	this.d = d;//this is the data being converted
	this.id = id;
	this.label = id;
	this.parent = parent;
	this.container = undefined;

	this.attributes_visualized = {};//an empty object to hold all my html representations of each item in the inventory, so that I can update the html easily
}

game.list.prototype.build_visual_stats=function(){//called from the pawn classes own build_visual_stats function
	var wrapper = game.dom.element('div',{'id':this.id+'_inventory','class':'inventory_visual_stats','style':'width:200px'});
	this.container = new game.dom.pane(this.id+'_inventory_pane',this.label, '',true);

	for(var v in this.d){
		this.build_visual_item(v,this.d[v]);
	}

	wrapper.appendChild(this.container.module);

	return wrapper;
}
game.list.prototype.build_visual_item=function(item,amount,add){//this makes an entry in the appropriate group
	//this is called from thr above function
	//it looks like this creates the drop down header bars basically, because if i disable this i dont get this lovely things
	//doesnt totally make sense to me, but shit is nutty at this point
	amount = (this.is_object(amount))?amount.count:amount;//is amount is an object look at the count variable

	var new_selectable_item = new game.dom.inventory_item(this.id+'_inventory_item_'+item,item,amount); 
	this.container.palette.appendChild(new_selectable_item.module);
	if(add) this.d[item]=amount;
	this.attributes_visualized[item] = new_selectable_item;
	
}

game.list.prototype.give=function(da){//called from the pawn class when it dies, gives whatever is in this object to this actor
	//i am probabl going to have to account for object style inventory items like weapons 
	//when giving items, because of the fact that the value is in count
	if(da){//if we even have anything to give, otherwise ignore errythang
		for(var v in da){//now we are dealing in an individual basis here, each item in the inventory
			//now i need to determine if i even need to give one out based on probability
			var give = true;
			if(da[v].count<1){//if the value is under 1, then it is a probability value, that is from NPCs
				give = false;
				if(Math.random()<=da[v].count){//if we have decided randomly to give this out, lest do so
					give = true;
				}
			}
			if(give){
				var rounded = Math.ceil(da[v].count);//round it incase we are an NPC
				if(this.d[v]){//if we already have one of these
					this.d[v].count += rounded;//increment the value
					this.attributes_visualized[v].update(this.d[v].count);
				}else{//we need to add it totally to the inventory, and add the object to the list
					//this.d[v] = new game.archetypes[this.label.slice(0,-1)][v];
					var o = new game.archetypes[this.label.slice(0,-1)][v];
					this.build_visual_object(v,o,true)
				}
			}
		}
	}
}

///skill related, or giving an object to a list
//looks like this is being used for everything now, since everything is going to be an object
game.list.prototype.build_visual_object=function(i,obj,add){
	//this is also a overridden function from the list class because we dont need a value, we need an objec to be saved
	var v = (add)?obj.count:'';
	var new_selectable_item = new game.dom.inventory_item(this.id+'_inventory_item_'+i,i,v); 
	this.container.palette.appendChild(new_selectable_item.module);
	this.attributes_visualized[i] = new_selectable_item;
	if(!this.is_object(this.d))this.d={};
	this.d[i]  = obj;
}

game.list.prototype.give_object=function(da){
	//need this specifically for giving the skill list a new skill
	if(da){//if we even have anything to give, otherwise ignore errythang
		for(var v in da){//now we are dealing in an individual basis here, each item in the inventory
				this.build_visual_object(v,da[v])
		}
	}
}
//------
game.list.prototype.is_object=function(i){
	return typeof i === 'object' && i != null;
}