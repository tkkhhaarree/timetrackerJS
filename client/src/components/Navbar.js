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
import Logo from "../../src/clockman_logo.png";

const useStyles = makeStyles((theme) => ({
   root: {
      display: "flex",
      flex: 1,
   },
   menuButton: {
      marginRight: theme.spacing(1),
   },
   title: {
      flexGrow: 1,
   },
}));

const NavBar = () => {
   const classes = useStyles();
   const [btnText, setBtnText] = useState(
      localStorage.getItem("token") != null && auth.isAuthenticated
         ? "Logout"
         : "Login"
   );

   const [btnLink, setBtnLink] = useState(
      localStorage.getItem("token") != null && auth.isAuthenticated
         ? "/"
         : "/login"
   );
   const [registerDisplay, setRegisterDisplay] = useState(
      localStorage.getItem("token") != null && auth.isAuthenticated
         ? {
              textTransform: "none",
              padding: "5px 9px",
              textDecoration: "none",
              color: "black",
              marginRight: "7px",
              display: "none",
           }
         : {
              textTransform: "none",
              padding: "5px 9px",
              textDecoration: "none",
              color: "black",
              marginRight: "7px",
              display: "block",
           }
   );

   function changeNavbar() {
      if (btnText == "Logout") {
         auth.logout();
         setBtnText("Login");
         setBtnLink("/login");
         setRegisterDisplay({
            textTransform: "none",
            padding: "5px 9px",
            textDecoration: "none",
            color: "black",
            marginRight: "7px",
            display: "block",
         });
         console.log("block");
      }
   }

   return (
      <div className={classes.root}>
         <AppBar
            position="fixed"
            elevation={1}
            style={{ backgroundColor: "#f5f4f0" }}
         >
            <Toolbar
               variant="dense"
               style={{
                  paddingLeft: "10px",
                  paddingRight: "10px",
               }}
            >
               <Typography variant="h6" className={classes.title}>
                  <Link href="/">
                     <img
                        src={Logo}
                        height={40}
                        style={{ marginTop: 10, marginBottom: 2 }}
                     />
                  </Link>
               </Typography>
               <IconButton
                  component={Link}
                  href="http://github.com/tkkhhaarree/timetrackerjs"
                  target="_blank"
                  edge="end"
                  className={classes.menuButton}
                  style={{ color: "black" }}
               >
                  <GitHubIcon />
               </IconButton>

               <Button
                  component={Link}
                  href="https://drive.google.com/file/d/18ST1sVeRqla2ki9fvc_aK-7ZNdMs19vp/view"
                  target="_blank"
                  color="inherit"
                  variant="outlined"
                  style={{
                     textTransform: "none",
                     padding: "5px 9px",
                     textDecoration: "none",
                     color: "black",
                     marginRight: "7px",
                  }}
               >
                  <b>Download</b>
               </Button>

               <Button
                  component={Link}
                  href="/register"
                  variant="outlined"
                  color="inherit"
                  style={registerDisplay}
               >
                  <b>Register</b>
               </Button>

               <Link
                  href={btnLink}
                  style={{
                     textDecoration: "none",
                     color: "black",
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
