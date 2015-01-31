var gamepadInfo = document.getElementById("gamepad-info");
var pointer = document.getElementById("mouse");
var start;
var x = 0;
var y = 0;

var rAF = window.mozRequestAnimationFrame ||
 window.requestAnimationFrame;

var rAFStop = window.mozCancelRequestAnimationFrame ||
  window.cancelRequestAnimationFrame;

window.addEventListener("gamepadconnected", function() { //connected
  var gp = navigator.getGamepads()[0];
  console.log("Gamepad connected");
  //gamepadInfo.innerHTML = "Gamepad connected at index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.";
  pointer.style.display="inline-block";

  gameLoop();
});

window.addEventListener("gamepaddisconnected", function() { //disconnected
  //gamepadInfo.innerHTML = "Waiting for gamepad.";
  pointer.parentNode.removeChild(pointer); // remove pointer
  rAFStop(start);
});

if(navigator.GetGamepads) {
  // Webkit browser that uses prefixes
  var interval = setInterval(webkitGP, 500);
}

function webkitGP() {
  var gp = navigator.GetGamepads()[0];
  if(gp) {
    gamepadInfo.innerHTML = "Gamepad connected at index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.";
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

    pointer.style.left = x*sensitivity + "px";
    pointer.style.top =y*sensitivity + "px";


  var start = rAF(gameLoop);
};
