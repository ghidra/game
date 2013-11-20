game.brain = {
	'fps':30,
	'framerate':undefined,
	'program_tick':undefined,
	'tick':function(){
		//explicitly put brain here, because we are getting called back to this function from elsewhere
		requestAnimFrame(game.brain.tick);
		//now we put what we want to do durring the tick. as for the frame first
		//alert(callback);
		game.brain.program_tick();
		game.brain.framerate.tick()
	},
	'init':function(ptick){
		this.framerate = new game.framerate(this.fps);
		//put what we want to init before calling tick
		this.program_tick=ptick;
		this.tick();
	}
}