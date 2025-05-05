iso.io=function(){
	return this;
}

iso.io.prototype.init=function(io,div){
	//this.rad_io = io;
	this.controls={};
	//console.log(io.filelist);
	//_this = this;
  	_save = rad.closure(io,io.save);
  	_load = rad.closure(io,io.load);
  	_loadCallback = rad.closure(this,this.load);
  	_list = io.filelist;
  	//console.log(this.io);
	///------save and load
	this.controls.saveas_tb = new rad.textbox({
		"id":"saveas",
		"label":"",
		"value":"",
		"style":{"width":140,"clear":"none","float":"left"},
		"style_label":{"width":0},
		"style_textbox":{"width":140}
	});
	this.controls.saveas_bu = new rad.button({
		"id":"saveas_bu",
		"label":"save",
		"style":{"float":"left","clear":"none"},
		"callback":function(arg){
			//get the save file name
			var filename = document.getElementById("tb_saveas_").value;
			if(filename===""){
				alert("save: no file name given");
				return null;
			}
			//Array.from(chainsaw.spriteBufferArray);//convert from float32array to normal float array
			//console.log(chainsaw.spriteBufferArray);
			arr = Array.from(chainsaw.spriteBufferArray);
			arr = rad.cleararraypastindex(arr,(chainsaw.spriteCount)*chainsaw.spriteBufferStride);//remove the ui sprite
			data = {};
			data.spriteBuffer = arr;
			data.description = {};
			data.description.images = chainsaw.images_src;

			_save({"name":filename,"src":data});
		}
	});
	this.controls.load_dd = new rad.dropdown({
		"id":"load",
		"label":"",
		"options":_list,
		"value":0,
		"style":{"width":140,"clear":"none","float":"left"},
		"style_label":{"width":0},
		"style_dropdown":{"width":140}
	});
	this.controls.load_bu = new rad.button({
		"id":"bu_load",
		"label":"load",
		"style":{"float":"left","clear":"none"},
		"callback":function(arg){
			var fileid = document.getElementById("dd_load_").value;
			//console.log(fileid);
			var loadedfile = _load({"name":fileid,"callback":_loadCallback});
		}
	});

	div.appendChild( this.controls.saveas_tb.getelement()) ;
    div.appendChild( this.controls.saveas_bu.getelement() );
    div.appendChild( this.controls.load_dd.getelement()) ;
    div.appendChild( this.controls.load_bu.getelement() );
    //div.appendChild( this.controls.import_bu.getelement()) ;
    //div.appendChild( this.controls.export_bu.getelement() );
}
iso.io.prototype.load=function(data){
	console.log(data.images_src);
	chainsaw.newSpriteBuffer(data.spriteBuffer);// new Float32Array();
}