game.framerate=function(rate){
	this.frame_len = 0;
	this.prev_time = 0;
	this.seconds = 0;
	
	this.framecount=0;
	this.lastcount=0;
	this.framerate=0;
	
	this.frames_elapsed=0;
	this.sim_time = 1/rate;
	
	this.frame = 0;
	this.fps = rate;
	
	this.set_rate();
    this.reset();

    this.layer = undefined;
 	this.layer_seconds = undefined;
    this.draw = false;

	return this;
}
game.framerate.prototype.set_rate = function(){
    this.frame_len = 1000 / this.fps;
}
game.framerate.prototype.get_frames = function(){
    var d = new Date();
    var curr_time = d.getTime();    

    var total_frames = 0;
    while (this.prev_time + this.frame_len <= curr_time){
        this.prev_time += this.frame_len;
        total_frames++;
    }
    
    return total_frames;
}
game.framerate.prototype.reset = function(){
    var d = new Date();
    this.prev_time = d.getTime();	
}
//-----------------------------------------
game.framerate.prototype.calc_fps = function(){
	//this seems to always return 60 no matter the framerate 
	this.framecount++;
	var d = new Date();
	if (!this.lastcount) this.lastcount = d;
	if (this.lastcount <= (d - 1000)){
		this.framerate = this.framecount;
	    this.lastcount = d;
	    this.framecount = 0;
	}
	//return this.framerate;
}
game.framerate.prototype.seconds_round=function(){
	return Math.floor(this.seconds) + ( Math.floor(this.seconds * 10) % 10 )/10;
}
game.framerate.prototype.tick = function(){
	this.frames_elapsed = this.get_frames();
	this.frame += this.frames_elapsed;
	this.seconds += this.frames_elapsed / this.fps;
	
	this.calc_fps();

	//----------------now output if told to
	if(this.draw && this.layer){
		this.layer_seconds.innerHTML = 'seconds:'+this.seconds_round()+'<br>';
	}
	/*
		//var s = 'seconds:'+game.brain.framerate.seconds+'<br>';
		//var s = 'seconds:'+game.brain.framerate.seconds_round()+'<br>';
		//s += 'fps:'+game.brain.framerate.framerate+'<br>';
		//s += 'set fps:'+game.brain.framerate.fps+'<br>';
		//s += 'frames:'+game.brain.framerate.frame+'<br>';
	*/
}
//---------------------------------------------------------------------------
// http://dev.opera.com/articles/view/framerate-control-system-for-javascript/
//---------------------------------------------------------------------------
game.framerate.prototype.set_layer = function(l){
	this.layer = document.getElementById(l);
	this.draw = true;

	var wrapper = game.dom.element('div',{'id':'framerate','class':'framerate','style':'width:200px'});
	var container = new game.dom.pane('framerate_pane','time','',true);

	this.layer_seconds = game.dom.element('div',{'id':'framerate_seconds','class':'framerate_seconds','style':'width:200px'});

	container.palette.appendChild(this.layer_seconds);
	wrapper.appendChild(container.module);
	
	this.layer.appendChild(wrapper);

	return true;
}