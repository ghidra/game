//--------code from google's webgl utilities
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, fps,/* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/(fps||30));//30fps
         };
})();
//----
