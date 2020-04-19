const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");

router.post(
   "/signup",
   [
      check("name", "Name is required.").not().isEmpty(),
      check("email", "Please use valid email.").isEmail(),
      check("password", "password >= 6 char").isLength({ min: 6 }),
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const { name, email, password } = req.body;
      try {
         let user = await User.findOne({ email });
         if (user) {
            return res
               .status(400)
               .json({ errors: [{ msg: "User already exists!" }] });
         }

         user = new User({ name, email, password });
         const salt = await bcrypt.genSalt(10);
         user.password = await bcrypt.hash(password, salt);
         await user.save();

         const payload = {
            user: {
               id: user.id,
            },
         };
         jwt.sign(
            payload,
            config.get("jwtSecret"),
            { expiresIn: 36000 },
            (err, token) => {
               if (err) throw err;
               res.json({ token });
            }
         );
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server error.");
      }
   }
);

router.post(
   "/login",
   [
      check("email", "Please use valid email.").isEmail(),
      check("password", "password >= 6 char").isLength({ min: 6 }),
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json(errors["errors"]);
      }

      const { email, password } = req.body;
      try {
         const user = await User.findOne({ email });
         if (!user) {
            return res
               .status(400)
               .json({ errors: [{ msg: "User does not exists!" }] });
         }
         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) {
            return res
               .status(400)
               .json({ errors: [{ msg: "invalid credentials." }] });
         }
         const payload = {
            user: {
               id: user.id,
            },
         };
         jwt.sign(
            payload,
            config.get("jwtSecret"),
            { expiresIn: 36000 },
            (err, token) => {
               if (err) throw err;
               res.json({ token, username: user.name });
               //console.log("auth token from login: ", token);
            }
         );
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server error.");
      }
   }
);

router.get("/userinfo", auth, async (req, res) => {
   try {
      const user = await User.findById(req.user.id).select("-password");
      res.json({ user });
   } catch (err2) {
      console.error(err2.message);
      res.status(500).send("Server down.");
   }
});

module.exports = router;
