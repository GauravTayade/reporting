import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const data = {
  datasets: [
    {
      label: 'Red dataset',
      data:[
        {x:2,y:4,r:2},
        {x:4,y:5,r:6},
        {x:2,y:2,r:2},
        {x:3,y:5,r:1},
        {x:4,y:5,r:9}
      ],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Blue dataset',
      data:[
        {x:4,y:3,r:4},
        {x:6,y:5,r:6},
        {x:1,y:1,r:2},
        {x:3,y:3,r:8},
        {x:4,y:7,r:2}
      ],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

const ComponentBubbleChart = () => {
  return <Bubble options={options} data={data} />;
}

export default ComponentBubbleChart;
