game.dom.inventory_item=function(id,label,d,style){
	return this.make(id,label,d,style);
}
game.dom.inventory_item.prototype=new game.dom.entry();
game.dom.inventory_item.prototype.constructor=game.dom.entry;

game.dom.inventory_item.prototype.make=function(id,label,d,styles){
	this.make_entry(id,label,styles);

	this.id = id;
	
	this.value = new game.dom.element('div',{'id':'value_'+id,'class':'inventory_item','style':'float:right;font-size:12px;height:12px'});
	this.value.innerHTML = d;

	this.module.appendChild(this.value);

	return this;
}

//----overwrite the inhrited make_entry function here
//---------------------------
game.dom.inventory_item.prototype.make_entry=function(id,label,styles){
	this.act = function(e){return false};//empty function waiting to be assigned
	this.style=this.init_style(styles);
	this.module =  new game.dom.element(
		'div',
		{
			'id':'gui_entry_'+id,
			'class':'gui_entry',
			'style':'width:100%;vertical-align:top;clear:both;'
			
		}
	);
	//var bg = new game.dom.element('div',{'id':'gui_entry_title_bg_'+id,'class':'gui_title_bg','style':'background-color:white;width:100%;display:inline-block;'})

	this.title = new game.dom.element(
		'div',
		{
			'id':'gui_entry_title_'+id,
			'class':'gui_title',
			'style':'float:left;font-size:12px;margin:0 0 '+this.style.margin+' 0px;height:12px'
		}
	);
	
	this.title.innerHTML=label;
	
	//bg.appendChild(title);
	this.module.appendChild(this.title);
	this.id=id;
	
	return this;
}

game.dom.inventory_item.prototype.update=function(v){
	var val = document.getElementById('value_'+this.id);
	if(val) val.innerHTML = v;
}
