var gamepadInfo = document.getElementById("gamepad-info");
var pointer = document.getElementById("mouse");
var start;
var a = 0;
var b = 0;

var rAF = window.mozRequestAnimationFrame ||
 window.requestAnimationFrame;

var rAFStop = window.mozCancelRequestAnimationFrame ||
  window.cancelRequestAnimationFrame;

window.addEventListener("gamepadconnected", function() { //connected
  var gp = navigator.getGamepads()[0];
  console.log("Gamepad connected");
  //gamepadInfo.innerHTML = "Gamepad connected at index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.";
  
  
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
  if(navigator.GetGamepads) {
    var gp = navigator.GetGamepads()[0];

    if(gp.buttons[0] == 1) {
      b--;
    } else if(gp.buttons[1] == 1) {
      a++;
    } else if(gp.buttons[2] == 1) {
      b++;
    } else if(gp.buttons[3] == 1) {
      a--;
    }
  } else {
    var gp = navigator.getGamepads()[0];

    if(gp.buttons[0].value > 0 || gp.buttons[0].pressed == true) {
      b--;
    } else if(gp.buttons[1].value > 0 || gp.buttons[1].pressed == true) {
      a++;
    } else if(gp.buttons[2].value > 0 || gp.buttons[2].pressed == true) {
      b++;
    } else if(gp.buttons[3].value > 0 || gp.buttons[3].pressed == true) {
      a--;
    }
  }

  pointer.style.left = a*2 + "px";
  pointer.style.top = b*2 + "px";

  var start = rAF(gameLoop);
};