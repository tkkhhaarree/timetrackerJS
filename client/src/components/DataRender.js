import React, { useState, useEffect } from "react";
import axios from "axios";
import DataOutput from "./DataOutput";

const DataRender = props => {
   const token = localStorage.getItem("token");
   const prevUrl = props.prevUrl;
   const [graphData, setGraphData] = useState({});
   const [tableData, setTableData] = useState();
   const [fail_msg, setFailMsg] = useState("");
   const [productivityScore, setProductivityScore] = useState(0);
   const statsUrl = props.url;

   async function fetchData() {
      const config = {
         headers: {
            "x-auth-token": token
         }
      };

      const res = await axios.get(statsUrl, config);

      var labels = [];
      var viewtime = [];
      var i;
      var j;
      var temp1;
      var temp2;
      var productivity_score = 0;

      for (i = 0; i < res.data.webstats.length; i++) {
         if (res.data.webstats[i].viewtime > 0) {
            labels.push(res.data.webstats[i].url);
            viewtime.push(res.data.webstats[i].viewtime);
         }
      }

      for (i = 0; i < viewtime.length - 1; i++) {
         for (j = i + 1; j < viewtime.length; j++) {
            if (viewtime[i] < viewtime[j]) {
               temp1 = viewtime[j];
               viewtime[j] = viewtime[i];
               viewtime[i] = temp1;
               temp2 = labels[j];
               labels[j] = labels[i];
               labels[i] = temp2;
            }
         }
      }

      const body = JSON.stringify({
         url_list: labels
      });

      try {
         const res2 = await axios.post(
            "http://localhost:5000/urlcategory/many",
            body,
            {
               headers: {
                  "x-auth-token": token,
                  "Content-Type": "application/json"
               }
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
         var category_lbl = ["Productive", "Neutral", "Distracting"];

         var tableContent = [];
         for (i = 0; i < labels.length; i++) {
            tableContent.push({
               url: labels[i],
               time: viewtime[i],
               category: res2.data.category[i]
            });
         }

         setTableData(tableContent);

         setGraphData({
            labels: category_lbl,
            datasets: [
               {
                  label: "Points",
                  backgroundColor: ["blue", "#bbbbbb", "red"],
                  data: category_vt
               }
            ]
         });

         if (category_vt[0] + category_vt[1] + category_vt[2] !== 0) {
            productivity_score = Math.round(
               (100 * category_vt[0]) /
                  (category_vt[0] + category_vt[1] + category_vt[2])
            );
         } else {
            productivity_score = 0;
         }
         setProductivityScore(productivity_score);
      } catch (e) {
         setFailMsg("No data available for the current duration");
      }
   }

   useEffect(() => {
      fetchData();
   }, [props.url]);

   return (
      <DataOutput
         graphData={graphData}
         tableData={tableData}
         failMsg={fail_msg}
         productivityScore={productivityScore}
         prevUrl={prevUrl}
      />
   );
};

export default DataRender;
