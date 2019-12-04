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
    res.json({ webstats: ws });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
