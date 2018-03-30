chrome.browserAction.onClicked.addListener(function(tab) {
   chrome.tabs.executeScript(null, {file: "getPagesSource.js"});
   chrome.browserAction.setPopup({popup : "popup.html"}); 
   alert("hello");
});