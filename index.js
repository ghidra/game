/*
Where have I left off?


// i need to take these out in use_character_select
//all_characters[c].equipped.weapon = 'bare_hands';

-i dont think that I am saving the skills yet
-character needs to be able to choose which weapon and armor
-purse needs to update when the moeny has been updated in the inventroy, since that is where it is looking for it anyway

-need a shop to buy and sell
-story line updates that tell the story more than the quest updates
-when making a character, i should have a list somwhere of specific useable player charactes, so that you cant be a enemy type, if I so choose
-enemy attach back
-skill attacks to be something more than a concept
	-make it now so that The pawn decides to use a normal attack or a skill based attack
	--blah blah, lots of attack logic needs to be defined and built in

-vehicles

------------------------------

---lower priority list
-ap after level up is going 0.1 over max value, or maybe i have it roundind anywa for some reason, look into that
-i need to implement a time variable, so that even if we have enough action points, we dont just slaughter a character immediatly.
-not giving weapons or armor after defeating enemy yet
-remove references to 'program' and give the program object to whomever needs to access it, so that it is more dynamic
-i should make a quest take certain items back if they were meant to be collected for a reason
---------------------

---server, multiplayer
Next on the agenda, is to get into the server part of things.
To pass data back and forth with the python server.
*/



program={
	user:'unknown',
	check_login:function(){
		new game.user_interface('menu_bar',function(user){program.character_select(user);});
	},
	character_select:function(user){
		this.user=user;
		new game.user_character_select('palette_info', function(character){program.init(character);} );
	},
	init:function(character){

		this.planet = new game.planet('earth','palette_map');

		this.character = new game.pawn(character,'palette_character',true);

		this.quest = new game.quest(this,'where_am_i','palette_quests');
		this.quest.set_saved_quest(character.quest);
		//load in our saved character
		/*this.character = new game.pawn(
			{
				'name':'donald hamstead',
				'race':'human',
				'class':'programmer',
				'attributes':{
					'hp':1.1,
					'str':1
				},
				'inventory':{
					'weapons':{},
					'armors':{},
					'etc':{
						'stones':3
					}
				}
			},
			'palette_character',
			true
		);//true is to denote it being on your team, and thus set the styles for it to float stuff right
*/
		/*this.character = new game.pawn(
			{
				'name':'donald hamstead',
				'race':'human',
				'class':'programmer',
				'attributes':{
					'hp':1.1,
					'str':1
				},
				'inventory':{
					'weapons':{},
					'armors':{}
				}
			},
			'palette_character',
			true
		);*/

		/*this.enemy = new game.pawn({
			'race':'human',
			'class':'artist',
			'level':5
		},'palette_character_interation');*/

		//this.character.target = this.enemy;//manullay hand the enemy to the character to test out the attacking mechanism

		/*this.enemy=new game.pawn_factory(
			{
				'race':['human'],
				'class':['programmer']
			},
			this.character,
			'palette_character_enemy'
		);//the this.character part needs to be a world variable at some point, so the enimies spawned can be attackec by everyone
		*/
		//this.quest = new game.quest(this,'introduction','palette_quests');
		this.net = new game.net('127.0.0.1','55555','palette_server');

		game.brain.init(this.tick);
		game.brain.framerate.set_layer('palette_time');//give the framerate the layer to write into

	},
	tick:function(){
		//here I guess I can start ticking the things I want

		program.character.tick();//i have to use the origram context here, since this doesnt work, since this is now being called by this
		//program.enemy.tick();
		program.quest.tick();
		program.planet.tick();//tick the planet so that we can display the location of our main character

		if(program.net.open && game.brain.framerate.seconds_round() > 3 && game.brain.framerate.seconds_round() <=6){
			var n= {
				'user': program.user,
				'comment': 'No one will ever believe you'
			};
			program.net.send(JSON.stringify(n));
		}

		//alert(program.planet.closest_destination_readable(program.character.location));

		//
	},
	is_object:function(i){
		return typeof i === 'object' && i != null;
	},
	object_to_string:function(a){
		var s = '';
		for(var i in a){
			if( this.is_object(a[i]) ){
				s+=i+':\n';
				s+=this.object_to_string(a[i]);
			}else{
				s+=i+':'+a[i]+'\n';
			}
		}
		return s;
	}


}

//----------------------------------------------
window.onload=function(){
	program.check_login();
}
/*window.onclose=function(){
	alert('we are closing the page, save my shit');
}*/