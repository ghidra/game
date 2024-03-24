<?php
require_once 'mysql_aed.php';
require_once '../rad/backend/login.php';

function logout_button()
{
	$s='<div>
		<div id="user_id" class="invisible">'.$_SESSION['user_id'].'</div>
		<div id="user_name">'.$_SESSION['user'].'</div>
		<button onclick="logout()">logout</button>
	</div>';

	return $s;
}

function attemp_login($payload){
	$mysql = new mysql_aed();
	$login = new login($mysql,$payload);

	$payload = new stdClass();
	//return $mysql->conn;
	//return "WACA WCACA";
	if(!$login->logged_in)
	{
		$payload->html = $login->get_login_page();
		$payload->message = $mysql->errMsg . $login->errMsg;
		$payload->action = "login_page";
		//return "we almost trying to log in";
		//return $mysql->errMsg . $login->errMsg . $login->get_login_page();
		//return $payload;
	}
	else
	{
		//log in
		$payload->html = logout_button();
		$payload->message = "";
		$payload->action = "logout_page";
		///WE NEED TO GO AHEAD AND GET OUR FILE LIST TO PASS ALONG
		$payload->files = get_file_list($mysql);
		$payload->user= get_user_info();

		//return $payload;
		//return "we are logged in somehow";
	}
	return $payload;
}
function get_user_info(){
	$payload = new stdClass();
	$payload->name = $_SESSION["user"];
	$payload->id = $_SESSION["user_id"];
	return $payload;
}
function get_file_list($mysql=null){
	$mysql = (is_null($mysql) == true) ? new mysql_aed() : $mysql;
	$payload = $mysql->get_file_list();

	return $payload;//"we doing something";
}
function load_file($name){
	$mysql = new mysql_aed();
	$payload = $mysql->get_file($name);
	return $payload;
}
function find_file_name($name){
	//potentially do this to check before overwritting
	return null;
}
function save_file($name,$data){
	$mysql = new mysql_aed();
	return $mysql->save_file($name,$data);
}
//------------------------------------
if ( isset($_GET['q'])  )
{

	if($_GET['q']=='logout')
	{
		$logout = new logout();
		
		echo json_encode(attemp_login($_GET));
		//echo attemp_login($_GET);
	}

	if($_GET['q']=='login')	
	{
		if(isset($_SESSION['logged_in']))
		{
			//echo "WE ARE LOGGED IN";
			$payload = new stdClass();
			$payload->html = logout_button();
			$payload->message = "";
			$payload->action = "logout_page";
			$payload->files = get_file_list();
			$payload->user= get_user_info();
			echo json_encode($payload);
		}
		else
		{
			//echo "WE ARE NOT LOGGED IN";
			//$payload->action = ;
			//$payload->http = attemp_login($_GET);//json_decode($_GET['payload'],true);
			echo json_encode(attemp_login($_GET));
		}
	}
	if($_GET['q']=='list')
	{
		echo json_encode(get_file_list());
	}
	if($_GET['q']=='load')
	{
		//echo json_encode(load_file($_GET['name']));
		$files = load_file($_GET['name']);//we get back an array assuming multiple files
		echo $files[0];//we are gonna send the first one
	}

}

////passwords are send via post
if ( isset($_POST['q'])  )
{
	//$payload = new stdClass();
	if($_POST['q']=='login')
	{
		//$payload->http = attemp_login($_POST);
		echo json_encode(attemp_login($_POST));
	}
	if($_POST['q']=='save'){
		
		//$incoming = json_decode(html_entity_decode(stripslashes($_POST['data'])));
		//$incoming = json_decode($_POST['data']);

		//save_file($_POST['name'],$_POST['data']);

		$payload = new stdClass();
		//$payload->message = $_GET['name']." :AND: ".$_GET['data'];
		$payload->message = save_file($_POST['name'],$_POST['data']);
		//$payload->debug = $incoming[0]->xdiv;//$_POST['data'];
		
		echo json_encode($payload);
	}
}
?>