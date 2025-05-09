import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const getRandomColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`);
  }
  return colors;
};

export const ExpenseChart = ({ categories }) => {
  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: getRandomColors(Object.keys(categories).length),
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
};

export const IncomeChart = ({ sources }) => {
  const data = {
    labels: Object.keys(sources),
    datasets: [
      {
        data: Object.values(sources),
        backgroundColor: [
          "#4ade80",
          "#22d3ee",
          "#a78bfa",
          "#fbbf24",
          "#f472b6",
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
};
