game.user_character_select=function(layer,callback){
	return this.init(layer,callback);
}
game.user_character_select.prototype.init=function(layer,callback){
	var _this = this;
	this.layer = layer;
	this.callback = callback;
	this.characters = undefined;
	var con = document.getElementById(layer);
	con.innerHTML='';
	new game.ajax(
		'db/get_characters.php',
		{
			'action':'get_user_characters'
		},
		'get',
		function(transport){
			if(transport!='0'){//a character exists for this user... we can proceed to a character select screen
				//alert(transport)
				_this.characters=JSON.parse( transport );
				_this.character_select_window(layer);
			}else{//no character exists, we need to preset character creation
				_this.character_creation_window(layer);
			}
		}
	);
	return this;
}
//_______________________________________
//---------------------------------------
//   Character select window
//---------------------------------------
//_______________________________________
game.user_character_select.prototype.character_select_window=function(layer){
	//i should now grab the characters data, and make the object I need to pass to actors to make the visual representation.
	//just go ahead and give everything to the user to decide whom he she wants to pick.
	//it will also be good to know how to construct the data anyway, for when i give it to the game to start playing
	//alert('lets_make a select screen here with:'+character_ids);
	var wrapper = new game.dom.element('div',{'id':'character_select_window','class':'character_select_window','style':'width:600px;margin:0 auto 0 auto;'});
	var label = new game.dom.element('div',{'id':'character_select_window_label','class':'character_select_window_label','style':'width:100%;text-align:center;'});
	//var button_container = new game.dom.element('div',{'id':'character_select_window_buttons','class':'character_select_window_buttons','style':'margin:0 auto 0 auto;text-align:center'});
	var container = new game.dom.element('div',{'id':'character_select_window_container','class':'character_select_window_container','style':'margin:2 0 0 0px;'});
	var create_container = new game.dom.element('div',{'id':'create_container','class':'create_container','style':'clear:both;'});
	/*var make_new_character_button = new game.dom.element('button',{'id':'make_new_character_button','class':'make_new_character_button','type':'submit'})
	make_new_character_button.innerHTML='make a new character';
	var _this = this;
	make_new_character_button.onclick=function(){_this.character_creation_window(layer);};*/

	label.innerHTML='character select';

	//button_container.appendChild(make_new_character_button);
	
	wrapper.appendChild(label);
	//wrapper.appendChild(button_container);
	wrapper.appendChild(container);
	wrapper.appendChild(create_container);

	if(layer){//if we have been given a layer to put it, put it
		var con = document.getElementById( layer );
		con.appendChild(wrapper);
	}
	//do this after setting the html stuff, cause the pawn expects the html to already be there
	this.assemble_characters('character_select_window_container',this.characters);

	this.character_creation_window('create_container');

}
game.user_character_select.prototype.assemble_characters=function(layer){
	//var _this = this;
	var all_characters = this.characters;
	for (var c in all_characters){
		var l = document.getElementById(layer);

		var container = new game.dom.element('div',{'id':'charcter_'+all_characters[c].name,'class':'character','style':'float:left;margin:0 2 0 2px'});
		var button_container = new game.dom.element('div',{'id':'character_button_container_'+all_characters[c].name,'class':'character_button_container','style':'width:100%;text-align:center;'});
		var button = new game.dom.element('button',{'id':'character_button_'+all_characters[c].name,'class':'character_button'});

		button.innerHTML = 'Choose: '+all_characters[c].name;
		button.onclick=this.create_choose_function(c);//function(){_this.choose_character(all_characters[c].name);};
		button_container.appendChild(button);
		container.appendChild(button_container);
		l.appendChild(container);

		//error check the inventory, for new characters, i need to at least have the base objects weapons, armor, etc
		//if(all_characters[c].inventory==null || all_characters[c].inventory==undefined || all_characters[c].inventory==''){//check to see if this is not an empty value, or rather a new character will have no value here
		if( this.object_empty(all_characters[c].inventory) ){
			all_characters[c].inventory={};
			all_characters[c].inventory.weapons = {};
			all_characters[c].inventory.armors = {};
			all_characters[c].inventory.vehicles = {};
			all_characters[c].inventory.items = {};
		}else{
			//inventory object is just the 'items part'
			//first make an object to hold the new parsed object
			//then set the new values as needed
			var temp =  JSON.parse(all_characters[c].inventory);
			all_characters[c].inventory={};
			all_characters[c].inventory.items = temp;
		}

		//i need to also give the weapons and armor and vehicles back to the inventory
		if( !this.object_empty(all_characters[c].weapon) ){
			var w = JSON.parse(all_characters[c].weapon);
			all_characters[c].inventory.weapons={};
			for(var we in w){
				all_characters[c].inventory.weapons[we]= w[we];//new game.weapon(we['type'],all_characters[c]);
			}
			//all_characters[c].inventory.weapons = JSON.parse(all_characters[c].weapon);
		}
		if( !this.object_empty(all_characters[c].armor) ){
			var w = JSON.parse(all_characters[c].armor);
			all_characters[c].inventory.armors={};
			for(var we in w){
				all_characters[c].inventory.armors[we]=w[we];//new game.armor(we['type'],all_characters[c]);
			}
			//all_characters[c].inventory.armor = JSON.parse(all_characters[c].weapon);
		}
		if( !this.object_empty(all_characters[c].vehicle) ){
			var w = JSON.parse(all_characters[c].vehicle);
			all_characters[c].inventory.vehicles={};
			for(var we in w){
				all_characters[c].inventory.vehicles[we]=w[we];//new game.armor(we['type'],all_characters[c]);
			}
			//all_characters[c].inventory.armor = JSON.parse(all_characters[c].weapon);
		}
		//skill
		if( !this.object_empty(all_characters[c].skill) ){
			var w = JSON.parse(all_characters[c].skill);
			all_characters[c].skill={};
			for(var we in w){
				all_characters[c].skill[we]=w[we];//new game.armor(we['type'],all_characters[c]);
			}
			//all_characters[c].inventory.armor = JSON.parse(all_characters[c].weapon);
		}

		if( !this.object_empty(all_characters[c].equipped) ){ 
			all_characters[c].equipped = JSON.parse(all_characters[c].equipped);
		}else{
			all_characters[c].equipped={};
			all_characters[c].equipped.weapon = 'bare_hands';
			all_characters[c].equipped.armor = 'dead_leaves';
		}

		//-------i am getting the quest data, now I need to jason parse that shit
		if( !this.object_empty(all_characters[c].quest) ) all_characters[c].quest = JSON.parse(all_characters[c].quest);

		//i need to convert these string numbers into javascript numbers. I might want to do that at the php level
		all_characters[c].level = Number(all_characters[c].level);
		//all_characters[c].exp = Number(all_characters[c].exp);

		var single_character = new game.pawn( all_characters[c],'charcter_'+all_characters[c].name,true );
		//i++;
		//alert(this.object_to_string(all_characters[c]));
	}
}
game.user_character_select.prototype.create_choose_function=function(i){//this is a wrapper function to make the closuer for the i variable, because it is not keeping its value otherwise, it was just giving me the last value
	var _this = this;
	return function(){_this.choose_character(i)};
}
game.user_character_select.prototype.choose_character=function(i){
	var con = document.getElementById(this.layer);
	con.innerHTML='';

	var _this = this;
	//var log_out = new game.dom.element('a',{'href':'db/logout.php'});
	var log_out_label = new game.dom.element('div',{'style':'background-color:red;width:100px;float:left;text-align:center;color:white;cursor:hand;'});
	log_out_label.innerHTML = 'log out';
	log_out_label.onclick=function(){_this.log_out()};
	//log_out.appendChild(log_out_label);

	//var save = new game.dom.element('a',{'href':'db/logout.php'});
	var save_label = new game.dom.element('div',{'style':'background-color:red;width:100px;float:right;text-align:center;color:white;cursor:hand;'});
	save_label.innerHTML = 'save';
	save_label.onclick = function(){_this.save()};
	//log_out.appendChild(save_label);

	con.appendChild(log_out_label);
	con.appendChild(save_label);

	//program.init(this.characters[i]);
	this.callback(this.characters[i]);
	//alert(i);
	//alert(this.characters[i].name);
}
//_______________________________________
//---------------------------------------
//   Character creation window
//---------------------------------------
//_______________________________________
game.user_character_select.prototype.character_creation_window=function(layer){
	//here i am building a window to make a new character with
	//when the submit button is pressed, it should save the data to the database

	//var submit = function(){alert('fucka')};

	var wrapper = new game.dom.element('div',{'id':'character_creation_window','class':'character_creation_window','style':'width:600px;margin:0 auto 0 auto;'});
	var label = new game.dom.element('div',{'id':'character_creation_window_label','class':'character_creation_window_label','style':'height:12px;width:100%;text-align:center;'});
	var container = new game.dom.element('div',{'id':'character_creation_window_container','class':'character_creation_window_container'});
	
	var form = new game.dom.element('div',{'id':'character_creation_window_form','class':'character_creation_window_form'});

	var name_input = this.build_name_input();
	var race_radio_buttons = this.build_radio_buttons('race');
	var class_radio_buttons = this.build_radio_buttons('class');
	var submit_button = this.build_submit_button(form);

	label.innerHTML='character creation';

	wrapper.appendChild(label);

	form.appendChild(name_input);
	form.appendChild(race_radio_buttons);
	form.appendChild(class_radio_buttons);
	form.appendChild(submit_button);

	container.appendChild(form);
	wrapper.appendChild(container);

	if(layer){//if we have been given a layer to put it, put it
		var con = document.getElementById( layer );
		con.appendChild(wrapper);
	}

	//alert( this.object_to_string(game.archetypes.race) );
}

