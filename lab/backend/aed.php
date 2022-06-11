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
		$payload->html = logout_button();
		$payload->message = "";
		$payload->action = "logout_page";
		//return $payload;
		//return "we are logged in somehow";
	}
	return $payload;
}

function get_file_list(){
	$mysql = new mysql_aed();
	$files = $mysql->get_file_list();
	return "we doing something";
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
		echo get_file_list();
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
}
?>