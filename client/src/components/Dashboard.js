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
  var j;
  var colors = [
    "#488f31",
    "#8aae4c",
    "#c6cd6e",
    "#eb7c52",
    "#f8b669",
    "#ffed97"
  ];
  if (resp.webstats.length > 0) {
    for (i = 0; i < resp.webstats.length; i++) {
      if (resp.webstats[i].viewtime > 0) {
        labels.push(resp.webstats[i].url);
        viewtime.push(resp.webstats[i].viewtime);
      }
    }

    var temp1;
    var temp2;
    for (i = 0; i < viewtime.length - 1; i++) {
      for (j = 1; j < viewtime.length; j++) {
        if (viewtime[j] < viewtime[i]) {
          temp1 = viewtime[j];
          viewtime[j] = viewtime[i];
          viewtime[i] = temp1;
          temp2 = labels[j];
          labels[j] = labels[i];
          labels[i] = temp2;
        }
      }
    }

    var sum = 0;
    for (i = 0; i < viewtime.length; i++) {
      sum = sum + viewtime[i];
    }
    var sp = 0;
    var index;
    for (i = viewtime.length - 1; i >= 0; i--) {
      if (((sp + viewtime[i]) / sum) * 100 > 1) {
        break;
      } else {
        sp = sp + viewtime[i];
        index = i;
      }
    }

    var lbl = [];
    var vt = [];
    for (i = 0; i < index; i++) {
      lbl.push(labels[i]);
      vt.push(viewtime[i]);
    }

    lbl.push("others");
    vt.push(sp);

    console.log(lbl);
    console.log(sp);

    while (colors.length < lbl.length) {
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
    labels: lbl,
    datasets: [
      {
        label: "Points",
        backgroundColor: colors,
        data: vt,
        responsive: true,
        maintainAspectRatio: false
      }
    ]
  };

  return (
    <div height="50%" width="50%" align="center">
      <Doughnut data={pd} />
    </div>
  );
};

const Dashboard = () => {
  return (
    <div>
      <Webstats />

      <Link to="/">
        <div>
          <button onClick={auth.logout}>Logout</button>
        </div>
      </Link>
    </div>
  );
};

export default Dashboard;
