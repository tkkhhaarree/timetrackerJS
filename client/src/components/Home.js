import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { auth } from "../actions/auth";

const Home = () => {
  let token = localStorage.getItem("token");
  if (auth.isAuthenticated === true && token != null) {
    return (
      <div>
        <div>
          <font color="white">you are already logged in!.</font>
          <br />
          <Link to="/dashboard">
            <div>
              <button>Dashboard</button>
            </div>
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          <font color="white">you are not logged in.</font>
          <br />
          <Link to="/login">
            <div>
              <button>Login button</button>
            </div>
          </Link>
        </div>
      </div>
    );
  }
};

export default Home;
