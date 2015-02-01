var pointer = document.getElementById("mouse");
var start;

//used for the cursor positions
var x = 0;
var y = 0;

//used for scrolling
var scrollx=0;
var scrolly=0;

//If the controller is currently connected
var connected=false;

//To do with requesting animations with the web browser
var rAF = window.mozRequestAnimationFrame || window.requestAnimationFrame;

var rAFStop = window.mozCancelRequestAnimationFrame || window.cancelRequestAnimationFrame;

//On page load, will check for an existing connection to a gamepad.
window.addEventListener("load", function(){
  if(navigator.getGamepads()) {
    var gp = navigator.getGamepads()[0];
    console.log("Gamepad connected");
    pointer.style.display="inline-block";
    connected=true;
    gameLoop();
  }
});

//executes when the gamepad is first connected in a single tab session
window.addEventListener("gamepadconnected", function() {
  var gp = navigator.getGamepads()[0]; //capturing the first gamepad object from the gamepad array
  console.log("Gamepad Connected");
  chrome.runtime.sendMessage({gamepad: "connected"}, function(response) {
    console.log(response.affirm);
  });
  connected=true;

  pointer.style.display="inline-block"; //Displays the cursor
  gameLoop(); //runs gameLoop which handles everything to do with the cursor
});

//Executes when the gamepad is disconnected within a tab session
window.addEventListener("gamepaddisconnected", function() {
  chrome.runtime.sendMessage({gamepad: "disconnected"}, function(response) {
    console.log(response.affirm);
  });
  pointer.style.display="none"; //hides the cursor from the user
  rAFStop(start); //stops the browser from refreshing the animation
});

function gameLoop() {
  var cursorSensitivity=14;
  var scrollSensitivity=14;
  var tolerance=0.01; //so that the cursor doesnt move around when left idle

  if(connected) {
    //Storing the first gamepad that is connected
    var gp = navigator.getGamepads()[0];

    //for moving the cursor around. Only moves after it detects movement past the tolerance
    if(Math.abs(gp.axes[0])>=tolerance) { //harizontal movment
      x += gp.axes[0]; //the left joystick right and left; ranges from -1 to 1
    }
    if(Math.abs(gp.axes[1])>=tolerance) { //vertical movement
      y += gp.axes[1];//the left joystick up and down; ranges from -1 to 1
    }

    //For scrolling using the right joystick. Only moves after it detects movemenent past the tolerance
    if(Math.abs(gp.axes[2])>=tolerance) {
      scrollx += gp.axes[2]; //the right joystick right and left; ranges from -1 to 1
    }
    if(Math.abs(gp.axes[3])>=tolerance) {
      scrolly += gp.axes[3];//the right joystick up and down; ranges from -1 to 1
    }

    //===============Button Handlers=================
    //When the user presses the "A" button
    if(gp.buttons[0].pressed==true){
      document.elementFromPoint(parseInt(pointer.style.left,10), parseInt(pointer.style.top,10)).click();
      document.elementFromPoint(parseInt(pointer.style.left,10), parseInt(pointer.style.top,10)).focus();
    }

    //Moves the actual position of the cursor based on the new values of x and y
    pointer.style.left = x*cursorSensitivity + "px";
    pointer.style.top =y*cursorSensitivity + "px";

    //Keeps the user from scrolling outside the screen
	  if(scrollx<0)
      scrollx=0;
    if(scrolly<0)
      scrolly=0;

    //Scrolls the actual window based on the scrollx and scrolly values
	  window.scrollTo(scrollx*scrollSensitivity, scrolly*scrollSensitivity);
    var start = rAF(gameLoop); //requests a browser animation and calls upon the gameLoop function again recursively
  }
}
