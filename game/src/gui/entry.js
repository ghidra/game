game.dom.entry=function(){
	return this;
}
//---------------------------
game.dom.entry.prototype.make_entry=function(id,label,styles){
	this.act = function(e){return false};//empty function waiting to be assigned
	this.style=this.init_style(styles);
	this.module =  new game.dom.element(
		'li',
		{
			'id':'gui_entry_'+id,
			'class':'gui_entry',
			'style':'width:100%;background-color:white;display:inline-block;vertical-align:top;margin:0 0 '+this.style.margin+' 0px;'
			
		}
	);
	//var bg = new game.dom.element('div',{'id':'gui_entry_title_bg_'+id,'class':'gui_title_bg','style':'background-color:white;width:100%;display:inline-block;'})

	var title = new game.dom.element(
		'div',
		{
			'id':'gui_entry_title_'+id,
			'class':'gui_title',
			'style':'float:left;width:20%;font-size:12px;color:black;'
		}
	);
	
	title.innerHTML=label;
	
	//bg.appendChild(title);
	this.module.appendChild(title);
	this.id=id;
	
	return this;
}

game.dom.entry.prototype.init_style=function(styles){
	//if(styles)
	var styles = {}
	styles.width = 200;
	styles.entry_height=14;
	styles.margin=2;
	return styles;
}
game.dom.entry.prototype.round_decimal=function(v,d){//round to decimal 10=0.1,100=0.01,etc
	return Math.round(v*d)/d;
}

/*game.dom.entry.prototype.duplicate=function(o){//duplicate an dom object i guess
	var new_o={}
	for (n in o){
		new_o[n]=o[n];
	}
	return new_o;
}*/