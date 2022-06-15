<?php
require_once '../rad/backend/mysql.php';
class mysql_aed extends mysql{

	public function __construct(){
		//
		parent::__construct('/../../backend/mysql_login.php');///this path is relative to myslq.php
		
		include('mysql_login.php');
		$this->mysql_ascii_table = $mysql_ascii_table;
		$this->path = $mysql_ascii_table;
	}

	///this is called by the parent class if there is no user table
	public function init_tables($users_table){
		$this->create_users_table($users_table);
		$this->create_ascii_table();
	}

	//////////////////////////////////////////////
	// create database stuff
	//////////////////////////////////////////////

	function create_ascii_table(){
		if(!$this->table_exists($this->mysql_ascii_table))
		{
			mysqli_query($this->conn,"CREATE TABLE $this->mysql_ascii_table(
				link_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
				user_id INT(11) NOT NULL,
				title TEXT NOT NULL,
				description TEXT NOT NULL,
				ascii VARCHAR(1024) NOT NULL,
				posttime DATETIME,
				FOREIGN KEY (user_id) REFERENCES $this->user_table(user_id) ON DELETE CASCADE
				)")or die ($this->errMsg = mysqli_error($this->conn));
		}
	}

	///////////////////////////////
	/// get data from tables
	///////////////////////////
	function get_file_list(){
		$raw =  mysqli_query($this->conn,"SELECT * FROM $this->mysql_ascii_table ORDER BY link_id DESC ") or die($this->errMsg = 'Error, getting files, or, there are NO FILES to get: '. mysqli_error());
		$count=0;
		$arr=array();
		while($info = mysqli_fetch_array( $raw ))
		{
			$arr[$count] = $info;
			$count++;
		}
		return $arr;
	}

}
?>