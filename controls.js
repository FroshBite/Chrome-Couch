var pointer = document.getElementById("mouse");
var start;
var x = 0;
var y = 0;
var scrollx=0;
var scrolly=0;

var rAF = window.mozRequestAnimationFrame ||
 window.requestAnimationFrame;

var rAFStop = window.mozCancelRequestAnimationFrame ||
  window.cancelRequestAnimationFrame;

window.addEventListener("gamepadconnected", function() { //connected
  var gp = navigator.getGamepads()[0];
  console.log("Gamepad connected");
  
  pointer.style.display="inline-block";
  gameLoop();
});

window.addEventListener("gamepaddisconnected", function() { //disconnected
  
  // pointer.style.display="none";

  // pointer.parentNode.removeChild(pointer); // remove pointer
  rAFStop(start);
});

if(navigator.GetGamepads) {
  // Webkit browser that uses prefixes
  var interval = setInterval(webkitGP, 500);
}

function webkitGP() {
  var gp = navigator.GetGamepads()[0];
  if(gp) {
    
    gameLoop();
    clearInterval(interval);
  }
}

function gameLoop() {
  var sensitivity=14;
  var tolerance=0.03; //so that the cursor doesnt move around when left idle

  if(navigator.GetGamepads) {
    var gp = navigator.GetGamepads()[0];

    if(Math.abs(gp.axes[0])>=tolerance) {
      x += gp.axes[0];
      console.log("Gp axes [0] " +gp.axes[0]);
    }
    if(Math.abs(gp.axes[1])>=tolerance) {
      y += gp.axes[1];
      console.log("Gp axes [1] " +gp.axes[1]);
    }
  } else {
    var gp = navigator.getGamepads()[0];

    if(Math.abs(gp.axes[0])>=tolerance) {
      x += gp.axes[0];
      console.log("Gp axes [0] " +gp.axes[0]);
    }
    if(Math.abs(gp.axes[1])>=tolerance) {
      y += gp.axes[1];
      console.log("Gp axes [1] " +gp.axes[1]);
    }
  }

  //Scrolling function
  if(navigator.GetGamepads) {
    var gp = navigator.GetGamepads()[0];

    if(Math.abs(gp.axes[2])>=tolerance) {
      scrollx += gp.axes[0];
      console.log("Gp axes [2] " +gp.axes[2]);
    }
    if(Math.abs(gp.axes[3])>=tolerance) {
      scrolly += gp.axes[3];
      console.log("Gp axes [3] " +gp.axes[3]);
    }
  } else {
    var gp = navigator.getGamepads()[0];

    if(Math.abs(gp.axes[2])>=tolerance) {
      scrollx += gp.axes[2];
      console.log("Gp axes [2] " +gp.axes[2]);
    }
    if(Math.abs(gp.axes[3])>=tolerance) {
      scrolly += gp.axes[3];
      console.log("Gp axes [3] " +gp.axes[3]);
    }
  }


    pointer.style.left = x*sensitivity + "px";
    pointer.style.top =y*sensitivity + "px";

	if(scrollx<0){scrollx=0};
	if(scrolly<0){scrolly=0};

	window.scrollTo(scrollx*sensitivity, scrolly*sensitivity);

if(gp.buttons[0].pressed==true){
  	console.log("hey");
	document.elementFromPoint(parseInt(pointer.style.left,10), parseInt(pointer.style.top,10)).click();
  document.elementFromPoint(parseInt(pointer.style.left,10), parseInt(pointer.style.top,10)).focus();
  }

  var start = rAF(gameLoop);
};
