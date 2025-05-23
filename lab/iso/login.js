iso.login = function(io){
    this.rad_io = new rad.io("iso","backend/iso.php",rad.closure(this,this.database_connected_callback));
    this.div=null;

    this.user=null;
    this.user_id=null;

    this.io=io;

    return this;
}

iso.login.prototype.render=function(div,login){

  if(this.div==null){
    this.div=div;
  }
  if(this.div!=null){
    bar = document.createElement("DIV");

    if(login!=null){
      bar_login = document.createElement("DIV");
      bar_login.innerHTML=login.html;
      bar.appendChild( bar_login );
    }
    
    this.div.innerHTML="";//empty it
    this.div.appendChild(bar);
  }
}

iso.login.prototype.database_connected_callback=function(data){
  //console.log("---DATABASE EXISTS");
  parsed = JSON.parse(data);

  if(parsed.action=="login_page"){

  }
  
  if(parsed.action=="logout_page"){
    this.rad_io.filelist=parsed.files;
    this.rad_io.set_storage_type_mysql(parsed.files);
    this.rad_io.set_user(parsed.user);//set the user on the file
    //console.log("user name: "+parsed.user.name);
    //console.log("user id: "+parsed.user.id);
  }

  
  
  //we need to basically reload everything
  //console.log(console.dir(this._this));
  this.render(null,parsed);
  this.io.init(this.rad_io,this.div);
  //console.log(console.dir(parsed))
}
iso.login.prototype.process_login=function(form_name){
  this.rad_io.process_login(form_name,"backend/iso.php",rad.closure(this,this.login_callback));
}
iso.login.prototype.login_callback=function(data){
  //console.log(data);
  parsed = JSON.parse(data);
  this.render(null,parsed);
  console.log("---LOGGED IN, we have " +parsed.files);
}
iso.login.prototype.logout=function(){
  this.rad_io.logout("backend/iso.php",rad.closure(this,this.logout_callback));
}
iso.login.prototype.logout_callback=function(data){
  parsed = JSON.parse(data);
  this.render(null,parsed);
  console.log("---LOG OUT IN, AND WE DID A CALL BACK");
}