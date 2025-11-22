const BASE_URL = "https://clockman-api.onrender.com";

let logout = document.getElementById("logout");

logout.onclick = function () {
   console.log("logout button clicked.");
   chrome.storage.local.get("token", function (result) {
      console.log("result logout before token: ", result);

      fetch(`${BASE_URL}/userauth/logout`, {
         method: "GET",
         headers: { "x-auth-token": result.token }
      })
         .then((response) => {
            if (response.ok) {
               return response.text();
            } else {
               throw new Error("Logout failed");
            }
         })
         .then((data) => {
            console.log(data);
            chrome.storage.local.set({ logged_in: false, token: "" });
            chrome.action.setPopup({ popup: "popup.html" });
            window.location.href = "popup.html";
         })
         .catch((error) => {
            console.error("Error during logout:", error);
         });
   });
};
