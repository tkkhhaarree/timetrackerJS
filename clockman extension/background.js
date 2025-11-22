const BASE_URL = "https://clockman-api.onrender.com";

let session = "";
let auth_token = "";
let flag = 0;
let tabToUrl = {};

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  flag = 0;
  for (let key in changes) {
    if (key === "token") {
      auth_token = changes[key].newValue;
      flag = auth_token ? 1 : 0;
    }
  }

  if (auth_token && flag === 1) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const init_url = tabs[0]?.url || "";
      console.log("init url: " + init_url);

      fetch(`${BASE_URL}/usersession/get_session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": auth_token,
        },
        body: JSON.stringify({
          init_url: init_url,
          timezone_offset: new Date().getTimezoneOffset(),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          session = data.session;
          console.log("session check: " + session);
        })
        .catch((error) => console.error("Error fetching session:", error));
    });
  }
});

// Handle tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    const url = tab.url;
    if (auth_token && flag === 1) {
      sendUrlToBackend(url);
    }
  });
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url && auth_token && flag === 1) {
    sendUrlToBackend(changeInfo.url);
  }
  if (auth_token) {
    tabToUrl[tabId] = tab.url;
  }
});

// Handle tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  if (auth_token && flag === 1) {
    const url = tabToUrl[tabId];
    fetch(`${BASE_URL}/urltrack/quit_url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": auth_token,
      },
      body: JSON.stringify({ url: url }),
    })
      .then((response) => response.text())
      .then((data) => console.log("Removed URL:", data))
      .catch((error) => console.error("Error removing URL:", error));

    delete tabToUrl[tabId];
  }
});

// Helper function to send URL to backend
function sendUrlToBackend(url) {
  const today = new Date();
  const date = `${today.getHours()}-${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  if (session !== date) {
    fetch(`${BASE_URL}/usersession/get_session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": auth_token,
      },
      body: JSON.stringify({
        init_url: url,
        timezone_offset: today.getTimezoneOffset(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        session = data.session;
        sendUrl(url);
      })
      .catch((error) => console.error("Error fetching session:", error));
  } else {
    sendUrl(url);
  }
}

function sendUrl(url) {
  fetch(`${BASE_URL}/urltrack/send_url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": auth_token,
    },
    body: JSON.stringify({ url: url, session: session }),
  })
    .then((response) => response.text())
    .then((data) => console.log("Sent URL:", data))
    .catch((error) => console.error("Error sending URL:", error));
}
