game.dom = {	//function to manipulate the DOM
	'element':function(tag,attributes,inner){//craete an element
		var elem = document.createElement(tag);
		for (var key in attributes) {//loop the attributes
		    elem.setAttribute(key,attributes[key]);
		}
		if(inner){
			elem.innerHTML=inner;
		}
		//---
		return elem;	
	},
	//---------------------
	'bind': function(elem, e, func, bool) {//dat.gui
	 	bool = bool || false;
	    if (elem.addEventListener){
	    	elem.addEventListener(e, func, bool);
	    }else if (elem.attachEvent){
	        elem.attachEvent('on' + e, func);
		}
	},
	'unbind': function(elem, e, func, bool) {
		bool = bool || false;
	    if (elem.removeEventListener){
	    	elem.removeEventListener(e, func, bool);
	    }else if (elem.detachEvent){
	        elem.detachEvent('on' + e, func);
		}
	},
	'closure':function(scope,fn){//bind my function with the proper this statment
		return function(e){
			fn.call(scope,e);
		};
	},
	//---------------------
	'mouse_position':function(e){
		var posx = 0;
		var posy = 0;
		if (!e) var e = window.event;
		if (e.pageX || e.pageY) 	{
			posx = e.pageX;
			posy = e.pageY;
		}else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return [posx,posy];
	},
	'get_clicked':function(e){
		if (!e) var e = window.event;
		return e.target || e.srcElement;
	},
	'element_position':function(id){
		o = document.getElementById(id);
		var l = o.offsetLeft; 
		var t = o.offsetTop;
		while (o=o.offsetParent)
			l += o.offsetLeft;
		o = document.getElementById(id);
		while (o=o.offsetParent)
			t += o.offsetTop;
		return [l,t];
	},
	'element_size':function(id){
		o = document.getElementById(id);
		var w = o.offsetWidth; 
		var h = o.offsetHeight;
		return [w,h];
	}
	//-------------------
}