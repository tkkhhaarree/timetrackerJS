const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const UrlType = require("../models/UrlType");
const UrlVotes = require("../models/UrlVotes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");

function url_strip(url) {
   if (url.includes("http://") || url.includes("https://")) {
      url = url.replace("https://", "").replace("http://", "").replace('"', "");
   }
   if (url.includes("/")) {
      url = url.split("/", 1)[0];
   }
   return url;
}

router.post(
   "/many",
   [check("url_list", "URL can't be empty!").not().isEmpty()],
   auth,
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      try {
         const { url_list } = req.body;
         var i = 0;
         var parent_url_list = [];
         for (i = 0; i < url_list.length; i++) {
            parent_url_list.push(url_strip(url_list[i]));
         }

         var category_list = [];

         const id = req.user.id;
         //console.log("parent url list: ", parent_url_list);
         for (i = 0; i < parent_url_list.length; i++) {
            var parent_url = parent_url_list[i];
            let url_type = await UrlType.findOne({ user: id, url: parent_url });
            if (url_type) {
               category_list.push(url_type.choice);
            } else {
               let url_votes = await UrlVotes.findOne({ url: parent_url });
               if (url_votes) {
                  category_list.push(url_votes.category);
               } else {
                  category_list.push(0);
               }
            }
         }
         res.json({ category: category_list });
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server error.");
      }
   }
);

router.post(
   "/one",
   [check("url", "URL is required!").not().isEmpty()],
   auth,
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      try {
         const { url } = req.body;
         const parent_url = url_strip(url);
         const id = req.user.id;
         let url_type = await UrlType.findOne({ user: id, url: parent_url });
         if (url_type) {
            res.json({ category: url_type.choice });
         } else {
            let url_votes = await UrlVotes.findOne({ url: parent_url });
            if (url_votes) {
               res.json({ category: url_votes.category });
            } else {
               res.json({ category: 0 });
            }
         }
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server error.");
      }
   }
);

router.post(
   "/",
   [
      check("url", "URL is required!").not().isEmpty(),
      check("vote", "Vote is required!").not().isEmpty(),
   ],
   auth,
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      try {
         const { url, vote } = req.body;
         const parent_url = url_strip(url);
         const id = req.user.id;
         let url_type = await UrlType.findOne({ user: id, url: parent_url });
         var url_present = 0;
         var url_initial_vote;
         if (url_type) {
            url_present = 1;
            url_initial_vote = url_type.choice;
            url_type.choice = vote;
            await url_type.save();
         } else {
            let new_url_type = new UrlType({
               user: id,
               url: parent_url,
               choice: vote,
            });
            await new_url_type.save();
         }

         let url_vote = await UrlVotes.findOne({ url: parent_url });
         if (url_vote) {
            if (url_initial_vote == 1) {
               url_vote.positive = url_vote.positive - 1;
            } else if (url_initial_vote == 0) {
               url_vote.neutral = url_vote.neutral - 1;
            } else if (url_initial_vote == -1) {
               url_vote.negative = url_vote.negative - 1;
            }

            if (vote == 1) {
               url_vote.positive = url_vote.positive + 1;
            } else if (vote == 0) {
               url_vote.neutral = url_vote.neutral + 1;
            } else if (vote == -1) {
               url_vote.negative = url_vote.negative + 1;
            }

            if (url_vote.positive >= url_vote.neutral) {
               if (url_vote.positive >= url_vote.negative) {
                  url_vote.category = 1;
               } else {
                  url_vote.category = -1;
               }
            } else {
               if (url_vote.neutral >= url_vote.negative) {
                  url_vote.category = 0;
               } else {
                  url_vote.category = -1;
               }
            }
            await url_vote.save();
         } else {
            if (vote == 1) {
               let new_url_vote = new UrlVotes({
                  url: parent_url,
                  positive: 1,
                  category: 1,
               });
               await new_url_vote.save();
            } else if (vote == 0) {
               let new_url_vote = new UrlVotes({
                  url: parent_url,
                  neutral: 1,
                  category: 0,
               });
               await new_url_vote.save();
            } else {
               let new_url_vote = new UrlVotes({
                  url: parent_url,
                  negative: 1,
                  category: -1,
               });
               await new_url_vote.save();
            }
         }
         res.json({ message: "url category set successfully!" });
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server error.");
      }
   }
);

module.exports = router;
