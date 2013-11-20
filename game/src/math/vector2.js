game.vector2=function(x,y){
	return this.set(x,y);
}
//---------------------------
game.vector2.prototype.set=function(x,y){
	this._x = x||0;
	this._y = y||0;
	return this;
}
game.vector2.prototype.normalize=function(){
	var v = new game.vector2();
	var l = this.length();
	if (l==0){
		v._x=0;
		v._y=0;
	}else{
		v._x = this._x / l;
		v._y = this._y / l;
	}
	return v;
}
game.vector2.prototype.length=function(){
	return Math.sqrt( (this._x*this._x)+(this._y*this._y) );
}

game.vector2.prototype.dot=function(v){
	return ( this._x * v._x + this._y * v._y );
}	
					
game.vector2.prototype.add=function(w){
	var v = new game.vector2();
	v._x = this._x + w._x;
	v._y = this._y + w._y;
	return v;
}

game.vector2.prototype.subtract=function(w){
	var v = new game.vector2();
	v._x = this._x - w._x;
	v._y = this._y - w._y;
	return v;
}

game.vector2.prototype.multiply_scalar=function(s){
	var v = new game.vector2();
	v._x = this._x * s;
	v._y = this._y * s; 
	return v;
}

game.vector2.prototype.copy=function(v){
	this._x=v._x;
	this._y=v._y;
	return this;
}
game.vector2.prototype.duplicate=function(){
	return new game.vector2(this._x,this._y);
}