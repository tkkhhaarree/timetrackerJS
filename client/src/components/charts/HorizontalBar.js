import { HorizontalBar } from "react-chartjs-2";
import React from "react";

const HorizontalBarChart = props => {
   return (
      <HorizontalBar
         data={props.doughnutData}
         height={250}
         width={350}
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
                     }
                  }
               ],
               yAxes: [
                  {
                     gridLines: {
                        display: false
                     }
                  }
               ]
            }
         }}
      />
   );
};

export default HorizontalBarChart;
