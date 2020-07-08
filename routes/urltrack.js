const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const CurrentUrl = require("../models/CurrentUrl");
const Webstats = require("../models/Webstats");
const Appstats = require("../models/Appstats");
const UrlType = require("../models/UrlType");
const UrlVotes = require("../models/UrlVotes");
const Session = require("../models/Session");
const config = require("config");

function url_strip(url) {
   if (url.includes("http://") || url.includes("https://")) {
      url = url.replace("https://", "").replace("http://", "").replace('"', "");
   }
   if (url.includes("/")) {
      url = url.split("/", 1)[0];
   }
   return url;
}

//-------------------------
router.post(
   "/send_url",
   [
      check("url", "URL is required!").not().isEmpty(),
      check("session", "Session cannot be empty!").not().isEmpty(),
   ],
   auth,
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const { url, session } = req.body;
      const parent_url = url_strip(url);
      console.log("parent url: ", parent_url);
      const id = req.user.id;

      url_timestamp = {};
      url_viewtime = {};

      try {
         let c_u = await CurrentUrl.findOne({
            user: id,
            session: session,
         });
         var current_url = c_u.url;
         console.log("current url: ", current_url);

         let ws = await Webstats.find({ user: id, session: session });
         //console.log("old webstats:", ws);

         for (i = 0; i < ws.length; i++) {
            url_timestamp[ws[i].url] = ws[i].ts[ws[i].ts.length - 1];
            url_viewtime[ws[i].url] = ws[i].viewtime;
         }

         if (!Object.keys(url_timestamp).includes(parent_url)) {
            url_viewtime[parent_url] = 0;
            let u_v = await new Webstats({
               user: id,
               session: session,
               url: parent_url,
               viewtime: 0,
            });
            await u_v.save();
         }

         let s = await Session.findOne({ user: id });
         var timezone_offset = s.timezone_offset;

         if (current_url != "chrome://newtab/") {
            var today = new Date();
            today.setMinutes(
               today.getMinutes() -
                  timezone_offset +
                  new Date().getTimezoneOffset()
            );

            var time_spent =
               Math.floor(today.getTime() / 1000) - url_timestamp[current_url];
            console.log("time spent: ", time_spent);
            url_viewtime[current_url] = url_viewtime[current_url] + time_spent;
            ws = await Webstats.findOne({
               user: id,
               url: current_url,
               session: session,
            });
            ws.viewtime = url_viewtime[current_url];
            await ws.save();
         }

         var today = new Date();
         today.setMinutes(
            today.getMinutes() -
               timezone_offset +
               new Date().getTimezoneOffset()
         );

         var x = Math.floor(today.getTime() / 1000);
         url_timestamp[parent_url] = x;
         ws = await Webstats.findOne({
            user: id,
            url: parent_url,
            session: session,
         });
         ws.ts.push(url_timestamp[parent_url]);
         await ws.save();

         c_u = await CurrentUrl.findOne({
            user: id,
            session: session,
         });
         c_u.url = parent_url;
         await c_u.save();

         console.log("url viewtime: ", url_viewtime);
         //console.log("url timestamp: ", url_timestamp);

         res.json({ message: "url added" });
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server error.");
      }
   }
);

//-------------------
router.post(
   "/quit_url",
   [check("url", "URL is required!").not().isEmpty()],
   auth,
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      try {
         const { url } = req.body;
         console.log("URL has been closed: ", url);
         res.json({ message: "URL has been quit." });
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server error.");
      }
   }
);

