game.ajax=function(file,parameters,method,success,failure){//this is one of those pop up indicators when something takes damage, or heals or whatever reaons i need to pop up information
	this.init(file,parameters,method,success,failure);
	return this;
}
game.ajax.prototype.init=function(file,parameters,method,success,failure){
	//make the object
	this.xmlhttp = (window.XMLHttpRequest) ? new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP");

  	//-------------------
  	var _this = this;
  	this.xmlhttp.onreadystatechange=function(){
  		if (_this.xmlhttp.readyState==4 && _this.xmlhttp.status==200){
    		success(_this.xmlhttp.responseText);
    		//alert(_this.xmlhttp.responseText);
    	}
  	}

  	var params = this.construct_parameters(parameters);
  	if(method=="get"){
  		this.xmlhttp.open("GET",file+'?'+params+'&t='+Math.random(),true);
		this.xmlhttp.send();
	}else{
		this.xmlhttp.open("POST",file,true);
		this.xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		this.xmlhttp.send(params);
	}

}
game.ajax.prototype.construct_parameters=function(params){
	var s ='';
	for (var v in params){
		s+= v+'='+params[v]+'&';
	}
	return s.substring(0, s.length - 1);//remov the last character the &
}