game.dom.pane=function(id,label,style,hide){
	return this.make(id,label,style,hide);
}
game.dom.pane.prototype=new game.dom.entry();
game.dom.pane.prototype.constructor=game.dom.entry;

game.dom.pane.prototype.make=function(id,label,styles,hide){
	this.make_entry(id,label,styles);
	//this.styles_margin = this.style.margin;

	//var title =  game.dom.element('div',{'id':id+'_title_','class':'pane_title','style':'background-color:339966'},label);
	var dis = (hide)?'none':'block';

	this.palette = game.dom.element('div',{'id':id+'_palette','class':'pane_palette','style':'display:'+dis});	
	this.module.appendChild(this.palette);

	this.title.onclick=function(){
		var obj = document.getElementById(id+'_palette');
		if(obj.style.display=='block'){
			obj.style.display='none';
		}else{
			obj.style.display='block';
		}
	}

	return this;
}
//----overwrite the inhrited make_entry function here
//---------------------------
game.dom.pane.prototype.make_entry=function(id,label,styles){
	this.act = function(e){return false};//empty function waiting to be assigned
	this.style=this.init_style(styles);
	this.module =  new game.dom.element(
		'li',
		{
			'id':'gui_entry_'+id,
			'class':'gui_entry',
			'style':'width:100%;display:inline-block;vertical-align:top;'
			
		}
	);
	//var bg = new game.dom.element('div',{'id':'gui_entry_title_bg_'+id,'class':'gui_title_bg','style':'background-color:white;width:100%;display:inline-block;'})

	this.title = new game.dom.element(
		'div',
		{
			'id':'gui_entry_title_'+id,
			'class':'gui_title',
			'style':'width:100%;background-color:white;display:inline-block;font-size:12px;color:black;margin:0 0 '+this.style.margin+' 0px;'
		}
	);
	
	this.title.innerHTML=label;
	
	//bg.appendChild(title);
	this.module.appendChild(this.title);
	this.id=id;
	
	return this;
}