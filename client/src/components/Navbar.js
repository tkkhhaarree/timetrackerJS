import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import GitHubIcon from "@material-ui/icons/GitHub";
import { auth } from "../actions/auth";

const useStyles = makeStyles(theme => ({
   root: {
      display: "flex",
      flex: 1
   },
   menuButton: {
      marginRight: theme.spacing(1)
   },
   title: {
      flexGrow: 1
   }
}));

const NavBar = () => {
   const classes = useStyles();
   const [btnText, setBtnText] = useState(
      localStorage.getItem("token") != null ? "Logout" : "Login"
   );
   const [btnLink, setBtnLink] = useState(
      localStorage.getItem("token") != null ? "/" : "/login"
   );

   function changeNavbar() {
      if (btnText == "Logout") {
         auth.logout();
         setBtnText("Login");
         setBtnLink("/login");
      }
   }

   return (
      <div className={classes.root}>
         <AppBar position="fixed">
            <Toolbar variant="dense">
               <Typography variant="h6" className={classes.title}>
                  <Link
                     href="/"
                     style={{ color: "white", textDecoration: "none" }}
                  >
                     <b style={{ fontSize: 20 }}>
                        Timetracker
                        <sup style={{ fontSize: 11 }}> beta</sup>
                     </b>
                  </Link>
               </Typography>
               <IconButton
                  component={Link}
                  href="http://github.com/tkkhhaarree/timetrackerjs"
                  target="_blank"
                  edge="end"
                  className={classes.menuButton}
                  style={{ color: "white" }}
               >
                  <GitHubIcon />
               </IconButton>
               <Link
                  href="/register"
                  style={{
                     textDecoration: "none",
                     color: "white",
                     marginRight: "7px"
                  }}
               >
                  <Button
                     variant="outlined"
                     color="inherit"
                     style={{ textTransform: "none", padding: "5px 9px" }}
                  >
                     <b>Register</b>
                  </Button>
               </Link>

               <Link
                  href={btnLink}
                  style={{
                     textDecoration: "none",
                     color: "white"
                  }}
               >
                  <Button
                     variant="outlined"
                     color="inherit"
                     style={{ textTransform: "none", padding: "5px 9px" }}
                     onClick={changeNavbar}
                  >
                     <b>{btnText}</b>
                  </Button>
               </Link>
            </Toolbar>
         </AppBar>
         <Toolbar />
      </div>
   );
};

export default NavBar;
