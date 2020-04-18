import React, { Fragment } from "react";
import DoughnutChart from "./charts/Doughnut";
import HorizontalBarChart from "./charts/HorizontalBar";
import UrlTable from "./charts/UrlTable";
import Comparison from "./charts/Comparison";
import { Grid, Paper } from "@material-ui/core";
import StackedChart from "./charts/StackedChart";

const DataOutput = (props) => {
   const graphData = props.graphData;
   const fail_msg = props.failMsg;
   const tableData = props.tableData;
   const productivityScore = props.productivityScore;
   const prevUrl = props.prevUrl;
   const totalTime = props.totalTime;
   const partWebstats = props.partWebstats;

   console.log("Productivity: ", productivityScore);
   if (fail_msg == "") {
      return (
         <Fragment>
            <Grid container spacing={1}>
               <Grid item sm>
                  <Paper
                     elevation={0}
                     style={{
                        padding: 20,
                        marginTop: 10,
                        marginBottom: 10,
                     }}
                  >
                     <DoughnutChart graphData={graphData} failMsg={fail_msg} />
                  </Paper>
               </Grid>
               <Grid item sm>
                  <Paper
                     elevation={0}
                     style={{
                        padding: 10,
                        marginTop: 10,
                        marginBottom: 10,
                     }}
                  >
                     <Comparison
                        productivityScore={productivityScore}
                        prevUrl={prevUrl}
                     />
                  </Paper>
               </Grid>

               <Grid item sm>
                  <Paper
                     elevation={0}
                     style={{
                        padding: 10,
                        marginTop: 10,
                        marginBottom: 10,
                     }}
                  >
                     <div align="center">
                        <h3>Total time logged</h3>
                        <font size="9" color="blue">
                           {totalTime}
                        </font>
                        <br />
                        <font size="4">seconds</font>
                     </div>
                  </Paper>
               </Grid>
            </Grid>

            <Grid container spacing={1}>
               <Grid item sm>
                  <Grid container spacing={1}>
                     <Grid item sm>
                        <Paper
                           elevation={0}
                           style={{
                              borderBottom: "none",
                              padding: 20,
                              marginTop: 10,
                              marginBottom: 10,
                           }}
                        >
                           <HorizontalBarChart
                              graphData={graphData}
                              failMsg={fail_msg}
                           />
                        </Paper>
                     </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                     <Grid item sm>
                        <Paper
                           elevation={0}
                           style={{
                              padding: 10,
                              marginTop: 10,
                              marginBottom: 10,
                           }}
                        >
                           <StackedChart partWebstats={partWebstats} />
                        </Paper>
                     </Grid>
                  </Grid>
               </Grid>

               <Grid item sm>
                  <UrlTable tableData={tableData} />
               </Grid>
            </Grid>
         </Fragment>
      );
   } else {
      return (
         <Fragment>
            <Grid container spacing={1}>
               <Grid item sm>
                  <Paper
                     style={{
                        padding: 30,
                        marginTop: 50,
                        marginBottom: 50,
                     }}
                  >
                     <b>{fail_msg}</b>
                  </Paper>
               </Grid>
            </Grid>
            <Grid container spacing={1}>
               <Grid item sm>
                  <Paper
                     elevation={0}
                     style={{
                        padding: 10,
                        marginTop: 10,
                        marginBottom: 10,
                     }}
                  >
                     <div align="center" marginTop="15px">
                        <h3>Total time logged</h3>
                        <font size="9" color="blue">
                           {totalTime}
                        </font>
                        <br />
                        <font size="4">seconds</font>
                     </div>
                  </Paper>
               </Grid>
               <Grid item sm>
                  <Paper
                     elevation={0}
                     style={{
                        padding: 10,
                        marginTop: 10,
                        marginBottom: 10,
                     }}
                  >
                     <Comparison
                        prevUrl={prevUrl}
                        productivityScore={productivityScore}
                     />
                  </Paper>
               </Grid>
            </Grid>
         </Fragment>
      );
   }
};

export default DataOutput;
