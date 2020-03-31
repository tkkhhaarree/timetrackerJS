import React, { Fragment } from "react";
import DoughnutChart from "./charts/Doughnut";
import HorizontalBarChart from "./charts/HorizontalBar";
import UrlTable from "./charts/UrlTable";
import { Grid, Paper } from "@material-ui/core";

const DataOutput = props => {
   const graphData = props.graphData;
   const fail_msg = props.failMsg;
   const tableData = props.tableData;
   if (fail_msg == "") {
      return (
         <Fragment>
            <Grid container spacing={1}>
               <Grid item sm>
                  <Paper
                     style={{
                        padding: 20,
                        marginTop: 10,
                        marginBottom: 10
                     }}
                  >
                     <DoughnutChart graphData={graphData} failMsg={fail_msg} />
                  </Paper>
               </Grid>
               <Grid item sm>
                  <Paper
                     style={{ padding: 20, marginTop: 10, marginBottom: 10 }}
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
                  <UrlTable tableData={tableData} />
               </Grid>
            </Grid>
         </Fragment>
      );
   } else {
      return (
         <Grid container spacing={1}>
            <Grid item sm>
               <Paper
                  style={{
                     padding: 30,
                     marginTop: 50,
                     marginBottom: 50
                  }}
               >
                  <b>{fail_msg}</b>
               </Paper>
            </Grid>
         </Grid>
      );
   }
};

export default DataOutput;
