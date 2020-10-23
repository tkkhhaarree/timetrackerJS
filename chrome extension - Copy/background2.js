setInterval(function () {
   console.log("hello");
}, 5000);

chrome.tabs.onActivated.addListener(function (activeInfo) {
   chrome.tabs.get(activeInfo.tabId, function (tab) {
      var y = tab.url;
      console.log(y);
   });
});
