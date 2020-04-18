import React, { useState, useEffect } from "react";
import axios from "axios";

const Comparison = (props) => {
   const token = localStorage.getItem("token");
   const [prevScore, setPrevScore] = useState(0);
   const productivityScore = props.productivityScore;
   const prevUrl = props.prevUrl;

   var prev_msg = "";
   var no_prev = "block";
   if (prevUrl.includes("daily")) {
      prev_msg = " as compared to previous day";
   } else if (prevUrl.includes("weekly")) {
      prev_msg = " as compared to previous week";
   } else if (prevUrl.includes("monthly")) {
      prev_msg = " as compared to previous month";
   } else if (prevUrl.includes("yearly")) {
      prev_msg = " as compared to previous year";
   } else {
      no_prev = "none";
   }

   async function fetchData() {
      const config = {
         headers: {
            "x-auth-token": token,
         },
      };

      const res = await axios.get(prevUrl, config);

      var labels = [];
      var viewtime = [];
      var i;
      var j;
      var prev_score = 0;

      for (i = 0; i < res.data.webstats.length; i++) {
         if (res.data.webstats[i].viewtime > 0) {
            labels.push(res.data.webstats[i].url);
            viewtime.push(res.data.webstats[i].viewtime);
         }
      }

      const body = JSON.stringify({
         url_list: labels,
      });

      try {
         const res2 = await axios.post(
            "http://localhost:5000/urlcategory/many",
            body,
            {
               headers: {
                  "x-auth-token": token,
                  "Content-Type": "application/json",
               },
            }
         );

         var positive_time = 0;
         var neutral_time = 0;
         var negative_time = 0;
         for (i = 0; i < res2.data.category.length; i++) {
            if (res2.data.category[i] == 1) {
               positive_time = positive_time + viewtime[i];
            } else if (res2.data.category[i] == 0) {
               neutral_time = neutral_time + viewtime[i];
            } else if (res2.data.category[i] == -1) {
               negative_time = negative_time + viewtime[i];
            }
         }

         var category_vt = [positive_time, neutral_time, negative_time];

         if (category_vt[0] + category_vt[1] + category_vt[2] !== 0) {
            prev_score = Math.round(
               (100 * category_vt[0]) /
                  (category_vt[0] + category_vt[1] + category_vt[2])
            );
         } else {
            prev_score = 0;
         }
         setPrevScore(prev_score);
         console.log("prev score: ", prev_score);
      } catch (e) {
         setPrevScore(0);
      }
   }

   useEffect(() => {
      fetchData();
   }, [prevUrl]);

   return (
      <div align="center">
         <h3>Your Productivity Score:</h3>
         <font size="9" color={productivityScore > 50 ? "#4aba25" : "red"}>
            {productivityScore}
         </font>
         <br></br>
         <font
            style={{ display: no_prev }}
            size="4"
            color={productivityScore - prevScore >= 0 ? "green" : "red"}
         >
            {productivityScore - prevScore >= 0
               ? " +" + parseInt(productivityScore - prevScore)
               : productivityScore - prevScore}
            <font color="black">{prev_msg}</font>
         </font>
      </div>
   );
};

export default Comparison;
