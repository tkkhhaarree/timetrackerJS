try {
  var d = new Date();
  var username = "abcd@gmail.com";
  var password = "123456";

  var session = "";
  var init_url = "";
  var auth_token = "";

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      auth_token = JSON.parse(this.responseText)["token"];
      console.log("auth from background after login: ", auth_token);

      chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(
        tabs
      ) {
        init_url = tabs[0].url;
        console.log("init url: " + init_url);

        var xh2 = new XMLHttpRequest();
        xh2.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            session = JSON.parse(this.responseText)["session"];
            console.log("session check: " + session);
          }
        };
        xh2.open("POST", "http://127.0.0.1:5000/usersession/get_session", true);
        xh2.setRequestHeader("Content-Type", "application/json");
        xh2.setRequestHeader("x-auth-token", auth_token);
        xh2.send(JSON.stringify({ init_url: init_url }));
      });
    }
  };
  xhttp.open("POST", "http://127.0.0.1:5000/userauth/login", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify({ email: username, password: password }));

  chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
      y = tab.url;
      console.log("hello: " + y);
      if (auth_token != "") {
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
      console.log("hello2: " + change.url);
      if (auth_token != "") {
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
    console.log("hello3: " + tabToUrl[tabId]);
    if (auth_token != "") {
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
} catch (error) {
  console.log("error: ", error);
}
