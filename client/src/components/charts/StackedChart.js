import { Bar, Line } from "react-chartjs-2";
import React from "react";

var monthNames = [
   "Jan",
   "Feb",
   "Mar",
   "Apr",
   "May",
   "Jun",
   "Jul",
   "Aug",
   "Sep",
   "Oct",
   "Nov",
   "Dec",
];
var d_name = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const StackedChart = (props) => {
   const partWebstats = props.partWebstats;

   const interval = window.location.href.split("dashboard/")[1];
   const [interval_name, interval_value] = interval.split("/");
   var x_axis = getXAxis(interval_name, interval_value);

   var interval_part;
   var data_x_axis = [];
   var p_x_axis = [];
   var d_x_axis = [];
   var n_x_axis = [];

   for (var i in partWebstats) {
      if (interval_name == "daily") {
         interval_part = i.split("-")[0]; // 0-24
      } else if (interval_name == "weekly") {
         var d = new Date(
            i.split("/")[2],
            i.split("/")[1] - 1,
            i.split("/")[0]
         );
         console.log(d);
         interval_part = d_name[d.getDay()];
      } else if (interval_name == "yearly") {
         var m_int = parseInt(i.split("/")[0]);
         interval_part = monthNames[m_int - 1];
      } else if (interval_name == "monthly" || "all") {
         interval_part = i.split("/")[0]; //1-31 or 2020
      }
      data_x_axis.push(interval_part);
      var p = 0;
      var d = 0;
      var n = 0;

      for (let j = 0; j < partWebstats[i].length; j++) {
         if (partWebstats[i][j].category == 1) {
            p = p + partWebstats[i][j].viewtime;
         } else if (partWebstats[i][j].category == 0) {
            n = n + partWebstats[i][j].viewtime;
         } else if (partWebstats[i][j].category == -1) {
            d = d + partWebstats[i][j].viewtime;
         }
      }
      p_x_axis.push(p);
      d_x_axis.push(d);
      n_x_axis.push(n);
   }
   console.log("data x axis: ", data_x_axis);
   var productive_data = [];
   var neutral_data = [];
   var distracting_data = [];

   for (let i = 0; i < data_x_axis.length; i++) {
      if (interval_name == "weekly" || interval_name == "yearly") {
         data_x_axis[i] = data_x_axis[i].toString();
      } else {
         data_x_axis[i] = parseInt(data_x_axis[i]);
      }
   }
   for (var i = 0; i < x_axis.length; i++) {
      if (interval_name == "weekly" || interval_name == "yearly") {
         x_axis[i] = x_axis[i].toString();
      } else {
         x_axis[i] = parseInt(x_axis[i]);
      }
   }
   var max = 0;
   for (let i = 0; i < x_axis.length; i++) {
      if (data_x_axis.includes(x_axis[i])) {
         productive_data.push(p_x_axis[data_x_axis.indexOf(x_axis[i])]);
         distracting_data.push(d_x_axis[data_x_axis.indexOf(x_axis[i])]);
         neutral_data.push(n_x_axis[data_x_axis.indexOf(x_axis[i])]);

         if (
            max <
            p_x_axis[data_x_axis.indexOf(x_axis[i])] +
               n_x_axis[data_x_axis.indexOf(x_axis[i])] +
               d_x_axis[data_x_axis.indexOf(x_axis[i])]
         ) {
            max =
               p_x_axis[data_x_axis.indexOf(x_axis[i])] +
               n_x_axis[data_x_axis.indexOf(x_axis[i])] +
               d_x_axis[data_x_axis.indexOf(x_axis[i])];
         }
      } else {
         productive_data.push(0);
         distracting_data.push(0);
         neutral_data.push(0);
      }
   }
   var x_label = "";
   if (interval_name == "daily") {
      x_label = "hours";
   } else if (interval_name == "yearly") {
      x_label = "months";
   } else if (interval_name == "all") {
      x_label = "years";
   } else if (interval_name == "weekly" || "monthly") {
      x_label = "days";
   }

   return (
      <Bar
         data={{
            labels: x_axis,
            datasets: [
               {
                  label: "Productive",
                  data: productive_data,
                  backgroundColor: "blue",
               },
               {
                  label: "Neutral",
                  data: neutral_data,
                  backgroundColor: "#bbbbbb",
               },
               {
                  label: "Distracting",
                  data: distracting_data,
                  backgroundColor: "red",
               },
            ],
         }}
         height={250}
         options={{
            responsive: false,
            // Can't just just `stacked: true` like the docs say
            scales: {
               xAxes: [
                  {
                     stacked: true,
                     barPercentage: 0.5,
                     scaleLabel: {
                        display: true,
                        labelString: x_label,
                        fontSize: "14",
                     },
                     gridLines: {
                        display: false,
                     },
                     ticks: {
                        maxRotation: 40,
                     },
                  },
               ],
               yAxes: [
                  {
                     stacked: true,
                     ticks: {
                        stepSize: Math.ceil(max / 9),
                     },
                     scaleLabel: {
                        display: true,
                        labelString: "seconds",
                        fontSize: "14",
                     },
                     gridLines: {
                        display: false,
                     },
                  },
               ],
            },
         }}
      />
   );
};

function getXAxis(interval_name, interval_value) {
   var x_axis = [];
   if (interval_name == "monthly") {
      if (interval_value != null) {
         var date = interval_value.split("-");

         if (
            date[0] == new Date().getMonth() + 1 &&
            date[1] == new Date().getFullYear()
         ) {
            var days = new Date().getDate();
            for (var i = 1; i <= days; i++) {
               x_axis.push(i);
            }
         } else {
            var days = new Date(date[1], date[0], 0).getDate();
            for (var i = 1; i <= days; i++) {
               x_axis.push(i);
            }
         }
      } else {
         var days = new Date().getDate();
         for (var i = 1; i <= days; i++) {
            x_axis.push(i);
         }
      }
   } else if (interval_name == "daily") {
      var d = new Date();
      if (interval_value != null) {
         if (
            interval_value.split("-")[0] == d.getDate() &&
            interval_value.split("-")[1] == d.getMonth() + 1 &&
            interval_value.split("-")[2] == d.getFullYear()
         ) {
            for (var i = 0; i <= d.getHours() + 1; i++) {
               x_axis.push(i);
            }
         } else {
            for (var i = 0; i <= 24; i++) {
               x_axis.push(i);
            }
         }
      } else {
         for (var i = 0; i <= d.getHours() + 1; i++) {
            x_axis.push(i);
         }
      }
   } else if (interval_name == "weekly") {
      var d = new Date().getDay();
      for (var i = d + 1; i <= 6; i++) {
         x_axis.push(d_name[i]);
      }
      for (i = 0; i <= d; i++) {
         x_axis.push(d_name[i]);
      }
   } else if (interval_name == "yearly") {
      if (interval_value == null) {
         var m = new Date().getMonth();

         for (var i = 0; i <= m; i++) {
            x_axis.push(monthNames[i]);
         }
      } else {
         if (interval_value == new Date().getFullYear()) {
            var m = new Date().getMonth();

            for (var i = 0; i <= m; i++) {
               x_axis.push(monthNames[i]);
            }
         } else {
            for (var i = 0; i < monthNames.length; i++) {
               x_axis.push(monthNames[i]);
            }
         }
      }
   } else if (interval_name == "all") {
      var d = new Date().getFullYear();
      for (var i = 2019; i <= d; i++) {
         x_axis.push(i);
      }
   }
   return x_axis;
}

export default StackedChart;
