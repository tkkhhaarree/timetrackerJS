import React, { Fragment, useState, useEffect } from "react";
import { auth } from "../actions/auth";
import axios from "axios";
import DoughnutChart from "./charts/Doughnut";
import HorizontalBarChart from "./charts/HorizontalBar";
import { Grid, Paper } from "@material-ui/core";

const Webstats = () => {
   const token = localStorage.getItem("token");
   const [doughnutData, setDoughnutData] = useState({});

   async function fetchData() {
      const config = {
         headers: {
            "x-auth-token": token
         }
      };
      const res = await axios.get(
         "http://localhost:5000/stats/webstats",
         config
      );

      var labels = [];
      var viewtime = [];
      var i;
      var j;

      var colors = [];
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

      while (colors.length < lbl.length) {
         do {
            var color = Math.floor(Math.random() * 1000000 + 1);
         } while (colors.indexOf(color) >= 0);
         colors.push("#" + ("000000" + color.toString(16)).slice(-6));
      }

      setDoughnutData({
         labels: lbl,
         datasets: [
            {
               label: "Points",
               backgroundColor: colors,
               data: vt
            }
         ]
      });
   }

   useEffect(() => {
      fetchData();
   }, []);

   if (doughnutData != null) {
      return (
         <Fragment>
            <Grid container spacing={1}>
               <Grid item sm>
                  <Paper
                     style={{ padding: 20, marginTop: 10, marginBottom: 10 }}
                  >
                     <DoughnutChart doughnutData={doughnutData} />
                  </Paper>
               </Grid>
               <Grid item sm>
                  <Paper
                     style={{ padding: 20, marginTop: 10, marginBottom: 10 }}
                  >
                     <HorizontalBarChart doughnutData={doughnutData} />
                  </Paper>
               </Grid>
            </Grid>
         </Fragment>
      );
   } else {
      return "loading";
   }
};

const rowC = {
   display: "flex",
   flexDirection: "row"
};

const Dashboard = () => {
   return <Webstats />;
};

export default Dashboard;
