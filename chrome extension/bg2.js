var username = "";
var password = "";
chrome.storage.onChanged.addListener(function(changes, namespace) {
   var flag = 0;
   for (var key in changes) {
      var storageChange = changes[key];
      if (key == "email") {
         username = storageChange.newValue;
         flag++;
      }
      if (key == "password") {
         password = storageChange.newValue;
         flag++;
      }
   }
});
