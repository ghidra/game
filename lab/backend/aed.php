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

	//return $mysql->conn;
	//return "WACA WCACA";
	if(!$login->logged_in)
	{
		//return "we almost trying to log in";
		return $mysql->errMsg . $login->errMsg . $login->get_login_page();
	}
	else
	{
		return logout_button();
		//return "we are logged in somehow";
	}

}

if ( isset($_GET['q'])  )
{
	$payload = new stdClass();

	if($_GET['q']=='logout')
	{
		$logout = new logout();
		$payload->http = attemp_login($_GET);
		echo json_encode($payload);
		//echo attemp_login($_GET);
	}

	if($_GET['q']=='login')	
	{
		if(isset($_SESSION['logged_in']))
		{
			//echo "WE ARE LOGGED IN";
			$payload->http = logout_button();
			echo json_encode($payload);
		}
		else
		{
			//echo "WE ARE NOT LOGGED IN";
			//$payload->action = ;
			$payload->http = attemp_login($_GET);//json_decode($_GET['payload'],true);
			echo json_encode($payload);
		}
	}
}

////passwords are send via post
if ( isset($_POST['q'])  )
{
	$payload = new stdClass();
	if($_POST['q']=='login')
	{
		$payload->http = attemp_login($_POST);
		echo json_encode($payload);
	}
}
?>