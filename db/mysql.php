<?php
require_once 'mysql_config.php';

class mysql extends mysql_config{

	var $users_table = 'game_users';//the name of the users table
	var $characters_table = 'game_characters';

	var $user_var = 'user';
	var $logged_in_var = 'isLogin';

	function mysql(){
		$dbhost = $this->host;//:3307
		$dbuser = $this->user; 
		$dbpass = $this->pass;
      
		define('dbname',$this->name);

		// make a connection to mysql here
		$conn = mysql_connect ($dbhost, $dbuser, $dbpass) or die ("I cannot connect to the database because: " . mysql_error());
		mysql_select_db (dbname) or die ("I cannot select the database '$dbname' because: " . mysql_error());
	}

	//-------------------------------------
	//      check if table exists
	//-------------------------------------
	//http://www.electrictoolbox.com/check-if-mysql-table-exists/php-function/
	function table_exists($table){
		$exists=0;
		$result = mysql_query("SHOW TABLES LIKE '$table'") or die ('error reading database while looking for a specific table');
		if (mysql_num_rows ($result)>0)$exists=1;
		return $exists;
	}
	//___________________________________________
	function create_users_table(){
		mysql_query("CREATE TABLE $this->users_table(
			id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
			user VARCHAR(36) NOT NULL,
			password VARCHAR(44) NOT NULL,
			actors VARCHAR(44) NOT NULL
			)")or die (mysql_error());
		//$this->create_user('admin','password','1');
	}
	function create_user($user,$password){
		if(!$this->table_exists($this->users_table)) $this->create_users_table();//create the table if it ain't already there
		//I need to make sure that there isn't already a user with the same name. so that it isn't input twice
		$passwordhashed = sha1($password);
		$query = "INSERT INTO $this->users_table (user, password, actors) 
				  VALUES ('$user', '$passwordhashed', 0)";
	
		mysql_query($query) or die('Error, creating user ' . mysql_error());    
	}
	function get_user_id($user){
		$id = mysql_query("SELECT id FROM $this->users_table WHERE user='$user'") or die( 'denied' );//get info from album table
		$a=	mysql_fetch_array( $id );
		return $a['id'];
	}
	function get_user_password($user){
		$all_users = mysql_query("SELECT * FROM  $this->users_table ORDER BY id DESC") or die( 'denied' );//get info from album table
		
		$found = 'denied';//default we did not find user

		while($au = mysql_fetch_array( $all_users )){
			if($au['user']==$user && $au['user']!='user' ) {//this user does indeed exists, also totally igone default user alled 'user'
				$found = $au['password'] ;
			}
		}

		return $found;
	}
	//get the characters for this user
	function get_user_characters($user){
		$actors = mysql_query("SELECT actors FROM $this->users_table WHERE user='$user'") or die( 'denied' );//get info from album table
		$a=	mysql_fetch_array( $actors );
		return $a['actors'];
	}
	function append_user_characters($user,$id){
		$a = $this->get_user_characters($user);
		$user_id = $this->get_user_id($user);
		$new_a = '';
		if($a!=0){
			$new_a =$a.','.$id;
		}else{
			$new_a=$id;
		}
		$query = "UPDATE $this->users_table SET actors= '$new_a' WHERE id='$user_id'";
		mysql_query($query);
		/*$query = "INSERT INTO $this->characters_table (name, race, class) 
				  VALUES ('$name', '$race', '$class')";
	
		mysql_query($query) or die('Error, creating character ' . mysql_error());*/
	}
	//-----------------------------------------
	function create_characters_table(){
		mysql_query("CREATE TABLE $this->characters_table(
			id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
			level INT(11) NOT NULL,
			name VARCHAR(36) NOT NULL,
			race VARCHAR(36) NOT NULL,
			class VARCHAR(36) NOT NULL,
			attributes VARCHAR(256) NOT NULL,
			equipped VARCHAR(256) NOT NULL,
			skill VARCHAR(1028) NOT NULL,
			inventory VARCHAR(1028) NOT NULL,
			weapon VARCHAR(256) NOT NULL,
			armor VARCHAR(256) NOT NULL,
			vehicle VARCHAR(256) NOT NULL,
			quest VARCHAR(1028) NOT NULL
			)")or die (mysql_error());
	}
	function create_character($name,$race,$class){
		if(!$this->table_exists($this->characters_table)) $this->create_characters_table();//create the table if it ain't already there

		$query = "INSERT INTO $this->characters_table (name, race, class) 
				  VALUES ('$name', '$race', '$class')";
	
		mysql_query($query) or die('Error, creating character ' . mysql_error());

		return mysql_insert_id();//return the id number  
	}
	function get_character($id){
		$raw_character =  mysql_query("SELECT * FROM $this->characters_table WHERE id='$id'") or 'character not found:'. mysql_error();
		while($info = mysql_fetch_array( $raw_character )){
			$character_array=array('id'=>$info['id'],
						'level'=>$info['level'], 
						'name'=>$info['name'], 
						'race'=>$info['race'], 
						'class'=>$info['class'],
						'attributes'=>$info['attributes'],
						'equipped'=>$info['equipped'],
						'skill'=>$info['skill'],
						'inventory'=>$info['inventory'],
						'weapon'=>$info['weapon'],
						'armor'=>$info['armor'],
						'vehicle'=>$info['vehicle'],
						'quest'=>$info['quest']);
		}
		//$this->nav_row = $character_array;
		return $character_array;
	}
	function save_character_data($id,$data){
		//i am needeing to do this variable transcribing, because the query string likes it best if I wrap the variables in single quotes. Which is hard to do without doing this
		$level =  $data['lvl'];
		$attributes =  $data['attributes'];
		$equipped = $data['equipped'];
		$skill =  $data['skill'];
		$inventory =  $data['inventory'];
		$weapon =  $data['weapon'];
		$armor =  $data['armor'];
		$vehicle =  $data['vehicle'];
		$quest =  $data['quest'];

		$query = "UPDATE $this->characters_table
			 SET level = '$level',
			 	attributes = '$attributes',
			 	equipped = '$equipped',
			 	skill = '$skill',
			 	inventory = '$inventory',
			 	weapon = '$weapon',
			 	armor = '$armor',
			 	vehicle = '$vehicle',
			 	quest = '$quest'
			 WHERE id='$id'";
		/*$query = "UPDATE $this->characters_table
			 SET level = '90'
			 WHERE id=$id";*/
		mysql_query($query);

		return 1;
	}


}
?>