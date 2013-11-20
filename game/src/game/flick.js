game.flick=function(layer,value,pawn,attribute,ally,type){//this is one of those pop up indicators when something takes damage, or heals or whatever reaons i need to pop up information
	this.init(layer,value,pawn,attribute,ally,type);
	return this;
}
game.flick.prototype.init=function(layer,value,pawn,attribute,ally,type){
	var flo=(ally)?'right':'left';
	var flo_op=(ally)?'left':'right;'

	this.parent = pawn;

	this.life = 20;//life in ticks, cause I dont want to deal with seconds right now, dies after this time
	this.age=0;//count up the age
	this.index = pawn.flicks.length;//where in the array we are so we can erase later
	this.id = pawn.flicks_id;//the uniquie id relative to the pawn
	this.name = 'flick_'+pawn.name+'_'+this.id;//add the length in there so that I have an index number

	this.module = game.dom.element('div',{'id':this.name,'class':'flick','style':'position:absolute;width:200px'});

	var b0 = game.dom.element('div',{'id':'flick_value_'+pawn.name+'_'+this.id,'class':'flick_value','style':'height:12px;clear:'+flo+';float:'+flo});
	b0.innerHTML=value;

	this.module.appendChild(b0);

	//now we grab the attribute that we are effecting, and try and place this next to it to show what is happeneing
	var element_id = pawn.attributes_visualized[attribute].module.id;//this gives me the id of the html element that I want to place this next to
	var position = this.get_attribute_position(element_id);
	var offset_left=0;
	if(pawn.ally){
		offset_left = -this.module.offsetWidth
	}else{ 
		var elem = document.getElementById(element_id);
		if(elem){
			offset_left = elem.offsetWidth;//get the offset based on weather this is an ally or not
		}
	}
	position[0]=position[0]+offset_left;

	this.module.style.left=position[0];
	this.module.style.top=position[1];

	this.ally=(ally)?true:false;
	//alert(this.module.style.position.left);

	var info_layer = document.getElementById(layer);
	info_layer.appendChild(this.module);

	return this;
}
game.flick.prototype.tick=function(){//for animation
	var me = document.getElementById(this.name);
	if(me){
		if(this.age>=this.life){//it's time to die
			this.remove(me);
		}else{//carry on you're not dead yet
			
			var offset = parseInt(me.style.left);
			me.style.left = offset+2;
		
			this.age=this.age+1;
		}
	}

	//alert(this);
}
game.flick.prototype.get_attribute_position=function(attribute){
//Element.cumulativeScrollOffset
    var curleft= 0;
    var curtop=  0;
    var obj= document.getElementById(attribute);
    //alert(attribute)
    if(obj){//we error out of this when we dont find the layer since it died
   	 	if(obj.offsetParent){//if the browser suppert this object call, offsetParent   ////-----------------------herer
        	do {
            	curleft += obj.offsetLeft;
            	curtop += obj.offsetTop;
        	}while (obj = obj.offsetParent);
        	    return [curleft,curtop];
    	}
	}
}
game.flick.prototype.remove=function(me){
	this.parent.flicks.splice(this.index,1);
	me.parentNode.removeChild(me); ///--------------------here
}