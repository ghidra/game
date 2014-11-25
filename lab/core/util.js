game.util={};
game.util.is_empty=function(obj){
  for(var key in obj) {
      if (obj.hasOwnProperty(key)) {
         return false;
      }
   }
   return true;
}
