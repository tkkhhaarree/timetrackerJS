import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { auth } from "../actions/auth";

const useStyles = makeStyles(theme => ({
   root: {
      display: "flex",
      flex: 1
   },
   menuButton: {
      marginRight: theme.spacing(2)
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
                     style={{ textDecoration: "none", color: "white" }}
                  >
                     <b>Timetracker</b>
                  </Link>
               </Typography>

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
                     style={{ textTransform: "none" }}
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
