game.math={};//this is just going to be an object itself that has methods
game.math.random=function(seed){
  seed = seed||Math.round(Math.random()*999);
  return Math.abs(Math.sin(seed++));
}
game.math.rescale=function(v,l1,h1,l2,h2){
  return l2 + (v - l1) * (h2 - l2) / (h1 - l1);
}
game.math.fit=function(v,l1,h1,l2,h2){//alias incase I get confused by XSI vs houdini
  return game.math.rescale(v,l1,h1,l2,h2);
}
game.math.clamp=function(v,min,max){
  return Math.min(Math.max(v, min), max);
}
