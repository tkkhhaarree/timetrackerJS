import React, { Fragment, useState } from "react";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Webstats from "./Webstats";

const Dashboard = () => {
   const [interval, setInterval] = useState("all");
   const [webstatsUrl, setWebstatsUrl] = useState(
      "http://localhost:5000/stats/webstats"
   );
   const [username, setUsername] = useState();
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
      if (event.target.value == "today") {
         setWebstatsUrl("http://localhost:5000/stats/webstats/day");
      } else {
         setWebstatsUrl("http://localhost:5000/stats/webstats");
      }
      setInterval(event.target.value);
   };

   return (
      <Fragment>
         Welcome back <b>{username}</b>!<br />
         <br />
         <Select value={interval} onChange={handleChange}>
            <MenuItem value={"today"}>Today</MenuItem>
            <MenuItem value={"all"}>All Time</MenuItem>
         </Select>
         <br />
         <Webstats url={webstatsUrl} />
      </Fragment>
   );
};

export default Dashboard;
