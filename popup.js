window.addEventListener("gamepadconnected", function() { //connected
	document.getElementById("status").textContent = "Gamepad is currently connected!\nUse buttons and analog sticks to control the browser.";
});

window.addEventListener("gamepaddisconnected", function() { //disconnected
	document.getElementById("status").textContent = "Gamepad has been disconnected,\nplug back in and open a new tab to start again.";
});