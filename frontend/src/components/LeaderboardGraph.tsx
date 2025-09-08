import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  plugins,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { UserInfo } from './LeaderboardComponent';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function Leaderboard({userInfo} : {userInfo : UserInfo[]}) {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                titleFont: { size: 18 },   // tooltip title font size
                bodyFont: { size: 16 },    // tooltip body font size
            },
        },
        scales: {
            x: {
                ticks: {
                font: {
                    size: 40, // x-axis labels
                },
                },
            },
        }
    };

    const labels = userInfo.map(user => user.username);
    const data = {
        labels,
        datasets: [{
            data: userInfo.map(user => user.score),
            backgroundColor:  'rgb(8 61 119)',
        }],
    };

    return <Bar options={options} data={data} />;
}