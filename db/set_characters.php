<?php

require_once 'mysql_interface.php';

class set_characters extends mysql_interface{
	function set_characters(){
		parent::mysql_interface();

		switch($this->action){
			case 'new':
				$this->new_character();
				break;
			default:
				$this->out=0;
		}
	}
	//----------------------------
	function new_character(){
		$name = $this->_get('name');
		$race = $this->_get('race');
		$class = $this->_get('class');

		//create the row in the character table, and get the id, so that I can give that to the users table
		$character_id = $this->mysql->create_character($name,$race,$class);
		$this->mysql->append_user_characters($this->user,$character_id);

		$this->out = true;
	}
}

//i have to at least invoke the class to get the info from it and print it out

$my_characters = new set_characters();
print $my_characters->out;

?>