game.user_character_select.prototype.build_name_input=function(){
	var character_name_container = new game.dom.element('div',{'id':'character_creation_name_container','class':'character_creation_name_container','style':'width:200px;float:left;'});
	var input_field = new game.dom.element('input',{'id':'character_input_name','class':'character_input_name','name':'character_name','type':'text','value':''});

	character_name_container.appendChild(input_field);
	return character_name_container;
}
game.user_character_select.prototype.build_radio_buttons=function(archetype){
	var character_archetype_container = new game.dom.element('div',{'id':'character_creation_'+archetype+'_container','class':'character_creation_'+archetype+'_container','style':'width:200px;float:left;'});

	var len = this.object_length(game.archetypes[archetype])-1//Object.keys(game.archetypes[archetype]).length-1;//this should give me the length of available archetypes, so I can randomly choose one
	var c = 0;
	var selected = Math.round(Math.random()*len);

	for(var r in game.archetypes[archetype]){
		var archetype_container = new game.dom.element('div',{'id':archetype+'_container_'+r,'class':'character_select_radio_button_container'});

		if(c == selected){
			var archetype_button = new game.dom.element('input',{'id':archetype+'_button_'+r,'class':'character_select_radio_button','type':'radio','name':archetype,'value':r,'checked':'checked','style':'color:white;'});
		}else{
			var archetype_button = new game.dom.element('input',{'id':archetype+'_button_'+r,'class':'character_select_radio_button','type':'radio','name':archetype,'value':r,'style':'color:white;'});

		}

		archetype_container.appendChild(archetype_button);
		archetype_container.innerHTML+=r;
		character_archetype_container.appendChild(archetype_container);

		c++;
	}

	return character_archetype_container;	
}
game.user_character_select.prototype.build_submit_button=function(form){
	var button_container = new game.dom.element('div',{'id':'character_creation_submit_button_container','class':'character_creation_submit_button_container','style':'width:200px;margin:0 auto 0 auto;text-align:center'}) 
	var button = new game.dom.element('button',{'id':'character_creation_submit_button','class':'character_creation_submit_button','type':'submit'});
	
	//button.onClick=new function(){alert('try')};
	var _this = this;
	button.innerHTML = 'create character';
	button.onclick=function(){_this.check_character_inputs();};
	button_container.appendChild(button);

	return button_container;
}


