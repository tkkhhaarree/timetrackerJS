import React, { Fragment } from "react";
import {
   BrowserRouter as Router,
   Route,
   Link,
   Redirect,
} from "react-router-dom";
import { auth } from "../actions/auth";
import Button from "@material-ui/core/Button";
import { Grid, Paper } from "@material-ui/core";
import Laptop from "../laptop.png";
import Doughnut from "../doughnut.JPG";
import Bar from "../bar.JPG";
import Score from "../score.JPG";

const Home = () => {
   let token = localStorage.getItem("token");
   if (auth.isAuthenticated === true && token != null) {
      return (
         <Fragment>
            <font color="black">you are already logged in!.</font>
            <br />
            <br />
            <Button
               component={Link}
               to="/dashboard/daily"
               variant="outlined"
               color="secondary"
            >
               Dashboard
            </Button>
         </Fragment>
      );
   } else {
      return (
         <Fragment>
            <Grid container spacing={1}>
               <Grid item sm>
                  <Paper
                     elevation={0}
                     style={{
                        padding: 20,
                        marginTop: 20,
                        marginBottom: 20,
                        marginLeft: 30,
                        marginRight: 10,
                     }}
                  >
                     <h1>Track how you spend your online time.</h1>
                     <b>Clockman</b> automatically tracks your browsing
                     activity,
                     <br />
                     categorizes the websites visited by you.
                     <br />
                     <br />
                     <b>Its free!</b> And simple to use. Just download the
                     extension,
                     <br />
                     and you are good to go!
                     <br />
                     <br />
                     <br />
                     <Button
                        component={Link}
                        to="/register"
                        variant="outlined"
                        color="secondary"
                        style={{ textTransform: "none", padding: 4 }}
                     >
                        <b>Sign Up for Clockman</b>
                     </Button>
                  </Paper>
               </Grid>
               <Grid item sm>
                  <Paper
                     elevation={0}
                     style={{
                        padding: 20,
                        marginTop: 30,
                        marginBottom: 10,
                     }}
                  >
                     <img
                        src={Laptop}
                        height={260}
                        style={{ marginLeft: 170 }}
                     />
                  </Paper>
               </Grid>
            </Grid>
            <Grid container spacing={1}>
               <Grid item sm>
                  <Paper
                     elevation={0}
                     style={{
                        padding: 20,
                        marginTop: 40,
                        marginBottom: 20,
                        marginLeft: 60,
                        marginRight: 10,
                     }}
                  >
                     <img src={Bar} height={150} />
                     <img src={Doughnut} height={160} />
                  </Paper>
               </Grid>
               <Grid item sm>
                  <Paper
                     elevation={0}
                     style={{
                        padding: 20,
                        marginBottom: 20,
                        marginLeft: 30,
                     }}
                  >
                     <h1 align={"left"}>
                        Detailed Insights of your browsing data.
                     </h1>
                     <div align="right" style={{ marginRight: 60 }}>
                        Watch how you spend your online time using detailed
                        graphs,
                        <br />
                        with websites categorized as productive, distracting and
                        neutral.
                        <br />
                        <br />
                        Filter your browsing data by days, weeks, months and
                        year to
                        <br />
                        check how productive have you been the whole time.
                     </div>
                  </Paper>
               </Grid>
            </Grid>
         </Fragment>
      );
   }
};

export default Home;
