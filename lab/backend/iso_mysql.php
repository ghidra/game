<?php
require_once '../rad/backend/mysql.php';
class iso_mysql extends mysql{

	public function __construct(){
		parent::__construct('/../../backend/iso_mysql_login.php');///this path is relative to myslq.php
		
		include('iso_mysql_login.php');
		
		$this->mysql_iso_maps_table = $mysql_iso_maps_table;
		//$this->path = $mysql_iso_maps_table;
	}

	///this is called by the parent class if there is no user table
	public function init_tables($users_table){
		$this->create_users_table($users_table);
		$this->create_iso_map_table();
	}

	//////////////////////////////////////////////
	// create database stuff
	//////////////////////////////////////////////

	function create_iso_map_table(){
		if(!$this->table_exists($this->mysql_iso_maps_table))
		{
			mysqli_query($this->conn,"CREATE TABLE $this->mysql_iso_maps_table(
				link_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
				user_id INT(11) NOT NULL,
				title TEXT NOT NULL,
				description TEXT NOT NULL,
				map VARCHAR(8192) NOT NULL,
				posttime DATETIME,
				FOREIGN KEY (user_id) REFERENCES $this->user_table(user_id) ON DELETE CASCADE
				)")or die ($this->errMsg = mysqli_error($this->conn));
		}
	}
	///////////////////////////////
	/// check that file name exists already
	///////////////////////////
	function check_for_file_name($name){
		//check for file name
	}
	///////////////////////////////
	/// save a file
	///////////////////////////
	function save_file($name,$data,$description=""){
		$user_id = $_SESSION['user_id'];
		$posttime = date("Y-m-d H:i:s");
		$query = "INSERT INTO $this->mysql_iso_maps_table (user_id, title, description, ascii, posttime) VALUES ('$user_id', '$name', '$description', '$data','$posttime')";
		$raw = mysqli_query($this->conn,$query) or die($this->errMsg .= 'Error, adding ascii file: ' . mysqli_error($this->conn)); 
	
		return $raw;
	}
	///////////////////////////////
	/// get file
	///////////////////////////
	function get_file($name){
		$raw = mysqli_query($this->conn,"SELECT * FROM $this->mysql_iso_maps_table WHERE title LIKE '$name' ORDER BY link_id DESC");// or die($this->errMsg = 'Error, getting files, or, there are NO FILES to get: '. mysqli_error());
		$count=0;
		$arr=array();
		while($info = mysqli_fetch_array( $raw ))
		{
			$arr[$count] = $info['ascii'];
			$count++;
		}
		return $arr;
	}
	///////////////////////////////
	/// get file list
	///////////////////////////
	function get_file_list(){
		$raw =  mysqli_query($this->conn,"SELECT * FROM $this->mysql_iso_maps_table ORDER BY link_id DESC ") or die($this->errMsg = 'Error, getting files, or, there are NO FILES to get: '. mysqli_error());
		$count=0;
		$arr=array();
		while($info = mysqli_fetch_array( $raw ))
		{
			$arr[$count] = $info['title'];
			$count++;
		}
		return $arr;
	}

}
?>