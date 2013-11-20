<?php
require_once 'mysql.php';
require_once 'json.php';

class mysql_interface{
	
	var $out = '';
	var $mysql = null;//new mysql();
	var $user = '';
	var $logged_in = false;

	var $action = '';

	var $json = null;

	function mysql_interface(){
		session_start();
		$this->mysql = new mysql();
		$this->user = $_SESSION[ $this->mysql->user_var ];
		$this->logged_in = $_SESSION[ $this->mysql_logged_in_var ];

		//$this->action = (isset($_GET['action']) && $_GET['action'] != '') ? $_GET['action'] : '';
		$this->action = $this->_get('action')	;	

		$this->json = new Services_JSON();//we are going to make the jason pbject here instead of in the node
	}

	//-----------
	function _get($value,$default=''){//this is how I get value from the ajax calls
		return (isset($_GET[$value]) && $_GET[$value] != '') ? $_GET[$value] : $default;
	}
}
?>