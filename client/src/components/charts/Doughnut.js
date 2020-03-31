import { Doughnut } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
import axios from "axios";

const DoughnutChart = props => {
   const fail_msg = props.failMsg;
   console.log("from1 doughnut: ", fail_msg);
   if (fail_msg == "") {
      return (
         <Doughnut
            data={props.graphData}
            height={200}
            width={300}
            options={{
               cutoutPercentage: 55,
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
   } else {
      console.log("from doughnut: ", fail_msg);
      return fail_msg;
   }
};

export default DoughnutChart;
