<?php
/*class check_login{
	function check_login($login_page){
		
		if (!isset($_SESSION)) {
			session_start();
		}

	    if ( !$_SESSION['isLogin'] ) {
	      	header('Location: '.$login_page);
	        exit;
	    }
	}
}*/
require_once 'mysql_interface.php';

class user_interface extends mysql_interface{
	function user_interface(){
		parent::mysql_interface();
		$this->setup();
		switch($this->action){
			case 'check_login':
				$this->check_login();
				break;
			case 'sign_in':
				$this->sign_in();
				break;
			case 'sign_up':
				$this->sign_up();
				break;
			case 'log_out':
				$this->log_out();
				break;
			default:
				$this->check_login();
				break;
		}

	}
	function check_login(){
		if(!$_SESSION[$this->mysql->logged_in_var]){
			$this->out=0;//we are not logged in and we need to send false to javacsript to begin with the login page
		}else{
			$this->out=$_SESSION[$this->mysql->user_var];//send the user name along since we will need it if the user just refreshes
		}
	}
	//----------------------
	function sign_in(){
		$user = $this->_get('user');
		$password = $this->_get('password');

		$check_to = $this->mysql->get_user_password($user);//get the user data
		
		if($check_to!='denied'){//we are a go, user exists
		
			$passwordhashed = sha1($password);
		
			if ($passwordhashed === $check_to) {
	  
	        	$_SESSION[ $this->mysql->logged_in_var ] = true;
	        	$_SESSION[ $this->mysql->user_var ] = $user;
	    
	        	//$this->out = '<script>document.location.href="index_bak.html";</script>';
	        	$this->out = 1;//'<script>document.location.href="index.php";</script>';
	    
	           	return true;
	    	} else {
	        	$this->out = 'wrong password';
	    	} 	
		}else{
			$this->out = 'user does not exist';
		}
		return false;	
	}
	//---------------
	function sign_up(){
		$user = $this->_get('user');
		$password = $this->_get('password');

		//check if there is already a user with this name
		$check_to = $this->mysql->get_user_password($user);
		if($check_to=='denied'){//this means that we can make this user since it does not already exists
			$this->mysql->create_user($user,$password);
			$this->out = 1;
		}else{
			$this->out = 'user name already taken, pleace choose anothers';
		}
	}
	function log_out(){
		$_SESSION[ $this->mysql->logged_in_var ] = false;
		$this->out = 1;
	}
	//this is a function that runs the first time to set up the users table if it does not already exists
	//------
	function setup(){
		$exists=$this->mysql->table_exists( $this->mysql->users_table );//check to see if the users table 
		if(!$exists){
			$this->mysql->create_user('user','password');//a dummy user profile just to get things started
			$this->mysql->create_character('name','race','class');// a dummy character just to get things started
		}
	}
}

$my_user_interface = new user_interface();
print $my_user_interface->out;

?>