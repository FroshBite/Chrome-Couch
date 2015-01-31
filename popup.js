// wait for controls.js to sendMessage about gamepad connectedness

chrome.runtime.onMessage.addListener(
	
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    // connected state
    if (request.gamepad == "connected"){
      document.getElementById("status").textContent = "Gamepad is currently connected!\nUse buttons and analog sticks to control the browser.";
      sendResponse({affirm: "message received"});
    }

    // disconnected state
    if (request.gamepad == "disconnected"){
      document.getElementById("status").textContent = "Gamepad has been disconnected,\nplug back in and open a new tab to start again.";
      sendResponse({affirm: "message received"});
    }

  });