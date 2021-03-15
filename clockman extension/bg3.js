var current_active_ts = 0;
var viewtime = {};
var prev_url = "";

var session = "";
var init_url = "";
var auth_token = "";
var flag = 0;





setInterval(function () {
   function doSomethingWithMinimizedWindows(windows) {
      for (var i = 0; i < windows.length; i++) {
          // do something with windows[i]
          // for example:
          console.log('Window #'+windows[i].id+' is minimized!');
      }
  }
  
  chrome.windows.getAll(function(windows) {
      var minimized = [];
  
      for (var i = 0; i < windows.length; i++) {
          if (windows[i].state === "minimized") {
              minimized.push(windows[i]);
          }
      }
  
      doSomethingWithMinimizedWindows(minimized);
  });
}, 3000);




//----------------------------------------------------------------------

// setInterval(function () {

//    var new_ts = Math.floor(Date.now() / 1000);
//    viewtime[prev_url] = viewtime[prev_url] + (new_ts - current_active_ts);
//    current_active_ts = new_ts;
//    delete viewtime[""];
//    console.log("viewtime: ", viewtime);
   
//    if (auth_token != "" && flag == 1) {
//       var today = new Date();
//       var month = parseInt(today.getMonth()) + 1;
//       var date =
//          today.getHours() +
//          "-" +
//          today.getDate() +
//          "/" +
//          month +
//          "/" +
//          today.getFullYear();
//       if (session != date) {
//          var xh2 = new XMLHttpRequest();
//          xh2.onreadystatechange = function () {
//             if (this.readyState == 4 && this.status == 200) {
//                //console.log(this.responseText);
//                session = JSON.parse(this.responseText)["session"];

//                var xhttp = new XMLHttpRequest();
//                xhttp.onreadystatechange = function () {
//                   if (this.readyState == 4 && this.status == 200) {
//                      console.log(this.responseText);
//                      var i;
//                      for(i in viewtime){
//                         viewtime[i] = 0;
//                      }
//                   }
//                };
//                xhttp.open("POST", "https://cryptic-stream-13108.herokuapp.com/urltrack/send_url_2");
//                xhttp.setRequestHeader("Content-Type", "application/json");
//                xhttp.setRequestHeader("x-auth-token", auth_token);
//                xhttp.send(JSON.stringify({ viewtime: viewtime, session: session }));
//                console.log("selected url: " + prev_url);
               
//             }
//          };
//          xh2.open(
//             "POST",
//             "https://cryptic-stream-13108.herokuapp.com/usersession/get_session",
//             true
//          );
//          xh2.setRequestHeader("Content-Type", "application/json");
//          xh2.setRequestHeader("x-auth-token", auth_token);
//          xh2.send(
//             JSON.stringify({
//                init_url: prev_url,
//                timezone_offset: today.getTimezoneOffset(),
//             })
//          );
//       } else {
//          var xhttp = new XMLHttpRequest();
//          xhttp.onreadystatechange = function () {
//             if (this.readyState == 4 && this.status == 200) {
//                //console.log(this.responseText);
//                var i;
//                for(i in viewtime){
//                   viewtime[i] = 0;
//                }
//             }
//          };
//          xhttp.open("POST", "https://cryptic-stream-13108.herokuapp.com/urltrack/send_url_2");
//          xhttp.setRequestHeader("Content-Type", "application/json");
//          xhttp.setRequestHeader("x-auth-token", auth_token);
//          xhttp.send(JSON.stringify({ viewtime: viewtime, session: session }));
//          console.log("selected url: " + prev_url);
         
//       }



//    }
// }, 10000);