//----------------
router.post(
   "/quit_chrome",
   [check("session", "session is required!").not().isEmpty()],
   auth,
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      try {
         const { session } = req.body;
         const id = req.user.id;

         var url_timestamp = {};
         var url_viewtime = {};
         let c_u = await CurrentUrl.findOne({
            user: id,
            session: session,
         });
         if (c_u != null) {
            if (c_u.logged_in == true) {
               var current_url = c_u.url;
               //console.log("current url: ", current_url);

               let ws = await Webstats.find({ user: id, session: session });

               //console.log("old webstats:", ws);

               for (i = 0; i < ws.length; i++) {
                  url_timestamp[ws[i].url] = ws[i].ts[ws[i].ts.length - 1];
                  url_viewtime[ws[i].url] = ws[i].viewtime;
               }

               let s = await Session.findOne({ user: id });
               var timezone_offset = s.timezone_offset;
               if (current_url != "chrome:") {
                  var today = new Date();
                  today.setMinutes(today.getMinutes() - timezone_offset - 330);

                  var now = Math.floor(today.getTime() / 1000);
                  var t = now - url_timestamp[current_url];
                  url_timestamp[current_url] = now;
                  url_viewtime[current_url] = url_viewtime[current_url] + t;

                  let ws = await Webstats.findOne({
                     user: id,
                     url: current_url,
                     session: session,
                  });
                  ws.ts.push(url_timestamp[current_url]);
                  ws.viewtime = url_viewtime[current_url];
                  console.log(
                     "viewtime of " +
                        current_url +
                        " after quit chrome: " +
                        ws.viewtime
                  );
                  console.log(
                     "timestamp of " +
                        current_url +
                        " after quit chrome: " +
                        url_timestamp[current_url]
                  );
                  await ws.save();
                  res.json({ message: "Chrome quit invoked successfully." });
               } else {
                  res.json({ message: "chrome not open currently." });
               }
            } else {
               res.json({ message: "currently extension logged out." });
            }
         } else {
            res.json({ message: "currently extension logged out." });
         }
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server error200.");
      }
   }
);

//---------------
router.post(
   "/restore_chrome",
   [check("session", "session is required!").not().isEmpty()],
   auth,
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      try {
         const { session } = req.body;
         const id = req.user.id;
         var url_timestamp = {};

         let c_u = await CurrentUrl.findOne({
            user: id,
            session: session,
         });
         if (c_u != null) {
            if (c_u.logged_in == true) {
               var current_url = c_u.url;

               let ws = await Webstats.find({ user: id, session: session });
               for (i = 0; i < ws.length; i++) {
                  url_timestamp[ws[i].url] = ws[i].ts[ws[i].ts.length - 1];
               }

               let s = await Session.findOne({ user: id });
               var timezone_offset = s.timezone_offset;

               if (current_url != "chrome:") {
                  var today = new Date();
                  today.setMinutes(today.getMinutes() - timezone_offset - 330);

                  var now = Math.floor(today.getTime() / 1000);
                  url_timestamp[current_url] = now;
                  let ws = await Webstats.findOne({
                     user: id,
                     url: current_url,
                     session: session,
                  });
                  ws.ts.push(url_timestamp[current_url]);
                  await ws.save();
                  console.log(
                     "timestamp of " +
                        current_url +
                        " after restore chrome: " +
                        url_timestamp[current_url]
                  );

                  res.json({ message: "chrome restore invoked successfully." });
               }
            } else {
               res.json({ message: "currently extension logged out." });
            }
         } else {
            res.json({ message: "currently extension logged out." });
         }
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server error249.");
      }
   }
);

//------------------
router.post(
   "/save_app",
   [
      check("session", "session is required!").not().isEmpty(),
      check("apptime", "App time is required!").not().isEmpty(),
   ],
   auth,
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const { session, apptime } = req.body;
      const id = req.user.id;

      //console.log(apptime);

      let s = await Session.findOne({ user: id });
      var timezone_offset = s.timezone_offset;
      var today = new Date();
      today.setMinutes(today.getMinutes() - timezone_offset - 330);

      var now = Math.floor(today.getTime() / 1000);

      for (key in apptime) {
         let ps = await Webstats.findOne({
            user: id,
            session: session,
            url: key,
            datatype: "app",
         });
         if (ps != null) {
            var x = ps.ts;
            x.push(now);
            ps.ts = x;
            ps.viewtime = apptime[key];
            await ps.save();
         } else {
            let as = new Webstats({
               user: id,
               session: session,
               url: key,
               ts: [now],
               viewtime: apptime[key],
               datatype: "app",
            });
            await as.save();
         }
      }

      res.json({ message: "app stats updated successfully." });
   }
);

module.exports = router;
