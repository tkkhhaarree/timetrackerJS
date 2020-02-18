import { Doughnut } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
import axios from "axios";

const DoughnutChart = props => {
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
};

export default DoughnutChart;
