'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Bar} from "react-chartjs-2"
import {Card} from "@/shared/ui/Card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
  scales: {
    y: {
      border: {
        display: false,
      },
      ticks: {
        display: false,
        count: 5,
      },
      grid: {
        display: false,
      }
    },
    x: {
      border: {
        display: false,
      },
      grid: {
        display: false,
      }
    },
  },
};

const labels = ['월', '화', '수', '목', '금', '토', '일']; //x축 기준

export const data = {
  labels,
  datasets: [
    {
      label: '절약', //그래프 분류되는 항목
      data: [1, 2, 3, 4, 5, 6, 7], //실제 그려지는 데이터(Y축 숫자)
      backgroundColor:  [
        'rgba(32, 182, 132, 0.4)',
        'rgba(32, 182, 132, 0.4)',
        'rgba(32, 182, 132, 0.4)',
        'rgba(32, 182, 132, 0.4)',
        'rgba(32, 182, 132, 0.4)',
        'rgba(32, 182, 132, 0.4)',
        'rgb(32, 182, 132)',
      ], //마우스 호버시 나타나는 분류네모 표시 bg
      borderRadius: 5,
    }
  ],
};

export default function SmokingChart() {
  return (
    <Card className="p-5">
      <p className="font-semibold mb-4">이번 주 절약 금액</p>
      <Bar options={options} data={data} />
    </Card>
  )
}