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
  // var colors = [
  //   "#488f31",
  //   "#8aae4c",
  //   "#c6cd6e",
  //   "#eb7c52",
  //   "#f8b669",
  //   "#ffed97"
  // ];
  var colors = [];
  var temp1;
  var temp2;
  var sum = 0;
  var sp = 0;
  var index = 0;
  var lbl = [];
  var vt = [];

  if (resp.webstats.length > 0) {
    for (i = 0; i < resp.webstats.length; i++) {
      if (resp.webstats[i].viewtime > 0) {
        labels.push(resp.webstats[i].url);
        viewtime.push(resp.webstats[i].viewtime);
      }
    }

    index = viewtime.length;

    //console.log("label before sort: ", labels);
    //console.log("viewtime after sort: ", viewtime);

    for (i = 0; i < viewtime.length - 1; i++) {
      for (j = i + 1; j < viewtime.length; j++) {
        if (viewtime[i] < viewtime[j]) {
          temp1 = viewtime[j];
          viewtime[j] = viewtime[i];
          viewtime[i] = temp1;
          temp2 = labels[j];
          labels[j] = labels[i];
          labels[i] = temp2;
        }
      }
    }
    //console.log("label after sort: ", labels);
    //console.log("viewtime after sort: ", viewtime);

    for (i = 0; i < viewtime.length; i++) {
      sum = sum + viewtime[i];
    }

    for (i = viewtime.length - 1; i >= 0; i--) {
      if (((sp + viewtime[i]) / sum) * 100 > 5) {
        break;
      } else {
        sp = sp + viewtime[i];
        index = i;
        //console.log("index: ", index);
      }
    }

    for (i = 0; i < index; i++) {
      lbl.push(labels[i]);
      vt.push(viewtime[i]);
    }

    lbl.push("others");
    vt.push(sp);

    // console.log("lbl: ", lbl);
    // console.log("vt: ", vt);

    while (colors.length < lbl.length) {
      do {
        var color = Math.floor(Math.random() * 1000000 + 1);
      } while (colors.indexOf(color) >= 0);
      colors.push("#" + ("000000" + color.toString(16)).slice(-6));
    }
  } else {
    return <h1>Loading</h1>;
  }
  const pd = {
    labels: lbl,
    datasets: [
      {
        label: "Points",
        backgroundColor: colors,
        data: vt
      }
    ]
  };

  return (
    <Doughnut
      data={pd}
      height={500}
      width={500}
      options={{
        maintainAspectRatio: false,
        legend: {
          position: "left",
          labels: {
            boxWidth: 12,
            fontSize: 12
          }
        },
        responsive: false
      }}
    />
  );
};

const rowC = {
  display: "flex",
  flexDirection: "row"
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
