import React, { Fragment, useState, useEffect } from "react";
import { auth } from "../actions/auth";
import axios from "axios";
import DoughnutChart from "./charts/Doughnut";
import HorizontalBarChart from "./charts/HorizontalBar";
import UrlTable from "./charts/UrlTable";
import { Grid, Paper } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

const Webstats = () => {
   const token = localStorage.getItem("token");
   const [graphData, setGraphData] = useState({});
   const [tableData, setTableData] = useState();
   const [username, setUsername] = useState();
   const [interval, setInterval] = React.useState("day");

   async function fetchData() {
      const config = {
         headers: {
            "x-auth-token": token
         }
      };

      const userinfo = await axios.get(
         "http://localhost:5000/userauth/userinfo",
         config
      );
      console.log(userinfo.data.user.name);
      setUsername(userinfo.data.user.name);

      var statsUrl = "http://localhost:5000/stats/webstats/";

      if (interval == "Daily") {
         statsUrl = "http://localhost:5000/stats/webstats/" + "day";
      } else {
         statsUrl = "http://localhost:5000/stats/webstats/";
      }

      const res = await axios.get(statsUrl, config);

      var labels = [];
      var viewtime = [];
      var i;
      var j;
      var temp1;
      var temp2;
      var sum = 0;
      var sp = 0;
      var index = 0;
      var lbl = [];
      var vt = [];

      for (i = 0; i < res.data.webstats.length; i++) {
         if (res.data.webstats[i].viewtime > 0) {
            labels.push(res.data.webstats[i].url);
            viewtime.push(res.data.webstats[i].viewtime);
         }
      }

      index = viewtime.length;

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

      for (i = 0; i < viewtime.length; i++) {
         sum = sum + viewtime[i];
      }

      for (i = viewtime.length - 1; i >= 0; i--) {
         if (((sp + viewtime[i]) / sum) * 100 > 5) {
            break;
         } else {
            sp = sp + viewtime[i];
            index = i;
         }
      }

      for (i = 0; i < index; i++) {
         lbl.push(labels[i]);
         vt.push(viewtime[i]);
      }

      lbl.push("others");
      vt.push(sp);

      const body = JSON.stringify({
         url_list: labels
      });

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
      var category_lbl = ["productive", "neutral", "unproductive"];

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
   }

   useEffect(() => {
      fetchData();
   }, []);

   const handleChange = event => {
      setInterval(event.target.value);
   };

   return (
      <Fragment>
         Hello <b>{username}</b>!<br />
         <br />
         <Select value={interval} onChange={handleChange}>
            <MenuItem value={"day"}>Daily</MenuItem>
            <MenuItem value={"week"}>Weekly</MenuItem>
            <MenuItem value={"year"}>Yearly</MenuItem>
            <MenuItem value={"all"}>All Time</MenuItem>
         </Select>
         <Grid container spacing={1}>
            <Grid item sm>
               <Paper
                  style={{
                     padding: 20,
                     marginTop: 10,
                     marginBottom: 10
                  }}
               >
                  <DoughnutChart graphData={graphData} />
               </Paper>
            </Grid>
            <Grid item sm>
               <Paper style={{ padding: 20, marginTop: 10, marginBottom: 10 }}>
                  <HorizontalBarChart graphData={graphData} />
               </Paper>
            </Grid>
         </Grid>
         <Grid container spacing={1}>
            <Grid item sm>
               <UrlTable tableData={tableData} />
            </Grid>
         </Grid>
      </Fragment>
   );
};

const rowC = {
   display: "flex",
   flexDirection: "row"
};

const Dashboard = () => {
   return <Webstats />;
};

export default Dashboard;
