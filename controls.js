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

//Stores the gamepad object
var gp;

//Used for mapping buttons and keeping track of what it pressed.
var pressedButton=new Array("false","false","false");

//To do with requesting animations with the web browser
var rAF = window.mozRequestAnimationFrame || window.requestAnimationFrame;

var rAFStop = window.mozCancelRequestAnimationFrame || window.cancelRequestAnimationFrame;

//On page load, will check for an existing connection to a gamepad.
window.addEventListener("load", function(){
  if(navigator.getGamepads()) {
    gp = navigator.getGamepads()[0];
    console.log("Gamepad connected");
    pointer.style.display="inline-block";
    connected=true;
    gameLoop();
  }
});

//executes when the gamepad is first connected in a single tab session
window.addEventListener("gamepadconnected", function() {
  gp = navigator.getGamepads()[0]; //capturing the first gamepad object from the gamepad array
  console.log("Gamepad Connected");
  //chrome.runtime.sendMessage({gamepad: "connected"}, function(response) {
  //  console.log(response.affirm);
  //});
  connected=true;

  pointer.style.display="inline-block"; //Displays the cursor
  gameLoop(); //runs gameLoop which handles everything to do with the cursor
});

//Executes when the gamepad is disconnected within a tab session
window.addEventListener("gamepaddisconnected", function() {
  //chrome.runtime.sendMessage({gamepad: "disconnected"}, function(response) {
  //  console.log(response.affirm);
  //});
  pointer.style.display="none"; //hides the cursor from the user
  rAFStop(start); //stops the browser from refreshing the animation
});

function gameLoop() {
  var cursorSensitivity=14;
  var scrollSensitivity=14;
  var tolerance=0.05; //so that the cursor doesnt move around when left idle

  if(connected) {
    //Storing the first gamepad that is connected
    var gp = navigator.getGamepads()[0];

    var leftx=0.0, lefty=0.0, rightx=0.0, righty=0.0; //Left analog stick for cursor movement, right analog stick for scrolling

    leftx=gp.axes[0];
    lefty=gp.axes[1];
    rightx=gp.axes[2];
    righty=gp.axes[3];

    //Applies tolerancing to the values
    if (Math.abs(leftx)<=tolerance){
      leftx=0;
    }
    if (Math.abs(lefty)<=tolerance){
      lefty=0;
    }
    if (Math.abs(rightx)<=tolerance){
      rightx=0;
    }
    if (Math.abs(righty)<=tolerance){
      righty=0;
    }
    console.log(leftx+" "+lefty+" "+rightx+" "+righty)
    x += leftx; //the left joystick right and left; ranges from -1 to 1
    y += lefty;//the left joystick up and down; ranges from -1 to 1
    scrollx += rightx; //the right joystick right and left; ranges from -1 to 1
    scrolly += righty;//the right joystick up and down; ranges from -1 to 1

    //===============Button Handlers=================
    //When the user presses the "A" button
    if(gp.buttons[0].pressed==true){
      pressedButton[0]=true;
      mouse.className = "mouse-highlighted";
    }
    else{
      mouse.className = "mouse-regular";
    }
    //Only opens the links when the user actually releases the button, rather than clicks it
    if (pressedButton[0] && gp.buttons[0].pressed==false){
      document.elementFromPoint(parseInt(pointer.style.left), parseInt(pointer.style.top)).click();
      document.elementFromPoint(parseInt(pointer.style.left), parseInt(pointer.style.top)).focus();
      pressedButton[0]=false;
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
	  // window.scrollTo(scrollx*scrollSensitivity, scrolly*scrollSensitivity);
    var start = rAF(gameLoop); //requests a browser animation and calls upon the gameLoop function again recursively
  }
}
