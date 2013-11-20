//www.whatstyle.net/examples/cookies.js
game.cookie=function(){
	this.value_seperator = "$:$";
	this.sub_seperator = "$&$";
	return this;
}
game.cookie.prototype.set = function(name,value,days,path){
    var e='';
    if(days){
    	var d = new Date();
    	d.setTime(d.getTime()+(days*24*60*60*1000));
    	e = "; expires="+d.toGMTString();
    }
    
    var p = "; path=/";
    if(path) p="; path="+path;

    document.cookie = name+"="+escape(value)+e+p;
}
game.cookie.prototype.get = function(name){
	var n = name+"=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++){
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if(c.indexOf(n)==0) return unescape(c.substring(n.length,c.length));
	}
	return null;
}
game.cookie.prototype.delete = function(name){
	this.set(name,'',-1);
}
///------deal with sub cookies
game.cookie.prototype.setsub = function(name,values,days,path){
	var value = "";
	for(var i in values){
		value += i + this.value_seperator;
		value += values[i];
		value += this.sub_seperator;
	}
	//remove the trailing seperator
	value = value.substring(0,value.length-this.sub_seperator.length);
	this.set(name,value,days,path);
}
game.cookie.prototype.getsub = function(name,subname){
	var cookie = this.get(name);
	var sub = cookie.split(this.sub_seperator);
	for(var i=0; i<sub.length; i++){
		var sc = sub[i].split(this.value_seperator);
		if(sc[0]==subname) return sc[1];
	}
	return null;
}
game.cookie.prototype.deletesub = function(name,subnam,days,path){
	var cookie = this.get(name);
	var newvalue = {};
	var sub = cookie.split(this.sub_seperator);
	for(var i=0; i<sub.length; i++){
		var sc = sub[i].split(this.value_seperator);
		if(sc[0]!=subname) newvalue[sc[0]]=sc[1];
	}
	this.set(name,newvalue,days,path);
}

/*
-----usage

---basic cookie

this.set('admin','donald',2);//set the cookie
alert(this.get('admin'));//returns donald
this.delete('admin');//remove the cookie

---sub cookies

var values={
	name:'donald',
	age:40,
	homepage:'http://www.google.com'	
};

this.setsub('admin',values,2);
alert(this.getsub('admin','name'));
this.deletesub('admin','age',2);//only deletes the age value from the cookie
this.delete('admin');//remove the entire cookie

-----
*/
