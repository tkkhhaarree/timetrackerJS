var session = "";
var init_url = "";
var auth_token = "";
var flag = 0;
chrome.storage.onChanged.addListener(function (changes, namespace) {
   flag = 0;
   for (var key in changes) {
      var storageChange = changes[key];
      if (key == "token") {
         auth_token = storageChange.newValue;
         if (auth_token != "") {
            flag = 1;
         } else {
            flag = 0;
         }
      }
   }
   console.log("flag after storage change invoke: ", flag);

   chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (
      tabs
   ) {
      if (auth_token != "" && flag == 1) {
         init_url = tabs[0].url;
         console.log("init url: " + init_url);
         var xh2 = new XMLHttpRequest();
         xh2.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
               console.log(this.responseText);
               session = JSON.parse(this.responseText)["session"];
               console.log("session check: " + session);
            }
         };
         xh2.open(
            "POST",
            "https://clockman.herokuapp.com/usersession/get_session",
            true
         );
         xh2.setRequestHeader("Content-Type", "application/json");
         xh2.setRequestHeader("x-auth-token", auth_token);
         xh2.send(
            JSON.stringify({
               init_url: init_url,
               timezone_offset: new Date().getTimezoneOffset(),
            })
         );
      }
   });
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
   chrome.tabs.get(activeInfo.tabId, function (tab) {
      var y = tab.url;
      console.log("flag is: ", +flag + " and token is: " + auth_token);
      if (auth_token != "" && flag == 1) {
         var today = new Date();
         var month = parseInt(today.getMonth()) + 1;
         var date =
            today.getHours() +
            "-" +
            today.getDate() +
            "/" +
            month +
            "/" +
            today.getFullYear();
         if (session != date) {
            var xh2 = new XMLHttpRequest();
            xh2.onreadystatechange = function () {
               if (this.readyState == 4 && this.status == 200) {
                  console.log(this.responseText);
                  session = JSON.parse(this.responseText)["session"];

                  var xhttp = new XMLHttpRequest();
                  xhttp.onreadystatechange = function () {
                     if (this.readyState == 4 && this.status == 200) {
                        console.log(this.responseText);
                     }
                  };
                  xhttp.open("POST", "https://clockman.herokuapp.com/urltrack/send_url");
                  xhttp.setRequestHeader("Content-Type", "application/json");
                  xhttp.setRequestHeader("x-auth-token", auth_token);
                  xhttp.send(JSON.stringify({ url: y, session: session }));
                  console.log("selected url: " + y);
               }
            };
            xh2.open(
               "POST",
               "https://clockman.herokuapp.com/usersession/get_session",
               true
            );
            xh2.setRequestHeader("Content-Type", "application/json");
            xh2.setRequestHeader("x-auth-token", auth_token);
            xh2.send(
               JSON.stringify({
                  init_url: y,
                  timezone_offset: today.getTimezoneOffset(),
               })
            );
         } else {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
               if (this.readyState == 4 && this.status == 200) {
                  console.log(this.responseText);
               }
            };
            xhttp.open("POST", "https://clockman.herokuapp.com/urltrack/send_url");
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.setRequestHeader("x-auth-token", auth_token);
            xhttp.send(JSON.stringify({ url: y, session: session }));
            console.log("selected url: " + y);
         }
      }
   });
});

chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
   if (tab.active && change.url) {
      console.log("flag is: ", +flag + " and token is: " + auth_token);
      if (auth_token != "" && flag == 1) {
         var today = new Date();
         var month = parseInt(today.getMonth()) + 1;
         var date =
            today.getHours() +
            "-" +
            today.getDate() +
            "/" +
            month +
            "/" +
            today.getFullYear();
         if (session != date) {
            var xh2 = new XMLHttpRequest();
            xh2.onreadystatechange = function () {
               if (this.readyState == 4 && this.status == 200) {
                  session = JSON.parse(this.responseText)["session"];
                  var xhttp = new XMLHttpRequest();
                  xhttp.onreadystatechange = function () {
                     if (this.readyState == 4 && this.status == 200) {
                        console.log(this.responseText);
                     }
                  };
                  xhttp.open("POST", "https://clockman.herokuapp.com/urltrack/send_url");
                  xhttp.setRequestHeader("Content-Type", "application/json");
                  xhttp.setRequestHeader("x-auth-token", auth_token);
                  xhttp.send(
                     JSON.stringify({ url: change.url, session: session })
                  );
                  console.log("updated url: " + change.url);
               }
            };
            xh2.open(
               "POST",
               "https://clockman.herokuapp.com/usersession/get_session",
               true
            );
            xh2.setRequestHeader("Content-Type", "application/json");
            xh2.setRequestHeader("x-auth-token", auth_token);
            xh2.send(
               JSON.stringify({
                  init_url: change.url,
                  timezone_offset: today.getTimezoneOffset(),
               })
            );
         } else {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
               if (this.readyState == 4 && this.status == 200) {
                  console.log(this.responseText);
               }
            };
            xhttp.open("POST", "https://clockman.herokuapp.com/urltrack/send_url");
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.setRequestHeader("x-auth-token", auth_token);
            xhttp.send(JSON.stringify({ url: change.url, session: session }));
            console.log("updated url: " + change.url);
         }
      }
   }
});

var tabToUrl = {};
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
   // Note: this event is fired twice:
   // Once with `changeInfo.status` = "loading" and another time with "complete"
   if (auth_token != "") {
      tabToUrl[tabId] = tab.url;
   }
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
   if (auth_token != "" && flag == 1) {
      var xhttp2 = new XMLHttpRequest();
      xhttp2.onreadystatechange = function () {
         if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
         }
      };
      xhttp2.open("POST", "https://clockman.herokuapp.com/urltrack/quit_url");
      xhttp2.setRequestHeader("Content-Type", "application/json");
      xhttp2.setRequestHeader("x-auth-token", auth_token);
      xhttp2.send(JSON.stringify({ url: tabToUrl[tabId] }));

      // Remove information for non-existent tab
      delete tabToUrl[tabId];
      console.log("removed url: " + tabToUrl[tabId]);
   }
});
