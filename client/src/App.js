import React, { Fragment, useState } from "react";
import {
   BrowserRouter as Router,
   Route,
   Link,
   Redirect,
   Switch
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { auth } from "./actions/auth";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";

const darkTheme = createMuiTheme({
   palette: {
      primary: {
         main: "#212F3D"
      }
   }
});

export default function App() {
   return (
      <ThemeProvider theme={darkTheme}>
         <Router>
            <Fragment>
               <Navbar />
               <Route exact path="/" component={Home} />
               <section>
                  <Switch>
                     <Route exact path="/login" component={Login} />
                     <Route exact path="/register" component={Register} />
                     <PrivateRoute
                        exact
                        path="/dashboard"
                        component={Dashboard}
                     />
                  </Switch>
               </section>
            </Fragment>
         </Router>
      </ThemeProvider>
   );
}

const PrivateRoute = ({ component: Component, ...rest }) => (
   <Route
      {...rest}
      render={props =>
         auth.isAuthenticated === true ? (
            <Component {...props} />
         ) : (
            <Redirect to="/login" />
         )
      }
   />
);
