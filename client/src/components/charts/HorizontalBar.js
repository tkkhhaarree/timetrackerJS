import { HorizontalBar } from "react-chartjs-2";
import React from "react";

const HorizontalBarChart = props => {
   return (
      <HorizontalBar
         data={props.graphData}
         height={200}
         width={300}
         options={{
            legend: {
               display: false
            },
            maintainAspectRatio: false,
            responsive: false,
            scales: {
               xAxes: [
                  {
                     gridLines: {
                        display: false
                     },
                     ticks: {
                        beginAtZero: true
                     }
                  }
               ],
               yAxes: [
                  {
                     gridLines: {
                        display: false
                     },
                     barPercentage: 0.6
                  }
               ]
            }
         }}
      />
   );
};

export default HorizontalBarChart;
