const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Session = require("../models/Session");
const CurrentUrl = require("../models/CurrentUrl");
const Webstats = require("../models/Webstats");
const auth = require("../middleware/auth");
var cors = require("cors");
router.use(cors());

router.get("/webstats", auth, async (req, res) => {
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

      res.json({ webstats: net_ws });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
   }
});

router.get("/webstats/day", auth, async (req, res) => {
   try {
      const id = req.user.id;
      var today = new Date();
      var date =
         today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear();
      let ws = await Webstats.find({ user: id, session: date });
      res.json({ webstats: ws });
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

      res.json({ webstats: net_ws });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
   }
});

router.get("/webstats/month", auth, async (req, res) => {
   try {
      const id = req.user.id;
      var today = new Date();
      var date = today.getMonth() + "/" + today.getFullYear();
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

      res.json({ webstats: net_ws });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
   }
});

module.exports = router;
