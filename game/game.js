game={};//this is the MAIN object
game.includes={
	lib:[
		//include
		//"core/framework",
		"core/framerate",
		"core/cookie",
		"core/brain",
		"core/tick",
		"core/ajax",
		"math/vector2",
		"game/actor",
		"game/pawn",
		"game/pawn_factory",
		"game/archetypes",
		"game/race",
		"game/class",
		"game/list",
		"game/inventory",
		"game/purse",
		"game/item",
		"game/weapon",
		"game/armor",
		"game/vehicle",
		"game/skill",
		"game/damage_type",
		"game/flick",
		"game/planet",
		//"game/destination",
		"game/quest",
		"gui/dom",
		"gui/entry",
		"gui/progressbar",
		"gui/pane",
		"gui/inventory_item",
		"net/web_socket",
		"net/net",
		"db/user_interface",
		"db/user_character_select",
		"db/save",
		"archetypes/race/human",
		"archetypes/race/alien",
		"archetypes/race/lizard",
		"archetypes/race/caveman",
		"archetypes/race/cyborg",
		"archetypes/class/programmer",
		"archetypes/class/artist",
		"archetypes/class/warrior",
		"archetypes/damage_type/basic",
		"archetypes/weapon/bare_hands",
		"archetypes/weapon/stick",
		"archetypes/weapon/rock",
		"archetypes/skill/fire",
		"archetypes/skill/ice",
		"archetypes/item/money",
		"archetypes/item/berries",
		"archetypes/item/coconut",
		"archetypes/armor/dead_leaves",
		"archetypes/vehicle/go_cart",
		"archetypes/planet/earth",
		//"archetypes/destination/arbitrary",
		"archetypes/destination/thornberry",
		"archetypes/destination/valhalla",
		"archetypes/destination/thornwood",
		"archetypes/quest/where_am_i",
		"archetypes/quest/introduction",
		//"archetypes/quest/journey"
		//include
	],
	include:function(src){
		document.write('<script type="text/javascript" language="Javascript" src="'+src+'"></script>')
	},
	complete_links:function(path,links){
		for(var i=0; i<links.length; i++){
			links[i]="game/src/"+path+links[i]+".js";
		}
	},
	load_libraries:function(program){
		this.complete_links("",this.lib);
		for(var i in this.lib){
			this.include(this.lib[i]);		
		}
        this.include(program);
	},
	/*load:function(lib,path){

	}*/
}
//----------------------------------------------
game.includes.load_libraries('index.js');