////--------------------------------
game.user_character_select.prototype.check_character_inputs=function(){
	var name = document.getElementById('character_input_name').value;
	if( !/^\s*$/.test(name) ){//that code up there checks that the input has more than just white space and any real text
		//there is text, so we can carry on
		var race = this.check_radio_button_inputs('race');
		var _class = this.check_radio_button_inputs('class');

		this.write_character(name,race,_class);
	}else{
		alert('you have to at least enter a name');
	}
}
game.user_character_select.prototype.check_radio_button_inputs=function(name){
	var radios = document.getElementsByName(name);
	var value;
	for (var i = 0; i < radios.length; i++) {
    	if (radios[i].type === 'radio' && radios[i].checked) {
        	// get value, set checked flag or do whatever you need to
        	value = radios[i].value;       
    	}
	}
	return value
}
//here we do the ajax part to write to the mysql
game.user_character_select.prototype.write_character=function(name,race,_class){
	var _this = this;
	new game.ajax(
		'db/set_characters.php',
		{
			'action':'new',
			'name':name,
			'race':race,
			'class':_class
		},
		'get',
		function(transport){
			if(transport!='0'){//we have succeeded in making a new character, go back to the character select screen
				_this.init(_this.layer,_this.callback);//reload the page basically
				//alert(transport);
			}else{//no character exists, we need to preset character creation
				alert('something went wrong trying to write character to database');
			}
		}
	);
}
//-------------------------------
game.user_character_select.prototype.log_out=function(){
	new game.ajax(
		'db/user_interface.php',{'action':'log_out'},'get',
		function(transport){
			if(transport=='1'){
				location.reload();//reload the page
			}else{//no character exists, we need to preset character creation
				alert('something went wrong trying to log out');
			}
		}
	);
}
game.user_character_select.prototype.save=function(){
	var data = new game.save();
	new game.ajax(
		'db/save.php',
		data,
		'get',
		function(transport){
			if(transport!='0'){//character saved
				alert('character saved');
			}else{//no character exists, we need to preset character creation
				alert('something went wrong trying to save');
			}
		}
	);
}
///---------------------------------

game.user_character_select.prototype.object_length=function(o){
	var len = 0;
	for(var i in o){
		if(o.hasOwnProperty(i)){
			len++;
		}
	}
	return len;
}

game.user_character_select.prototype.object_empty=function(obj){
	return obj==null || obj==undefined || obj=='';
}
//_______________________________________
//---------------------------------------
//   END Character creation window
//---------------------------------------
//_______________________________________
