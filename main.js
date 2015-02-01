var mouse = document.createElement('div'); // mouse creation on connect

mouse.innerHTML="+";
mouse.id = "mouse";
mouse.className = "mouse-regular";
mouse.onload = function() {
  this.parentNode.removeChild(this);
};

(document.body||document.documentElement).appendChild(mouse);

var controls = document.createElement('script');
controls.src = chrome.extension.getURL('controls.js');
controls.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(controls);


window.addEventListener('message', function(event) {
	if(event.data.command=="opentab"){
	chrome.runtime.sendMessage({command: "newtab"}, function(response){
		console.log(response.farewell);
	});
	}else if(event.data.command=="switchr"){
		chrome.runtime.sendMessage({command: "switchr"}, function(response){
		console.log(response.farewell);
	});
	}
});
