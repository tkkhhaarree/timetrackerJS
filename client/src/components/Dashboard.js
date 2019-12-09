import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { auth } from "../actions/auth";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";

const Webstats = () => {
  const token = localStorage.getItem("token");

  const [resp, setResp] = useState({ webstats: [] });

  async function fetchData() {
    const config = {
      headers: {
        "x-auth-token": token
      }
    };
    const res = await axios.get("http://localhost:5000/stats/webstats", config);
    setResp(res.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  var labels = [];
  var viewtime = [];
  var i;
  var colors = [];
  if (resp.webstats.length > 0) {
    for (i = 0; i < resp.webstats.length; i++) {
      labels.push(resp.webstats[i].url);
      viewtime.push(resp.webstats[i].viewtime);
    }

    while (colors.length < resp.webstats.length) {
      do {
        var color = Math.floor(Math.random() * 1000000 + 1);
      } while (colors.indexOf(color) >= 0);
      colors.push("#" + ("000000" + color.toString(16)).slice(-6));
    }
  } else {
    return (
      <h1>
        <font color="white">Loading</font>
      </h1>
    );
  }
  const pd = {
    labels: labels,
    datasets: [
      {
        label: "Points",
        backgroundColor: colors,
        data: viewtime,
        responsive: true,
        maintainAspectRatio: false
      }
    ]
  };

  return <Doughnut data={pd} />;

  //return <font color="white">{JSON.stringify(resp, null, 2)}</font>;
};

const Dashboard = () => {
  return (
    <div className="limiter">
      <Webstats />
      <div className="container-login100">
        <br />
        <Link to="/">
          <div className="container-login100-form-btn">
            <button className="login100-form-btn" onClick={auth.logout}>
              Logout
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
