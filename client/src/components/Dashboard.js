import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { auth } from "../actions/auth";

const Webstats = () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "x-auth-token": token
    }
  };
  return axios
    .post("http://localhost:5000/stats/webstats", config)
    .catch(err => {
      console.log(err);
    });
};

const Dashboard = () => {
  return (
    <div>
      <Webstats />
      <br />
      <Link to="/">
        <button onClick={auth.logout}>Logout</button>
      </Link>
    </div>
  );
};

export default Dashboard;
