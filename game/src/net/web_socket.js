game.web_socket=function(address,port,layer){
	//this.init(address,port,layer);
	return this;
}
game.web_socket.prototype.init=function(address,port,layer){
	var _this=this;

	this.layer = document.getElementById(layer);
	this.layer_console = undefined;//for holding the part we will write into
	this.open = false;

	this.socket = new WebSocket('ws://'+address+':'+port);

	this.socket.onopen=function(){
		_this.onopen();
	};
	this.socket.onmessage=function(e){
		_this.onmessage(e);
	};
	this.socket.onclose=function(e){
		_this.onclose(e);
	};

	this.build_visual_stats();

	this.layer_console.innerHTML='connect:'+address+'</br>';
	
	return this;
}
game.web_socket.prototype.build_visual_stats=function(){

	var wrapper = game.dom.element('div',{'id':'network','class':'network','style':'width:200px'});
	var container = new game.dom.pane('network_pane','network','',true);

	this.layer_console = game.dom.element('div',{'id':'network_console','class':'network_console','style':'width:200px'});

	container.palette.appendChild(this.layer_console);
	wrapper.appendChild(container.module);
	
	this.layer.appendChild(wrapper);

	return true;
}
//------------------------
game.web_socket.prototype.onopen=function(){
	//this.send('ping');
	this.open = true;
	if(this.layer_console){//if we have been given a layer to put it, put it
		this.layer_console.innerHTML=this.layer_console.innerHTML+'connected:'+this.socket.readyState+'</br>';
	}
	//alert('open');
	//return true;//we are open
}
game.web_socket.prototype.onmessage=function(e){
	//alert(e.data);
	if(this.layer_console){
		this.layer_console.innerHTML=this.layer_console.innerHTML+e.data+'</br>';
	}
	//return true;//we are open
}
game.web_socket.prototype.onclose=function(e){
	//alert('closed');
	this.open=false;
	//e at this point is an object, i need to parse it to see what it says
	if(this.layer_console){//if we have been given a layer to put it, put it
		this.layer_console.innerHTML=this.layer_console.innerHTML+'disconnected</br>';
	}
	//return true;//we are open
}//
game.web_socket.prototype.onerror=function(e){
	alert('web socket error:'+e)
}
game.web_socket.prototype.send=function(e){
	this.socket.send(e);
}