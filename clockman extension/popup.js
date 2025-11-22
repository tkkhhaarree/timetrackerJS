const BASE_URL = "https://clockman-api.onrender.com";

let submit = document.getElementById("submit");

submit.onclick = function () {
   var email = document.getElementById("email").value;
   var password = document.getElementById("password").value;
   console.log("login button clicked.");

   fetch(`${BASE_URL}/userauth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
   })
      .then((response) => {
         if (response.ok) {
            return response.json();
         } else if (response.status === 400) {
            document.getElementById("loginfail").innerHTML = "Invalid login ID / Password";
            throw new Error("Invalid login");
         } else {
            document.getElementById("loginfail").innerHTML = "Server Error.";
            document.getElementById("signup_msg").innerHTML = "";
            throw new Error("Server error");
         }
      })
      .then((data) => {
         const auth_token = data["token"];
         chrome.storage.local.set({ token: auth_token, logged_in: true });
         console.log("auth from popup after login: ", auth_token);
         chrome.action.setPopup({ popup: "logged_in.html" });
         window.location.href = "logged_in.html";
      })
      .catch((error) => {
         console.error("Error during login:", error);
      });
};
