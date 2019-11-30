const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Session = require("../models/Session");
const CurrentUrl = require("../models/CurrentUrl");
const Webstats = require("../models/Webstats");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");

function url_strip(url) {
  if (url.includes("http://") || url.includes("https://")) {
    url = url
      .replace("https://", "")
      .replace("http://", "")
      .replace('"', "");
  }
  if (url.includes("/")) {
    url = url.split("/", 1)[0];
  }
  return url;
}

router.post(
  "/get_session",
  [
    check("init_url", "Initial URL cannot be empty.")
      .not()
      .isEmpty()
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { init_url } = req.body;
    const id = req.user.id;
    var today = new Date();
    var date =
      today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear();

    try {
      let session = await Session.findOneAndUpdate(
        { user: id },
        { current_session: date },
        { new: true, upsert: true }
      );
      console.log(session);
    } catch (err) {
      //console.log(1);
      console.error(err.message);
      res.status(500).send("Server down.");
    }

    try {
      //console.log(id);
      let cu = await CurrentUrl.findOne({ user: id });
      //console.log("check cu: ", cu);
      if (cu) {
        //console.log("1e");
        cu.url = url_strip(init_url);
        cu.session = date;
        await cu.save();
        // return previous init url
        res.json({ session: cu.session });
      } else {
        //console.log("2e");
        cu = new CurrentUrl({
          user: id,
          session: date,
          url: url_strip(init_url)
        });
        await cu.save();
        res.json({ session: cu.session });
      }

      let ws = new Webstats({
        user: id,
        session: date,
        url: init_url,
        ts: Math.floor(Date.now() / 1000),
        viewtime: 0
      });
      await ws.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
    }
  }
);

router.post("/get_app_session", auth, async (req, res) => {
  try {
    var today = new Date();
    var date =
      today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear();
    const id = req.user.id;
    try {
      let session = await Session.findOneAndUpdate(
        { user: id },
        { current_session: date },
        { new: true, upsert: true }
      );
      console.log(session);
      res.json({ session: session.current_session });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server down103.");
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server down.107");
  }
});

module.exports = router;
