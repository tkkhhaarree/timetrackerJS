import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { auth } from "../actions/auth";

const Dashboard = () => {
  return (
    <div>
      <b>dashboard</b>
      <br />
      <Link to="/">
        <button onClick={auth.logout}>Logout</button>
      </Link>
    </div>
  );
};

export default Dashboard;
