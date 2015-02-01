var mouse = document.createElement('div'); // mouse creation on connect

mouse.innerHTML="+";
mouse.id = "mouse";
mouse.className = "mouse-regular";
mouse.onload = function() {
  this.parentNode.removeChild(this);
};

(document.body||document.documentElement).appendChild(mouse);
console.log("Mouse created");

var controls = document.createElement('script');
controls.src = chrome.extension.getURL('controls.js');
controls.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(controls);
