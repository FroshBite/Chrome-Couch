var cursorSensitivity=14;
var scrollSensitivity=14;

var pointer = document.getElementById("mouse");
var start;

var keyboardOn=false;

//used for the cursor positions
var x =window.innerWidth/cursorSensitivity/2;
var y = window.innerHeight/cursorSensitivity/2;

// console.log("Window Inner Width: "+window.innerWidth);

//used for scrolling
var scrollx=0;
var scrolly=0;

//If the controller is currently connected
var connected=false;

//Stores the gamepad object
var gp;

//Used for mapping buttons and keeping track of what it pressed.
var pressedButton=new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
var pressedAxis=new Array(0,0,0,0); //For keeping track of what analog sticks are currently being pressed

//To do with requesting animations with the web browser
var rAF = window.mozRequestAnimationFrame || window.requestAnimationFrame;

var rAFStop = window.mozCancelRequestAnimationFrame || window.cancelRequestAnimationFrame;

//On page load, will check for an existing connection to a gamepad.
window.addEventListener("load", function(){
  if(navigator.getGamepads()[0]) {
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
  console.log("Gamepad Disconnected");
  pointer.style.display="none"; //hides the cursor from the user
  rAFStop(start); //stops the browser from refreshing the animation
});

function gameLoop() {

  var tolerance=0.05; //so that the cursor doesnt move around when left idle

  if(connected) {
    //Storing the first gamepad that is connected
    var gp = navigator.getGamepads()[0];

    var leftx=0.0, lefty=0.0, rightx=0.0, righty=0.0; //Left analog stick for cursor movement, right analog stick for scrolling

    leftx=gp.axes[0]; //The amount to move cursor in the x direction
    lefty=gp.axes[1]; //The amount to move cursor in the y direction
    rightx=gp.axes[2]; //The amount to scroll scrolling in the x direction
    righty=gp.axes[3]; //The amount to scroll scrolling in the y direction

    //Applies tolerancing to the values to keep them from activating when no user is not inputting anything
    if (Math.abs(leftx)<=tolerance){
      leftx=0;
    }
    if (Math.abs(lefty)<=tolerance){
      lefty=0;
    }
    if (Math.abs(rightx)<=tolerance){
      rightx=0;
      pressedAxis[2]=false; //A valid scroll in the x direction has not been detected
    }
    else{
      pressedAxis[2]=true;//A valid scroll in the x direction has been detected
    }
    if (Math.abs(righty)<=tolerance){
      righty=0;
      pressedAxis[3]=false;//A valid scroll in the y direction has not been detected
    }
    else{
      pressedAxis[3]=true;//A valid scroll in the y direction has  been detected
    }

    x += leftx; //the left joystick right and left; ranges from -1 to 1
    y += lefty;//the left joystick up and down; ranges from -1 to 1
    scrollx += rightx; //the right joystick right and left; ranges from -1 to 1
    scrolly += righty;//the right joystick up and down; ranges from -1 to 1

    //===============Button Handlers=================
    //When the user presses the "A" button
    if(gp.buttons[0].pressed==true){
      pressedButton[0]=true;
      mouse.className="mouse-highlighted";
    }
    else{
      mouse.className="mouse-regular";
    }
    //Only opens the links when the user actually releases the button, rather than clicks it
    if (pressedButton[0] && gp.buttons[0].pressed==false){
      var closestElement=document.elementFromPoint(parseInt(pointer.style.left), parseInt(pointer.style.top));
      if (closestElement){ //Makes sure that the selected/found element is valid/not null
        closestElement.click(); //for clicking on links
        closestElement.focus();//for selecting text-boxes
      }
      pressedButton[0]=false;
    }

  	//Opens new tab
  	if(gp.buttons[5].pressed==true){
  		window.postMessage({command: "opentab"}, '*');
  	}
  	//Switches to right tab
  	if(gp.buttons[7].pressed==true){
  		window.postMessage({command: "switchr"}, '*');
  	}

    // X to reload/refresh page
    if(gp.buttons[2].pressed == true){
      pressedButton[2]=true;
    }
    if (pressedButton[2] && gp.buttons[2].pressed == false){
      window.history.go(0);
      pressedButton[2]=false;
    }

    // Back button to go back
    if(gp.buttons[8].pressed == true){
      pressedButton[8]=true;
    }
    if (pressedButton[8] && gp.buttons[8].pressed == false){
      window.history.back();
      pressedButton[8]=false;
    }

    // Start button to go forward
    if(gp.buttons[9].pressed == true){ // for some reason, forward goes straight to the most forward page, but back functions properly
      pressedButton[9] = true;
    }
    if (pressedButton[9] && gp.buttons[9].pressed == false){
      window.history.forward();
      pressedButton[9]=false;
    }

    // The Y button that pops up the key board
    if(gp.buttons[3].pressed == true){ // for some reason, forward goes straight to the most forward page, but back functions properly
      pressedButton[3] = true;
    }
    if (pressedButton[3] && gp.buttons[3].pressed == false){

      if(keyboardOn){
        document.getElementById("chrome-coach-textbox").blur();
        keyboardOn=false;
      }
      else{
        document.getElementById("chrome-coach-textbox").focus();
        keyboardOn=true;
      }
      pressedButton[3]=false;
    }

    //For the left analog stick button that resets the position of the cursor
    if(gp.buttons[10].pressed == true){ // for some reason, forward goes straight to the most forward page, but back functions properly
      pressedButton[10] = true;
    }
    if (pressedButton[10] && gp.buttons[10].pressed == false){
      x =window.innerWidth/cursorSensitivity/2;
      y = window.innerHeight/cursorSensitivity/2;
      pressedButton[10]=false;
    }

    //Moves the actual position of the cursor based on the new values of x and y
    pointer.style.left = x*cursorSensitivity + "px";
    pointer.style.top =y*cursorSensitivity + "px";

    //Keeps the user from scrolling over the veiwable window
	  if(scrollx<0)
      scrollx=0;
    if(scrolly<0)
      scrolly=0;
    if(scrollx>document.body.clientWidth/scrollSensitivity)
      scrollx=document.body.clientWidth/scrollSensitivity;
    //The 50px is there because document.body.clientHeight is off by about 50px. This value may need to change depending on the scrollSensitivity.
    if(scrolly>document.body.clientHeight/scrollSensitivity-50)
      scrolly=document.body.clientHeight/scrollSensitivity-50;

    //Only scrolls if a valid scroll input for the right analog stick has been detected. This allows you to scroll with the mouse as well
    if(pressedAxis[2]||pressedAxis[3]){
	     window.scrollTo(scrollx*scrollSensitivity, scrolly*scrollSensitivity);
    }

    var start = rAF(gameLoop); //requests a browser animation and calls upon the gameLoop function again recursively
  }
}
