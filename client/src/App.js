import React, { Fragment, useState } from "react";
import {
   BrowserRouter as Router,
   Route,
   Link,
   Redirect,
   Switch
} from "react-router-dom";
import Login from "./components/Login";
import { auth } from "./actions/auth";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Navbar from "./components/Navbar";

export default function App() {
   return (
      <Router>
         <Fragment>
            <Navbar />
            <Route exact path="/" component={Home} />
            <section>
               <Switch>
                  <Route exact path="/login" component={Login} />
                  <PrivateRoute exact path="/dashboard" component={Dashboard} />
               </Switch>
            </section>
         </Fragment>
      </Router>
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
