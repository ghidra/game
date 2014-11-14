//array.prototype.
//this doesnt work, and I might just make a class called utilities to cover this class instead
Object.prototype.length=function(){
	var l=0;
	for(var i in this){
		if(this.hasOwnProperty(i)){
			l++;
		}
	}
	return l;
}
/*Object.prototype.empty=function(){return this==null || this==undefined || this=='' || this.length()==0;}
Object.prototype.first_key=function(){if(!this.empty()){var k='';for (var key in this){k=key;break;};return k;}else{return null;}}
Object.prototype.type=function(){return 'object'}

Number.prototype.decimal=function(t){return Math.round(this*t)/t;}
Number.prototype.type=function(){return 'number'}*/

/*window.onload=function(){
	var temp_o = {'a':'1','b':'2','c':'3'};
	var temp_n = 2.34565;
	alert(temp_o.first_key());
}
*/
