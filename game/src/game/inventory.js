game.inventory=function(d,pawn){
	this.init(d,pawn);
	return this;
}

game.inventory.prototype=new game.list();
game.inventory.prototype.constructor=game.list;

game.inventory.prototype.init=function(d,pawn){//give them the things
	game.list.prototype.init.call(this,d,pawn,pawn.name+'_inventory');

	this.label = 'inventory';
	this.weapons = new game.list(d.weapons,this,'weapons');//(d.weapons)?d.weapons:{};
	this.armors = new game.list(d.armors,this,'armors');//(d.armors)?d.armors:{};
	this.vehicles = new game.list(d.vehicles,this,'vehciles');//(d.vehicles)?d.vehicles:{};
	this.items = new game.list(d.items,this,'items');//(d.items)?d.items:{};
	//i have to put these here, because other obects are expecting these to already be here, instead of dynamically creating them
}

game.inventory.prototype.build_visual_item=function(item,d){//this is the function called that builds the 'button'
	//im not even using d, since I save it earlier
	//var sub_inventory = new game.dom.pane(this.id+'_inventory_pane_'+item,item+' inventory');
	var sub_inventory = this[item].build_visual_stats();

	this.container.palette.appendChild(sub_inventory);
	this.attributes_visualized[item] = sub_inventory;
}
game.inventory.prototype.give=function(da,group){//called from the pawn class when it dies, gives whatever is in this object to this actor
	this[group].give(da[group].d);
}