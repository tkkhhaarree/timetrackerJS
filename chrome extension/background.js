var d = new Date();
var session = "";
var init_url = "";
var auth_token = "";
var flag = 0;
chrome.storage.onChanged.addListener(function(changes, namespace) {
   flag = 0;
   for (var key in changes) {
      var storageChange = changes[key];
      if (key == "token") {
         auth_token = storageChange.newValue;
         flag = 1;
      }
   }
   console.log("flag after storage change invoke: ", flag);

   chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
      init_url = tabs[0].url;
      console.log("init url: " + init_url);

      if (auth_token != "" && flag == 1) {
         var xh2 = new XMLHttpRequest();
         xh2.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
               console.log(this.responseText);
               session = JSON.parse(this.responseText)["session"];
               console.log("session check: " + session);
            }
         };
         xh2.open(
            "POST",
            "http://127.0.0.1:5000/usersession/get_session",
            true
         );
         xh2.setRequestHeader("Content-Type", "application/json");
         xh2.setRequestHeader("x-auth-token", auth_token);
         xh2.send(JSON.stringify({ init_url: init_url }));
      }
   });
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
   chrome.tabs.get(activeInfo.tabId, function(tab) {
      y = tab.url;
      console.log("selected url: " + y);
      if (auth_token != "" && flag == 1) {
         var xhttp = new XMLHttpRequest();
         xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
               console.log(this.responseText);
            }
         };
         xhttp.open("POST", "http://127.0.0.1:5000/urltrack/send_url");
         xhttp.setRequestHeader("Content-Type", "application/json");
         xhttp.setRequestHeader("x-auth-token", auth_token);
         xhttp.send(JSON.stringify({ url: y, session: session }));
      }
   });
});

chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
   if (tab.active && change.url) {
      console.log("updated url: " + change.url);
      if (auth_token != "" && flag == 1) {
         var xhttp = new XMLHttpRequest();
         xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
               console.log(this.responseText);
            }
         };
         xhttp.open("POST", "http://127.0.0.1:5000/urltrack/send_url");
         xhttp.setRequestHeader("Content-Type", "application/json");
         xhttp.setRequestHeader("x-auth-token", auth_token);
         xhttp.send(JSON.stringify({ url: change.url, session: session }));
      }
   }
});

var tabToUrl = {};
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   // Note: this event is fired twice:
   // Once with `changeInfo.status` = "loading" and another time with "complete"
   if (auth_token != "") {
      tabToUrl[tabId] = tab.url;
   }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
   console.log("removed url: " + tabToUrl[tabId]);
   if (auth_token != "" && flag == 1) {
      var xhttp2 = new XMLHttpRequest();
      xhttp2.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
         }
      };
      xhttp2.open("POST", "http://127.0.0.1:5000/urltrack/quit_url");
      xhttp2.setRequestHeader("Content-Type", "application/json");
      xhttp2.setRequestHeader("x-auth-token", auth_token);
      xhttp2.send(JSON.stringify({ url: tabToUrl[tabId] }));

      // Remove information for non-existent tab
      delete tabToUrl[tabId];
   }
});
