import React, { Fragment, useState } from "react";
import {
   BrowserRouter as Router,
   Route,
   Link,
   Redirect,
   Switch,
} from "react-router-dom";
import Login from "./components/Login";

import Register from "./components/Register";
import { auth } from "./actions/auth";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const darkTheme = createMuiTheme({
   palette: {
      primary: {
         main: "#ffffff",
      },
      secondary: {
         main: "#222224",
      },
   },
});

export default function App() {
   return (
      <Fragment>
         <ThemeProvider theme={darkTheme}>
            <Router>
               <Navbar />
               <Route exact path="/" component={Home} />

               <Switch>
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/register" component={Register} />

                  <PrivateRoute
                     exact
                     path="/dashboard/:interval_name/:interval_value"
                     component={Dashboard}
                  />

                  <PrivateRoute
                     exact
                     path="/dashboard/:current_interval"
                     component={Dashboard}
                  />
               </Switch>
               <div
                  style={{
                     height: "30px", // Replace with the height your footer should be
                     width: "100%", // Don't change
                     backgroundColor: "#b6dbc0",
                     backgroundRepeat: "repeat",
                     backgroundAttachment: "scroll",
                     backgroundPosition: "0% 0%",
                     position: "fixed",
                     bottom: "0pt",
                     left: "0pt",
                     paddingTop: "8px",
                     paddingLeft: "10px",
                  }}
               >
                  <b>Created with</b>{" "}
                  <FontAwesomeIcon color="red" icon={faHeart} /> by&nbsp;
                  <b>
                     <a
                        href="https://www.linkedin.com/in/tkhare54321/"
                        target="_blank"
                     >
                        Tarun Khare
                     </a>
                  </b>
               </div>
            </Router>
         </ThemeProvider>
      </Fragment>
   );
}

const PrivateRoute = ({ component: Component, ...rest }) => (
   <Route
      {...rest}
      render={(props) =>
         auth.isAuthenticated === true ? (
            <Component {...props} />
         ) : (
            <Redirect to="/login" />
         )
      }
   />
);
