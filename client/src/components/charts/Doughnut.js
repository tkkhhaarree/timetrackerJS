import { Doughnut } from "react-chartjs-2";
import React, { useState, useEffect } from "react";

const DoughnutChart = props => {
    return (
        <Doughnut
            data={props.doughnutData}
            height={350}
            width={350}
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

export default DoughnutChart;
