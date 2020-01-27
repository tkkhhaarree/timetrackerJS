let logout = document.getElementById("logout");

logout.onclick = function() {
   chrome.storage.local.set({ logged_in: false, token: "" });
   chrome.storage.local.set({ token: "" });
   chrome.browserAction.setPopup({ popup: "popup.html" });
   window.location.href = "popup.html";
};
