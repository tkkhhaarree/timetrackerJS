import React, { Fragment, useState } from "react";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import DataRender from "./DataRender";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@material-ui/core";
import IntervalChange from "./IntervalChange";

const Dashboard = (props) => {
   var interval_name = "";
   var interval_value = "";
   var api_url = "";
   var api_append = "";
   var data_msg = "";
   var month_name = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
   ];

   if (
      props.match.params.interval_name != null &&
      props.match.params.interval_value != null
   ) {
      interval_name = props.match.params.interval_name;
      interval_value = props.match.params.interval_value;

      if (interval_name == "yearly") {
         data_msg = "Your browsing stats from " + interval_value;
      } else if (interval_name == "monthly") {
         var m = month_name[interval_value.split("-")[0] - 1];
         data_msg =
            "Your browsing stats from " +
            m +
            ", " +
            interval_value.split("-")[1];
      } else if (interval_name == "all") {
         data_msg = "Your browsing stats from all time";
      } else if (interval_name == "weekly") {
         data_msg = "Your browsing stats this week";
      } else {
         data_msg =
            "Your browsing stats from " +
            interval_value.split("-")[0] +
            " " +
            month_name[interval_value.split("-")[1] - 1] +
            ", " +
            interval_value.split("-")[2];
      }
   } else {
      interval_name = props.match.params.current_interval;
      var d = new Date();
      if (interval_name == "yearly") {
         api_append = "year";
         data_msg = "Your browsing stats from " + d.getFullYear();
      } else if (interval_name == "monthly") {
         api_append = "month";
         data_msg =
            "Your browsing stats from " +
            month_name[d.getMonth()] +
            ", " +
            d.getFullYear();
      } else if (interval_name == "all") {
         api_append = "all";
         data_msg = "Your browsing stats from all time";
      } else if (interval_name == "weekly") {
         api_append = "week";
         data_msg = "Your browsing stats from this week";
      } else {
         api_append = "day";
         data_msg =
            "Your browsing stats from " +
            d.getDate() +
            " " +
            month_name[d.getMonth()] +
            ", " +
            d.getFullYear();
      }
   }

   if (interval_value != "") {
      api_url = "/stats/webstats/" + interval_name + "/" + interval_value;
   } else {
      api_url = "/stats/webstats/" + api_append;
   }

   var prev_append = getPrevUrl(interval_name, interval_value);
   var prev_url = "/stats/webstats/" + interval_name + "/" + prev_append;

   const [intervalName, setIntervalName] = useState(interval_name);
   const [webstatsUrl, setWebstatsUrl] = useState(api_url);
   const [prevUrl, setPrevUrl] = useState(prev_url);
   const [username, setUsername] = useState();
   const token = localStorage.getItem("token");
   const [openInterval, setOpenInterval] = useState(false);

   const config = {
      headers: {
         "x-auth-token": token,
      },
   };

   axios.get("/userauth/userinfo", config).then((userinfo) => {
      setUsername(userinfo.data.user.name);
   });

   const handleChange = (event) => {
      window.open("/dashboard/" + event.target.value, "_self");
   };

   const changeCancel = () => {
      setOpenInterval(false);
   };

   const intervalClick = () => {
      setOpenInterval(true);
   };

   return (
      <Fragment>
         <div style={{ marginLeft: 10 }}>
            Welcome back <b>{username}</b>!<br />
            <br />
            <b>{data_msg}</b>
         </div>
         <br />
         <Select
            value={intervalName}
            onChange={handleChange}
            style={{ marginLeft: 20 }}
         >
            <MenuItem value={"daily"}>Daily</MenuItem>
            <MenuItem value={"weekly"}>Weekly</MenuItem>
            <MenuItem value={"monthly"}>Monthly</MenuItem>
            <MenuItem value={"yearly"}>Yearly</MenuItem>
            <MenuItem value={"all"}>All Time</MenuItem>
         </Select>

         <Button
            variant="outlined"
            color="primary"
            style={{
               marginLeft: 20,
               paddingLeft: "5px",
               paddingRight: "5px",
               textTransform: "none",
            }}
            onClick={intervalClick}
         >
            Select Interval
         </Button>
         <IntervalChange open={openInterval} changeCancel={changeCancel} />

         <br />
         <DataRender url={webstatsUrl} prevUrl={prevUrl} />
      </Fragment>
   );
};

function getPrevUrl(interval_name, interval_value) {
   var prev_d, prev_append, m;

   if (interval_value == "") {
      var d = new Date();

      if (interval_name == "daily") {
         prev_d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
         m = prev_d.getMonth() + 1;
         prev_append = prev_d.getDate() + "-" + m + "-" + prev_d.getFullYear();
      } else if (interval_name == "weekly") {
         prev_append = "prev";
      } else if (interval_name == "monthly") {
         prev_d = new Date(d.getFullYear(), d.getMonth() - 1, 5);
         m = prev_d.getMonth() + 1;
         prev_append = m + "-" + prev_d.getFullYear();
      } else if (interval_name == "yearly") {
         prev_append = d.getFullYear() - 1;
      }
   } else {
      var interval_split = interval_value.split("-");
      if (interval_name == "daily") {
         prev_d = new Date(
            interval_split[2],
            interval_split[1] - 1,
            interval_split[0] - 1
         );
         m = prev_d.getMonth() + 1;
         prev_append = prev_d.getDate() + "-" + m + "-" + prev_d.getFullYear();
      } else if (interval_name == "monthly") {
         prev_d = new Date(interval_split[1], interval_split[0] - 2, 5);
         m = prev_d.getMonth() + 1;
         prev_append = m + "-" + prev_d.getFullYear();
      } else if (interval_name == "yearly") {
         prev_append = interval_split[0] - 1;
      }
   }
   return prev_append;
}

export default Dashboard;
