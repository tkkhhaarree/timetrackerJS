import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import DataOutput from "./DataOutput";

const DataRender = (props) => {
   const token = localStorage.getItem("token");
   const prevUrl = props.prevUrl;
   const loadingDisable = props.loadingDisable;
   const [graphData, setGraphData] = useState({});
   const [tableData, setTableData] = useState();
   const [fail_msg, setFailMsg] = useState("");
   const [productivityScore, setProductivityScore] = useState(0);
   const statsUrl = props.url;
   const [totalTime, setTotalTime] = useState(0);
   const [partWebstats, setPartWebstats] = useState();

   async function fetchData() {
      const config = {
         headers: {
            "x-auth-token": token,
         },
      };
      try {
         const res = await axios.get(statsUrl, config);

         var labels = [];
         var viewtime = [];
         var timestamp = [];
         var i;

         var productivity_score = 0;

         for (i = 0; i < res.data.webstats.length; i++) {
            if (res.data.webstats[i].viewtime > 0) {
               labels.push(res.data.webstats[i].url);
               viewtime.push(res.data.webstats[i].viewtime);
               timestamp.push(res.data.webstats[i].timestamp);
            }
         }

         console.log("timestamps: ", timestamp);

         const body = JSON.stringify({
            url_list: labels,
         });

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

         var c;
         var part_webstats = res.data.part_webstats;
         for (var x in part_webstats) {
            for (var j = 0; j < part_webstats[x].length; j++) {
               c = res2.data.category[labels.indexOf(part_webstats[x][j].url)];
               part_webstats[x][j]["category"] = c;
            }
         }
         //console.log("part webstats: ", part_webstats);
         setPartWebstats(part_webstats);

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
         setTotalTime(positive_time + negative_time + neutral_time);
         var category_lbl = ["Productive", "Neutral", "Distracting"];

         var tableContent = [];
         for (i = 0; i < labels.length; i++) {
            tableContent.push({
               url: labels[i],
               time: viewtime[i],
               category: res2.data.category[i],
            });
         }

         setTableData(tableContent);

         setGraphData({
            labels: category_lbl,
            datasets: [
               {
                  label: "Points",
                  backgroundColor: ["blue", "#bbbbbb", "red"],
                  data: category_vt,
               },
            ],
         });

         console.log("graph data from render: ", {
            labels: category_lbl,
            datasets: [
               {
                  label: "Points",
                  backgroundColor: ["blue", "#bbbbbb", "red"],
                  data: category_vt,
               },
            ],
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
         loadingDisable();
      } catch (e) {
         setFailMsg("No data available for the current duration");
         console.log("fail msg from render: ", e);
         loadingDisable();
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
         totalTime={totalTime}
         partWebstats={partWebstats}
      />
   );
};

export default DataRender;
