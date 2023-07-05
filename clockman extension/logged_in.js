let logout = document.getElementById("logout");

logout.onclick = function () {
   console.log("logout button clicked.");
   chrome.storage.local.get("token", function (result) {
      console.log("result logout before token: ", result);
      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
         if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            chrome.storage.local.set({ logged_in: false, token: "" });
            chrome.storage.local.set({ token: "" });
            chrome.browserAction.setPopup({ popup: "popup.html" });
            window.location.href = "popup.html";
         }
      };
      xhttp.open("GET", "https://localhost:5000/userauth/logout", true);
      xhttp.setRequestHeader("x-auth-token", result.token);
      xhttp.send();
   });
};
