game.purse=function(pawn){
	this.init(pawn);
	return this;
}

game.purse.prototype=new game.list();
game.purse.prototype.constructor=game.list;

game.purse.prototype.init=function(pawn){//give them the things
	this.d = {'money':pawn.inventory.d.items.money}

	game.list.prototype.init.call(this,this.d,pawn,pawn.name+'_wallet');

	this.label = 'wallet';
}