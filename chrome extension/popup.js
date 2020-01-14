let submit = document.getElementById("submit");

submit.onclick = function() {
   var email = document.getElementById("email").value;
   var password = document.getElementById("password").value;

   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         auth_token = JSON.parse(this.responseText)["token"];
         chrome.storage.local.set({ token: auth_token });
         console.log("auth from popup after login: ", auth_token);
         document.body.innerHTML = "You are logged in!";
      } else if (this.status == 400) {
         document.getElementById("loginfail").innerHTML =
            "Invalid login ID / Password";
      } else {
         document.getElementById("loginfail").innerHTML = "Server Error.";
      }
   };
   xhttp.open("POST", "http://127.0.0.1:5000/userauth/login", true);
   xhttp.setRequestHeader("Content-Type", "application/json");
   xhttp.send(JSON.stringify({ email: email, password: password }));
};
