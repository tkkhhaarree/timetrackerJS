const express = require("express");
const router = express.Router();
const Webstats = require("../models/Webstats");
const Session = require("../models/Session");
const auth = require("../middleware/auth");

function getNetWebstats(ws) {
   var i = 0;
   var unique_url = {};
   for (i = 0; i < ws.length; i++) {
      if (!(ws[i].url in unique_url)) {
         unique_url[ws[i].url] = {
            viewtime: ws[i].viewtime,
            timestamp: ws[i].ts,
         };
      } else {
         unique_url[ws[i].url].viewtime =
            unique_url[ws[i].url].viewtime + ws[i].viewtime;
         unique_url[ws[i].url].timestamp = unique_url[
            ws[i].url
         ].timestamp.concat(ws[i].ts);
      }
   }

   var net_ws = [];
   for (key in unique_url) {
      var x = {
         url: key,
         viewtime: unique_url[key].viewtime,
         timestamp: unique_url[key].timestamp,
      };
      net_ws.push(x);
   }
   return net_ws;
}

function getPartWebstats(ws, interval) {
   var x;
   var part_ws = {};
   var session_url = {};
   for (var i = 0; i < ws.length; i++) {
      if (interval == "month") {
         x =
            ws[i].session.split("-")[1].split("/")[1] +
            "/" +
            ws[i].session.split("-")[1].split("/")[2];
      } else if (interval == "day") {
         x = ws[i].session.split("-")[1];
      } else if (interval == "year") {
         x = ws[i].session.split("-")[1].split("/")[2];
      }

      if (x in session_url) {
         if (session_url[x].includes(ws[i].url)) {
            var index = session_url[x].indexOf(ws[i].url);
            part_ws[x][index].viewtime =
               part_ws[x][index].viewtime + ws[i].viewtime;
            part_ws[x][index].timestamp = part_ws[x][index].timestamp.concat(
               ws[i].ts
            );
         } else {
            if (part_ws[x] == null) {
               part_ws[x] = [];
            }

            part_ws[x].push({
               url: ws[i].url,
               viewtime: ws[i].viewtime,
               timestamp: ws[i].ts,
            });
            if (session_url[x] == null) {
               session_url[x] = [];
            }
            session_url[x].push(ws[i].url);
         }
      } else {
         if (part_ws[x] == null) {
            part_ws[x] = [];
         }

         part_ws[x].push({
            url: ws[i].url,
            viewtime: ws[i].viewtime,
            timestamp: ws[i].ts,
         });
         if (session_url[x] == null) {
            session_url[x] = [];
         }
         session_url[x].push(ws[i].url);
      }
   }
   return part_ws;
}

