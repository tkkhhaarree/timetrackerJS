let submit = document.getElementById("submit");

submit.onclick = function () {
   var email = document.getElementById("email").value;
   var password = document.getElementById("password").value;
   console.log("login button clicked.");

   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
         auth_token = JSON.parse(this.responseText)["token"];
         chrome.storage.local.set({ token: auth_token, logged_in: true });
         console.log("auth from popup after login: ", auth_token);
         //document.body.innerHTML = "You are logged in!";

         chrome.browserAction.setPopup({ popup: "logged_in.html" });
         window.location.href = "logged_in.html";
      } else if (this.status == 400) {
         document.getElementById("loginfail").innerHTML =
            "Invalid login ID / Password";
      } else {
         console.log(
            "ready state, status: %d %d",
            this.readyState,
            this.status
         );
         document.getElementById("loginfail").innerHTML = "Server Error.";
         document.getElementById("signup_msg").innerHTML = "";
      }
   };
   xhttp.open("POST", "https://clockman.herokuapp.com/userauth/login", true);
   xhttp.setRequestHeader("Content-Type", "application/json");
   xhttp.send(JSON.stringify({ email: email, password: password }));
};
