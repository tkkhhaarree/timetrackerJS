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
               <section>
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
               </section>
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
