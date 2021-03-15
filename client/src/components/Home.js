import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { auth } from "../actions/auth";
import Button from "@material-ui/core/Button";
import Materialink from "@material-ui/core/Link";
import { Grid, Paper } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ArrowRightAltSharpIcon from "@material-ui/icons/ArrowRightAltSharp";
import { Link as ScrollLink } from "react-scroll";
import Laptop from "../laptop.png";
import Doughnut from "../doughnut.png";
import Stack from "../stack.png";
import Extension from "../extension.gif";

const Home = () => {
   let token = localStorage.getItem("token");
   if (auth.isAuthenticated === true && token != null) {
      window.location.href = "/dashboard/daily";
   } else {
      return (
         <Fragment>
            <Grid container>
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
                     <b>Its free!</b> And simple to use. Just create an account
                     <br /> download the chrome extension and app, sign in
                     <br />
                     and you are good to go!
                     <br />
                     <br />
                     <br />
                     <Button
                        color="inherit"
                        style={{
                           textTransform: "none",
                           padding: "5px 9px",
                           marginRight: "7px",
                        }}
                     >
                        <ScrollLink to="howtouse" smooth={true}>
                           <u>
                              <b>How To Use?</b>
                           </u>
                        </ScrollLink>
                     </Button>
                     <Button
                        component={Link}
                        to="/register"
                        variant="outlined"
                        color="secondary"
                        style={{ textTransform: "none", padding: 4 }}
                     >
                        <b>Sign Up for Clockman</b>
                     </Button>
                     <Button
                        component={Materialink}
                        href="https://drive.google.com/file/d/18ST1sVeRqla2ki9fvc_aK-7ZNdMs19vp/view"
                        variant="outlined"
                        target="_blank"
                        color="secondary"
                        style={{
                           textTransform: "none",
                           padding: 4,
                           marginLeft: 12,
                        }}
                     >
                        <b>Download</b>
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
            <Grid container>
               <Grid item sm>
                  <Paper
                     elevation={0}
                     style={{
                        padding: 20,
                        marginTop: 30,
                        marginBottom: 20,
                        marginLeft: 50,
                        marginRight: 10,
                     }}
                  >
                     <img src={Stack} height={170} />
                     <img src={Doughnut} height={170} />
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
                        graphs with
                        <br />
                        browsing activity categorized as productive, distracting
                        and neutral.
                        <br />
                        <br />
                        Filter your browsing activity by days, weeks, months and
                        year to
                        <br />
                        check how productive have you been throughout the whole
                        time.
                     </div>
                  </Paper>
               </Grid>
            </Grid>
            <Grid container id="howtouse" style={{ marginTop: 35 }}>
               <Grid item sm>
                  <Paper
                     elevation={0}
                     style={{
                        padding: 10,
                        marginBottom: 20,
                        marginLeft: 10,
                     }}
                  >
                     <h1 align={"left"}>How to use Clockman?</h1>
                     <div
                        align="left"
                        style={{
                           marginRight: 10,
                           fontSize: 16,
                        }}
                     >
                        <div style={{ lineHeight: 2 }}>
                           1.&emsp;Create an Clockman account using your email
                           and a password.
                           <br />
                           2.&emsp;Download the clockman zip package and extract
                           it.
                           <Grid container direction="row" alignItems="center">
                              3.&emsp;In Chrome, click on{" "}
                              <Grid item>
                                 <MoreVertIcon style={{ color: "blue" }} />
                              </Grid>
                              <Grid item>
                                 <ArrowRightAltSharpIcon
                                    style={{ fontSize: "medium" }}
                                 />{" "}
                              </Grid>
                              More tools
                              <Grid item>
                                 <ArrowRightAltSharpIcon
                                    style={{ fontSize: "medium" }}
                                 />{" "}
                              </Grid>
                              Extensions
                           </Grid>
                           4.&emsp;Turn on Developer mode, click 'Load unpacked'
                           and select extension folder.
                           <br />
                           5.&emsp;Log in to the extension using account email
                           and password.
                           <br />
                           6.&emsp;Open app folder{" "}
                           <ArrowRightAltSharpIcon
                              style={{ fontSize: "medium" }}
                           />{" "}
                           clockman.exe and log in there as well.
                           <br />
                           <br />
                           <b>
                              Once you do this, clockman will automatically
                              monitor your web browsing and windows app usage
                              activity and provide detailed insights about the
                              productive and distracting time spent by you.
                              <br />
                              <br />
                           </b>
                           <div style={{ fontSize: 15 }}>
                              <b>*For audit purpose only: </b>
                              Click <Link to="/login">Login</Link>, Use{" "}
                              <b>Email: </b>
                              abcd@gmail.com and <b>password:</b> 123456
                           </div>
                        </div>
                     </div>
                  </Paper>
               </Grid>
               <Grid item sm>
                  <Paper
                     elevation={0}
                     style={{
                        marginTop: 30,
                        marginBottom: 20,
                        marginLeft: 10,
                        marginRight: 10,
                     }}
                  >
                     <img src={Extension} />
                  </Paper>
               </Grid>
            </Grid>
         </Fragment>
      );
   }
};

export default Home;
