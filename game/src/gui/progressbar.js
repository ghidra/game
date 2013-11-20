game.dom.progressbar=function(id,label,value,max,style){
	this.round=100;
	return this.make(id,label,value,max,style);
}
game.dom.progressbar.prototype=new game.dom.entry();
game.dom.progressbar.prototype.constructor=game.dom.entry;

game.dom.progressbar.prototype.make=function(id,label,value,max,styles){
	this.make_entry(id,label,styles);
	this.styles_margin = this.style.margin;
	this.set_bounds(max);
	this.max_width = (this.style.width*0.5)-(this.style.margin*2); 
	this.mouse_offset=0;
	this.value = value;
	
	var progressbar_bg =  new game.dom.element(
		'div',
		{
			'id':'gui_progressbar_bg_'+id,
			'class':'gui_progressbar_bg',
			'style':'width:50%;height:12px;background-color:red;float:left;margin:'+this.style.margin+'px;'
		}
	);
	var progressbar_fg =  new game.dom.element(
		'div',
		{
			'id':'gui_progressbar_fg_'+id,
			'class':'gui_progressbar_fg',
			'style':'width:'+ this.max_width * (this.remap(value,0,max,0,1)) +'px;height:8px;background-color:black;float:left;margin:'+this.style.margin+'px;'
		}
	);
	var input_width = (this.style.width*.2)-(this.style.margin*3);//get the actual width in pixels, instead of percentage, so it is more presice
	var input = new game.dom.element(
		/*'input',
		{
			'id':'input_'+id,
			'type':'text',
			'name':'input_name_'+id,
			'value':value,
			'style':'width:'+input_width+'px;float:left;'
		}*/
		'div',
		{
			'id':'gui_value_'+id,
			'class':'gui_value',
			'style':'margin-right:'+this.style.margin+';float:left;color:black;font-size:12px;'
		}
	);
	var input_max = new game.dom.element(
		'div',
		{
			'id':'gui_value_max_'+id,
			'class':'gui_value_max',
			'style':'width:'+input_width*0.4+'px;margin-top:2px;float:left;color:black;font-size:9px;color:#AAAAAA'
		}
	);

	input.innerHTML=this.round_decimal(value,this.round);
	input_max.innerHTML='/'+this.round_decimal(max,this.round); 
	
	//game.dom.bind(progressbar_bg,'mousedown',game.dom.closure(this,this.mousedown));//add the function to start dragging
	//game.dom.bind(input,'change',game.dom.closure(this,this.input_change));
	
	progressbar_bg.appendChild(progressbar_fg);
	this.module.appendChild(progressbar_bg);
	this.module.appendChild(input);
	this.module.appendChild(input_max);

	return this;
}
game.dom.progressbar.prototype.set_bounds=function(max){
	var v = Math.abs(max);
	this.upper = v;
	this.lower = 0;
}
game.dom.progressbar.prototype.clamp = function(v) {
  return Math.min(Math.max(v, 1), this.max_width);
}
game.dom.progressbar.prototype.remap = function(v,l1,h1,l2,h2){
	return l2 + (v - l1) * (h2 - l2) / (h1 - l1);
}
/*game.dom.progressbar.prototype.mousedown=function(e){
	this.update(e);
	var m = game.brain.controller.mouse;//my global mouse controller
	m.add('drag_'+this.id,'mousemove',game.dom.closure(this,this.update));
	m.add('release_'+this.id,'mouseup',game.dom.closure(this,this.release));
}*/
/*game.dom.progressbar.prototype.update=function(e){
	var c = game.dom.mouse_position(e);//get mouse position
	var p = game.dom.element_position('gui_progressbar_bg_'+this.id);
	var s = game.dom.element_size('gui_progressbar_bg_'+this.id);
	var fg = document.getElementById('gui_progressbar_fg_'+this.id);
	var v = document.getElementById('input_'+this.id);

	this.mouse_offset = c[0]-p[0];//the resulting offset
	
	var new_position = this.clamp(this.mouse_offset-this.styles_margin); 
	var new_value = this.remap(new_position,1,this.max_width,this.lower,this.upper);
	fg.style.width = new_position;
	
	v.value=new_value;//set the input value
	this.value = new_value;
	this.act.call(this,e);
}*/
game.dom.progressbar.prototype.update=function(v){
	var fg = document.getElementById('gui_progressbar_fg_'+this.id);
	var val = document.getElementById('gui_value_'+this.id);
	//alert(fg.style.width);
	if(fg) fg.style.width = this.max_width * (this.remap(v,0,this.upper,0,1));
	if(val) val.innerHTML = this.round_decimal(v,this.round);
}
game.dom.progressbar.prototype.refresh=function(value,max){//make a new one with the new values
	this.set_bounds(max);
	this.value = value;

	var input = document.getElementById('gui_value_'+this.id);
	var input_max = document.getElementById('gui_value_max_'+this.id);

	input.innerHTML=this.round_decimal(value,this.round);
	input_max.innerHTML='/'+this.round_decimal(max,this.round);

	this.update(value);

	return true;
}
/*game.dom.progressbar.prototype.input_change=function(e){
	var fg = document.getElementById('gui_progressbar_fg_'+this.id);
	var v = document.getElementById('input_'+this.id);
	var new_value = v.value;
	
	if ( isNaN(new_value) ){
		v.value=this.value
	}else{
		this.set_bounds(parseFloat(new_value));
		this.value = parseFloat(new_value);
		fg.style.width = this.max_width/2;
	}
}*/
/*game.dom.progressbar.prototype.release=function(e){
	var m = game.brain.controller.mouse;//my global mouse controller
	m.delete('drag_'+this.id,'mousemove');
	m.delete('release_'+this.id,'mouseup');
}*/