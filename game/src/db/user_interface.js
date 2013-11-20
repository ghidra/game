game.user_interface=function(layer,callback){
	return this.init(layer,callback);
}
game.user_interface.prototype.init=function(layer,callback){
	var _this = this;
	this.layer = layer;
	this.callback = callback;
	new game.ajax(
		'db/user_interface.php',
		{
			'action':'check_login'
		},
		'get',
		function(transport){
			if(transport!='0'){//we are logged in.. we can proceed to a character select screen
				//alert(transport);
				_this.callback(transport);//the transport in this case is the user id/name
			}else{//no character exists, we need to preset character creation
				//build the log in window
				_this.login_window(layer);
				//_this.callback(); //this is just to test it without having to be logged in
			}
		}
	);
}
game.user_interface.prototype.login_window=function(layer){
	var _this = this;

	var wrapper = new game.dom.element('div',{'id':'character_select_window','class':'character_select_window','style':'width:210px;margin-left:auto;margin-right:auto;text-align:center;margin-top:16px;'});

	//------sign in part
	var sign_in = new game.dom.element('div',{'id':'sign_in_container','class':'sign_in_container','style':'width:100px;float:left;'});
	var sign_in_form = new game.dom.element('div',{'id':'sign_in_form','class':'sign_in_form'});
	var sign_in_name = new game.dom.element('input',{'type':'text','id':'sign_in_name','class':'sign_in_name','style':'width:100px;','value':'user'});
	var sign_in_pass = new game.dom.element('input',{'type':'password','id':'sign_in_password','class':'sign_in_password','style':'width:100px;','value':'password'});
	var sign_in_button = new game.dom.element('button',{'id':'sign_in_button','class':'sign_in_button'});

	sign_in_button.innerHTML = 'sign in';
	sign_in_button.onclick=function(){_this.sign_in();};

	sign_in_form.appendChild(sign_in_name);
	sign_in_form.appendChild(sign_in_pass);
	sign_in_form.appendChild(sign_in_button);
	sign_in.appendChild(sign_in_form);
	//-------------------------

	//------sign in part
	var sign_up = new game.dom.element('div',{'id':'sign_up_container','class':'sign_up_container','style':'width:100px;float:right;'});
	var sign_up_form = new game.dom.element('div',{'id':'sign_up_form','class':'sign_up_form'});
	var sign_up_name = new game.dom.element('input',{'type':'text','id':'sign_up_name','class':'sign_up_name','style':'width:100px;'});
	var sign_up_pass = new game.dom.element('input',{'type':'password','id':'sign_up_password','class':'sign_up_password','style':'width:100px;'});
	var sign_up_pass_confirm = new game.dom.element('input',{'type':'password','id':'sign_up_password_confirm','class':'sign_up_password_confirm','style':'width:100px;'});
	var sign_up_button = new game.dom.element('button',{'id':'sign_up_button','class':'sign_up_button'});

	sign_up_button.innerHTML = 'sign up';
	sign_up_button.onclick=function(){_this.sign_up();};

	sign_up_form.appendChild(sign_up_name);
	sign_up_form.appendChild(sign_up_pass);
	sign_up_form.appendChild(sign_up_pass_confirm);
	sign_up_form.appendChild(sign_up_button);
	sign_up.appendChild(sign_up_form);
	//-------------------------

	//-------error read out
	//return '<div style="color:red;width:200px;text-align:center;margin-left:auto;margin-right:auto;">'.$err.'</div>';
	var error_console = new game.dom.element('div',{'id':'error_console','class':'error_console','style':'color:red;width:200px;text-align:center;margin-left:auto;margin-right:auto;'});

 	wrapper.appendChild(sign_in);
 	wrapper.appendChild(sign_up);
 	wrapper.appendChild(error_console);

	if(layer){//if we have been given a layer to put it, put it
		var con = document.getElementById( layer );
		con.appendChild(wrapper);
	}
}

game.user_interface.prototype.sign_in=function(){
	var _this = this;
	var user =  document.getElementById('sign_in_name').value;
	var password =  document.getElementById('sign_in_password').value;
	new game.ajax(
		'db/user_interface.php',
		{
			'action':'sign_in',
			'user': user,
			'password' : password
		},
		'get',
		function(transport){
			if(transport=='1'){//we are logged in.. we can proceed to a character select screen
				var con = document.getElementById(_this.layer);
				con.innerHTML='';
				_this.callback(user);
			}else{//no character exists, we need to preset character creation
				//show the errir
				var error_console = document.getElementById('error_console');
				error_console.innerHTML = transport;
				//_this.login_window(layer);
			}
		}
	);
	//alert('trying to sign in');
}
game.user_interface.prototype.sign_up=function(){
	//var _this = this;
	var user =  document.getElementById('sign_up_name').value;
	var password =  document.getElementById('sign_up_password').value;
	var password_confirm =  document.getElementById('sign_up_password_confirm').value;

	if(password == password_confirm && password != ''){
		if( !/^\s*$/.test(user) ){
			new game.ajax(
				'db/user_interface.php',
				{
					'action':'sign_up',
					'user': user,
					'password' : password
				},
				'get',
				function(transport){
					var error_console = document.getElementById('error_console');
					if(transport=='1'){//we created a new user, now log in
						error_console.innerHTML = 'successfully created user, now just log in';
					}else{//no character exists, we need to preset character creation
						error_console.innerHTML = transport;
					}
				}
			);
		}else{
			alert('you need a user name');
		}
	}else{
		alert('passwords do not match');
	}
}