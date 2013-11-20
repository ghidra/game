game.net=function(address,port,layer){
	this.init(address,port,layer);
	return this;
}

game.net.prototype = new game.web_socket();
game.net.prototype.constructor = game.web_socket;

game.net.prototype.init = function(address,port,layer){

	game.web_socket.prototype.init.call(this,address,port,layer);//call the parent clasee init to actually connect and build the object to call these functions

	return this;
}

//---------------------
game.net.prototype.onopen=function(){
	//this.send('pinging');
	game.web_socket.prototype.onopen.call(this);
	
	/*if(this.layer){//if we have been given a layer to put it, put it
		var con = document.getElementById( this.layer );
		con.innerHTML='connected';
		//var label = new game.dom.element('div',{'id':'pawn_name_'+this.name,'class':'pawn_name','style':'height:12px'});

		//con.appendChild(this.build_visual_stats());
	}*/

	//alert('in net.js');
	//return true;//we are open
}
game.net.prototype.onmessage=function(e){
	//game.web_socket.prototype.onmessage.call(this,e);
	//var ed = JSON.parse(e.data);
	//var ej = ed.evalJSON(true);

	if(this.layer){
		//var con = document.getElementById(this.layer);
		//----this.layer_console.innerHTML=this.layer_console.innerHTML+e.data+'</br>';
		//var read = JSON.parse(e.data);

		alert(e.data)
		

		//this.layer_console.innerHTML=this.layer_console.innerHTML+read.payload+'</br>';
		//con.innerHTML=con.innerHTML+ed.paylod.name+'</br>';
	}

	//alert(e.data);
	//return true;//we are open
}
game.net.prototype.onclose=function(e){
	//return true;//we are open
	/*if(layer){//if we have been given a layer to put it, put it
		var con = document.getElementById( this.layer );
		con.innerHTML='disconnected'+e;
	}*/
	game.web_socket.prototype.onclose.call(this,e);
	//alert('no connected anymore');
}
game.net.prototype.send=function(e){
	game.web_socket.prototype.send.call(this,e);
	//this.socket.send(d);
}
