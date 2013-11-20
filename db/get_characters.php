<?php

require_once 'mysql_interface.php';

class get_characters extends mysql_interface{
	function get_characters(){
		parent::mysql_interface();
		//get values from the actor column
		switch($this->action){
			case 'get_user_characters':
				$this->get_user_characters();
				//$this->out = $this->mysql->get_user_characters($this->user);
				break;
			default:
				$this->out=0;
		}
	}
	//------
	function get_user_characters(){
		$character_ids = $this->mysql->get_user_characters($this->user);
		if($character_ids==0){//we havent a character yet, and thus we need to return 0 so that javascript can go about making the creation window
			$this->out=0;
		}else{//we do have characters, and we need to parse the result, cause there might be more than 1. If so, we now need to get the data ready for javascript
			$ids_array = explode(",", $character_ids);
			$character_array = array();//blank object to hold the object
			foreach($ids_array as $value){
				array_push($character_array, $this->mysql->get_character($value) );
			}
			
			$this->out = $this->json->encode($character_array);
			//here we need to split the string character_ids, then mysql query the table to get the characters, and get the results ready to send back to javacsript
		}
	}
}

//i have to at least invoke the class to get the info from it and print it out

$my_characters = new get_characters();
print $my_characters->out;

?>