router.get("/webstats/all", auth, async (req, res) => {
   try {
      const id = req.user.id;
      let ws = await Webstats.find({ user: id });
      var net_ws = getNetWebstats(ws);
      var part_ws = getPartWebstats(ws, "year");

      res.json({
         webstats: net_ws,
         part_webstats: part_ws,
         message: "All time data.",
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
   }
});

router.get("/webstats/day", auth, async (req, res) => {
   try {
      const id = req.user.id;
      var today = new Date();
      let s = await Session.findOne({ user: id });
      var timezone_offset = s.timezone_offset;
      today.setMinutes(
         today.getMinutes() - timezone_offset + new Date().getTimezoneOffset()
      );
      var month = parseInt(today.getMonth()) + 1;
      var date = today.getDate() + "/" + month + "/" + today.getFullYear();
      let ws = await Webstats.find({
         user: id,
         session: new RegExp(date + "$", "i"),
      });

      var part_ws = {};
      for (var i = 0; i < ws.length; i++) {
         if (part_ws[ws[i].session] == null) {
            part_ws[ws[i].session] = [];
         }
         part_ws[ws[i].session].push({
            url: ws[i].url,
            viewtime: ws[i].viewtime,
            timestamp: ws[i].ts,
         });
      }

      var net_ws = getNetWebstats(ws);
      res.json({
         webstats: net_ws,
         part_webstats: part_ws,
         message:
            "Data from " +
            today.getDate() +
            " " +
            today.toLocaleString("default", { month: "long" }) +
            ", " +
            today.getFullYear(),
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
   }
});

router.get("/webstats/year", auth, async (req, res) => {
   try {
      const id = req.user.id;
      var today = new Date();
      let s = await Session.findOne({ user: id });
      var timezone_offset = s.timezone_offset;
      today.setMinutes(
         today.getMinutes() - timezone_offset + new Date().getTimezoneOffset()
      );
      var date = today.getFullYear();
      let ws = await Webstats.find({
         user: id,
         session: new RegExp(date + "$", "i"),
      });

      var net_ws = getNetWebstats(ws);
      var part_ws = getPartWebstats(ws, "month");

      res.json({
         webstats: net_ws,
         part_webstats: part_ws,
         message: "Data from year " + date,
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
   }
});

router.get("/webstats/month", auth, async (req, res) => {
   try {
      const id = req.user.id;
      var today = new Date();
      let s = await Session.findOne({ user: id });
      var timezone_offset = s.timezone_offset;
      today.setMinutes(
         today.getMinutes() - timezone_offset + new Date().getTimezoneOffset()
      );
      var month = parseInt(today.getMonth()) + 1;
      var date = month + "/" + today.getFullYear();
      let ws = await Webstats.find({
         user: id,
         session: new RegExp(date + "$", "i"),
      });

      var net_ws = getNetWebstats(ws);
      var part_ws = getPartWebstats(ws, "day");

      res.json({
         webstats: net_ws,
         part_webstats: part_ws,
         message:
            "Data from " +
            today.toLocaleString("default", { month: "long" }) +
            ", " +
            today.getFullYear(),
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
   }
});

router.get("/webstats/daily/:value", auth, async (req, res) => {
   try {
      var value = req.params.value.split("-");

      var date_val = value[0];
      var month_val = value[1];
      var year_val = value[2];
      var id = req.user.id;

      var date = date_val + "/" + month_val + "/" + year_val;

      var month_name = [
         "January",
         "February",
         "March",
         "April",
         "May",
         "June",
         "July",
         "August",
         "September",
         "October",
         "November",
         "December",
      ];

      let ws = await Webstats.find({
         user: id,
         session: new RegExp(date + "$", "i"),
      });

      var net_ws = getNetWebstats(ws);
      var part_ws = {};
      for (var i = 0; i < ws.length; i++) {
         if (part_ws[ws[i].session] == null) {
            part_ws[ws[i].session] = [];
         }
         part_ws[ws[i].session].push({
            url: ws[i].url,
            viewtime: ws[i].viewtime,
            timestamp: ws[i].ts,
         });
      }
      res.json({
         webstats: net_ws,
         part_webstats: part_ws,
         message:
            "Data from " +
            date_val +
            " " +
            month_name[month_val - 1] +
            ", " +
            year_val,
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
   }
});

router.get("/webstats/monthly/:value", auth, async (req, res) => {
   try {
      var value = req.params.value.split("-");
      var month_val = value[0];
      var year_val = value[1];
      var id = req.user.id;

      var date = month_val + "/" + year_val;
      let ws = await Webstats.find({
         user: id,
         session: new RegExp(date + "$", "i"),
      });

      var month_name = [
         "January",
         "February",
         "March",
         "April",
         "May",
         "June",
         "July",
         "August",
         "September",
         "October",
         "November",
         "December",
      ];

      var net_ws = getNetWebstats(ws);
      var part_ws = getPartWebstats(ws, "day");
      res.json({
         webstats: net_ws,
         part_webstats: part_ws,
         message: "Data from " + month_name[month_val - 1] + ", " + year_val,
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
   }
});

router.get("/webstats/yearly/:year_val", auth, async (req, res) => {
   try {
      var year_val = req.params.year_val;
      var id = req.user.id;

      let ws = await Webstats.find({
         user: id,
         session: new RegExp(year_val + "$", "i"),
      });

      var net_ws = getNetWebstats(ws);
      var part_ws = getPartWebstats(ws, "month");
      res.json({
         webstats: net_ws,
         part_webstats: part_ws,
         message: "Data from year " + year_val,
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
   }
});

router.get("/webstats/week", auth, async (req, res) => {
   try {
      var id = req.user.id;
      var today = new Date();

      let s = await Session.findOne({ user: id });
      var timezone_offset = s.timezone_offset;
      today.setMinutes(
         today.getMinutes() - timezone_offset + new Date().getTimezoneOffset()
      );

      var lastweek = [];
      var i, j;
      var d;
      var d_string, d_month;

      for (i = 0; i < 7; i++) {
         d = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - i
         );
         d_month = d.getMonth() + 1;
         d_string = d.getDate() + "/" + d_month + "/" + d.getFullYear();
         lastweek.push(d_string);
      }
      var webstats = [];
      let ws = await Webstats.find({ user: id });
      for (i = 0; i < ws.length; i++) {
         for (j = 0; j < lastweek.length; j++) {
            if (ws[i].session.includes(lastweek[j])) {
               webstats.push({
                  url: ws[i].url,
                  viewtime: ws[i].viewtime,
               });
            }
         }
      }

      var net_ws = getNetWebstats(ws);

      var start = lastweek[6].split("/");
      var end = lastweek[0].split("/");

      var month_name = [
         "January",
         "February",
         "March",
         "April",
         "May",
         "June",
         "July",
         "August",
         "September",
         "October",
         "November",
         "December",
      ];
      var part_ws = getPartWebstats(ws, "day");

      res.json({
         webstats: net_ws,
         part_webstats: part_ws,
         message:
            "Data from " +
            start[0] +
            " " +
            month_name[start[1] - 1] +
            " " +
            start[2] +
            " to " +
            end[0] +
            " " +
            month_name[end[1] - 1] +
            " " +
            end[2],
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
   }
});

router.get("/webstats/week/prev", auth, async (req, res) => {
   try {
      var today = new Date();
      var id = req.user.id;
      let s = await Session.findOne({ user: id });
      var timezone_offset = s.timezone_offset;
      today.setMinutes(
         today.getMinutes() - timezone_offset + new Date().getTimezoneOffset()
      );

      var lastweek = [];
      var i, j;
      var d;
      var d_string;
      for (i = 1; i <= 7; i++) {
         d = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - i - 7
         );
         d_month = d.getMonth() + 1;
         d_string = d.getDate() + "/" + d_month + "/" + d.getFullYear();
         lastweek.push(d_string);
      }
      var webstats = [];
      let ws = await Webstats.find({ user: id });
      for (i = 0; i < ws.length; i++) {
         for (j = 0; j < lastweek.length; j++) {
            if (ws[i].session.includes(lastweek[j])) {
               webstats.push({
                  url: ws[i].url,
                  viewtime: ws[i].viewtime,
               });
            }
         }
      }

      var net_ws = getNetWebstats(ws);
      var part_ws = getPartWebstats(ws, "day");
      var start = lastweek[6].split("/");
      var end = lastweek[0].split("/");

      var month_name = [
         "January",
         "February",
         "March",
         "April",
         "May",
         "June",
         "July",
         "August",
         "September",
         "October",
         "November",
         "December",
      ];

      res.json({
         webstats: net_ws,
         part_webstats: part_ws,
         message:
            "Data from " +
            start[0] +
            " " +
            month_name[start[1] - 1] +
            " " +
            start[2] +
            " to " +
            end[0] +
            " " +
            month_name[end[1] - 1] +
            " " +
            end[2],
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
   }
});

module.exports = router;
