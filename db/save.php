<?php
require_once 'mysql_interface.php';

class save extends mysql_interface{
	function save(){
		parent::mysql_interface();

		$relevant = array('lvl','attributes','armor','weapon','vehicle','skill','inventory','quest','equipped');//relevant items from save.js
 		$to_decode = array('lvl');

 		$character_id = $this->json->decode($this->_get('id'));//go ahead and get the value for the id

 		$prune = array();

		foreach($_GET as $k=>$v){
			if(in_array($k,$relevant)){
				$prune[$k]=(in_array($k,$to_decode))?$this->json->decode($v):$v;
			}
		}


		$this->out = $this->mysql->save_character_data($character_id,$prune);
		//$this->out = $this->json->encode($this->mysql->get_character( $id )); //$this->_get('id');
		//$this->out = 1;//$this->items['id'];//count($temp);
	}
}

$my_save = new save();
print $my_save->out;

?>