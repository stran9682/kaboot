import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import React from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutDistribution({submittedAnswers}:{submittedAnswers: number[]}) {

    const data = {
        datasets: [{
            data: submittedAnswers,
            backgroundColor: [
                'rgb(72 169 166)',
                'rgb(212 180 131)',
                'rgb(82 72 156)',
                'rgb(8 61 119)',
            ],
            borderWidth: 0,
        }],
    };

    return <Doughnut data={data}/>
}
