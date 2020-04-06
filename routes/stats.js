const express = require("express");
const router = express.Router();
const Webstats = require("../models/Webstats");
const auth = require("../middleware/auth");
var cors = require("cors");
router.use(cors());

router.get("/webstats/all", auth, async (req, res) => {
   try {
      const id = req.user.id;
      let ws = await Webstats.find({ user: id });
      var i = 0;
      var unique_url = {};
      for (i = 0; i < ws.length; i++) {
         if (!(ws[i].url in unique_url)) {
            unique_url[ws[i].url] = ws[i].viewtime;
         } else {
            unique_url[ws[i].url] = unique_url[ws[i].url] + ws[i].viewtime;
         }
      }

      var net_ws = [];
      for (key in unique_url) {
         var x = {
            url: key,
            viewtime: unique_url[key]
         };
         net_ws.push(x);
      }

      res.json({ webstats: net_ws, message: "All time data." });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
   }
});

router.get("/webstats/day", auth, async (req, res) => {
   try {
      const id = req.user.id;
      var today = new Date();
      var month = parseInt(today.getMonth()) + 1;
      var date = today.getDate() + "/" + month + "/" + today.getFullYear();
      let ws = await Webstats.find({ user: id, session: date });
      res.json({
         webstats: ws,
         message:
            "Data from " +
            today.getDate() +
            " " +
            today.toLocaleString("default", { month: "long" }) +
            ", " +
            today.getFullYear()
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
      var date = today.getFullYear();
      let ws = await Webstats.find({
         user: id,
         session: new RegExp(date + "$", "i")
      });

      var i = 0;
      var unique_url = {};
      for (i = 0; i < ws.length; i++) {
         if (!(ws[i].url in unique_url)) {
            unique_url[ws[i].url] = ws[i].viewtime;
         } else {
            unique_url[ws[i].url] = unique_url[ws[i].url] + ws[i].viewtime;
         }
      }

      var net_ws = [];
      for (key in unique_url) {
         var x = {
            url: key,
            viewtime: unique_url[key]
         };
         net_ws.push(x);
      }

      res.json({ webstats: net_ws, message: "Data from year " + date });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
   }
});

router.get("/webstats/month", auth, async (req, res) => {
   try {
      const id = req.user.id;
      var today = new Date();
      var month = parseInt(today.getMonth()) + 1;
      var date = month + "/" + today.getFullYear();
      let ws = await Webstats.find({
         user: id,
         session: new RegExp(date + "$", "i")
      });

      var i = 0;
      var unique_url = {};
      for (i = 0; i < ws.length; i++) {
         if (!(ws[i].url in unique_url)) {
            unique_url[ws[i].url] = ws[i].viewtime;
         } else {
            unique_url[ws[i].url] = unique_url[ws[i].url] + ws[i].viewtime;
         }
      }

      var net_ws = [];
      for (key in unique_url) {
         var x = {
            url: key,
            viewtime: unique_url[key]
         };
         net_ws.push(x);
      }

      res.json({
         webstats: net_ws,
         message:
            "Data from " +
            today.toLocaleString("default", { month: "long" }) +
            ", " +
            today.getFullYear()
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
         "December"
      ];

      let ws = await Webstats.find({
         user: id,
         session: new RegExp(date + "$", "i")
      });

      var i = 0;
      var unique_url = {};
      for (i = 0; i < ws.length; i++) {
         if (!(ws[i].url in unique_url)) {
            unique_url[ws[i].url] = ws[i].viewtime;
         } else {
            unique_url[ws[i].url] = unique_url[ws[i].url] + ws[i].viewtime;
         }
      }

      var net_ws = [];
      for (key in unique_url) {
         var x = {
            url: key,
            viewtime: unique_url[key]
         };
         net_ws.push(x);
      }

      res.json({
         webstats: net_ws,
         message:
            "Data from " +
            date_val +
            " " +
            month_name[month_val - 1] +
            ", " +
            year_val
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
         session: new RegExp(date + "$", "i")
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
         "December"
      ];

      var i = 0;
      var unique_url = {};
      for (i = 0; i < ws.length; i++) {
         if (!(ws[i].url in unique_url)) {
            unique_url[ws[i].url] = ws[i].viewtime;
         } else {
            unique_url[ws[i].url] = unique_url[ws[i].url] + ws[i].viewtime;
         }
      }

      var net_ws = [];
      for (key in unique_url) {
         var x = {
            url: key,
            viewtime: unique_url[key]
         };
         net_ws.push(x);
      }

      res.json({
         webstats: net_ws,
         message: "Data from " + month_name[month_val - 1] + ", " + year_val
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
         session: new RegExp(year_val + "$", "i")
      });

      var i = 0;
      var unique_url = {};
      for (i = 0; i < ws.length; i++) {
         if (!(ws[i].url in unique_url)) {
            unique_url[ws[i].url] = ws[i].viewtime;
         } else {
            unique_url[ws[i].url] = unique_url[ws[i].url] + ws[i].viewtime;
         }
      }

      var net_ws = [];
      for (key in unique_url) {
         var x = {
            url: key,
            viewtime: unique_url[key]
         };
         net_ws.push(x);
      }

      res.json({ webstats: net_ws, message: "Data from year " + year_val });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
   }
});

router.get("/webstats/week", auth, async (req, res) => {
   try {
      var today = new Date();
      var lastweek = [];
      var i, j;
      var d;
      var d_string;
      var id = req.user.id;
      for (i = 1; i <= 7; i++) {
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
            if (ws[i].session == lastweek[j]) {
               webstats.push({
                  url: ws[i].url,
                  viewtime: ws[i].viewtime
               });
            }
         }
      }

      var unique_url = {};
      for (i = 0; i < webstats.length; i++) {
         if (!(webstats[i].url in unique_url)) {
            unique_url[webstats[i].url] = webstats[i].viewtime;
         } else {
            unique_url[webstats[i].url] =
               unique_url[webstats[i].url] + webstats[i].viewtime;
         }
      }

      var net_ws = [];
      for (key in unique_url) {
         var x = {
            url: key,
            viewtime: unique_url[key]
         };
         net_ws.push(x);
      }

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
         "December"
      ];

      res.json({
         webstats: net_ws,
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
            end[2]
      });
   } catch (err) {
      //console.error(err.message);
      res.status(500).send("Server error.");
   }
});

router.get("/webstats/week/prev", auth, async (req, res) => {
   try {
      var today = new Date();
      var lastweek = [];
      var i, j;
      var d;
      var d_string;
      var id = req.user.id;
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
            if (ws[i].session == lastweek[j]) {
               webstats.push({
                  url: ws[i].url,
                  viewtime: ws[i].viewtime
               });
            }
         }
      }

      var unique_url = {};
      for (i = 0; i < webstats.length; i++) {
         if (!(webstats[i].url in unique_url)) {
            unique_url[webstats[i].url] = webstats[i].viewtime;
         } else {
            unique_url[webstats[i].url] =
               unique_url[webstats[i].url] + webstats[i].viewtime;
         }
      }

      var net_ws = [];
      for (key in unique_url) {
         var x = {
            url: key,
            viewtime: unique_url[key]
         };
         net_ws.push(x);
      }

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
         "December"
      ];

      res.json({
         webstats: net_ws,
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
            end[2]
      });
   } catch (err) {
      //console.error(err.message);
      res.status(500).send("Server error.");
   }
});

module.exports = router;
