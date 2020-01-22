import React from "react";
import {
   BrowserRouter as Router,
   Route,
   Link,
   Redirect
} from "react-router-dom";
import { auth } from "../actions/auth";
import Button from "@material-ui/core/Button";

const Home = () => {
   let token = localStorage.getItem("token");
   if (auth.isAuthenticated === true && token != null) {
      return (
         <div>
            <font color="black">you are already logged in!.</font>
            <br />
            <br />
            <Button
               component={Link}
               to="/dashboard"
               variant="outlined"
               color="primary"
            >
               Dashboard
            </Button>
         </div>
      );
   } else {
      return (
         <div>
            <font color="black">you are not logged in.</font>
            <br />
            <br />
            <Button
               component={Link}
               to="/login"
               variant="outlined"
               color="primary"
            >
               Login button
            </Button>
            <Button
               component={Link}
               to="/register"
               variant="outlined"
               color="primary"
            >
               Register button
            </Button>
         </div>
      );
   }
};

export default Home;
