import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);

export const options = {
  responsive: true,
  indexAxis: 'y',
  elements:{
    bar:{borderWidth:2}
  },
  scales:{
    x:{
      ticks:{
        color:"#fff"
      }
    },
    y:{
      ticks:{
        color:"#fff"
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        color:'#fff'
      },
      position: 'top',
    },
    title: {
      display: false,
      color: '#fff',
      text: 'Chart.js Bar Chart',
    },
  },
};

const ComponentHorizontalBarChart = (props) => {

  const data = {
    labels:props.labels?props.labels : '',
    datasets: [
      {
        label: 'Average Log Ingestion',
        data: props.logdata ? props.logdata : [10,15,-20,24,34],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
      // {
      //   label: 'Dataset 2',
      //   data: [12,10,34,28,5],
      //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
      // },
    ],
  };
  return <Bar options={options} data={data} />;
}

export default ComponentHorizontalBarChart;
