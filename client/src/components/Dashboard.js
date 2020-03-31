import React, { Fragment, useState } from "react";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import DataRender from "./DataRender";

const Dashboard = props => {
   var interval_name = "";
   var interval_value = "";
   var api_url = "";
   var api_append = "";

   if (
      props.match.params.interval_name != null &&
      props.match.params.interval_value != null
   ) {
      interval_name = props.match.params.interval_name;
      interval_value = props.match.params.interval_value;
   } else {
      interval_name = props.match.params.current_interval;
      if (interval_name == "yearly") {
         api_append = "year";
      } else if (interval_name == "monthly") {
         api_append = "month";
      } else if (interval_name == "all") {
         api_append = "all";
      } else {
         api_append = "day";
      }
   }

   if (interval_value != "") {
      api_url =
         "http://localhost:5000/stats/webstats/" +
         interval_name +
         "/" +
         interval_value;
   } else {
      api_url = "http://localhost:5000/stats/webstats/" + api_append;
   }

   const [intervalName, setIntervalName] = useState(interval_name);
   const [webstatsUrl, setWebstatsUrl] = useState(api_url);
   const [username, setUsername] = useState();
   const [startDate, setStartDate] = useState(new Date());
   const token = localStorage.getItem("token");

   const config = {
      headers: {
         "x-auth-token": token
      }
   };

   axios
      .get("http://localhost:5000/userauth/userinfo", config)
      .then(userinfo => {
         setUsername(userinfo.data.user.name);
      });

   const handleChange = event => {
      window.open("/dashboard/" + event.target.value, "_self");
   };

   return (
      <Fragment>
         <div style={{ marginLeft: 10 }}>
            Welcome back <b>{username}</b>!<br />
         </div>
         <br />
         <Select
            value={intervalName}
            onChange={handleChange}
            style={{ marginLeft: 20 }}
         >
            <MenuItem value={"daily"}>Daily</MenuItem>
            <MenuItem value={"monthly"}>Monthly</MenuItem>
            <MenuItem value={"yearly"}>Yearly</MenuItem>
            <MenuItem value={"all"}>All Time</MenuItem>
         </Select>
         <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
         />
         <br />
         <DataRender url={webstatsUrl} />
      </Fragment>
   );
};

export default Dashboard;
