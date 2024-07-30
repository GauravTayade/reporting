import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js'
import {Bar} from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const data = {
  labels : ['January', 'February', 'March', 'April'],
  datasets : [
    {
      label: 'Dataset 1',
      data: [12,22,21,11],
      backgroundColor: 'rgb(255, 99, 132)',
    },
    {
      label: 'Dataset 2',
      data:[14,18,20,21],
      backgroundColor: 'rgb(75, 192, 192)',
    },
    {
      label: 'Dataset 3',
      data: [4,5,2,9],
      backgroundColor: 'rgb(53, 162, 235)',
    },
  ]
}

const options = {
  plugins:{
    title:{
      display:true,
      text: 'Chart.js Bar Chart - Stacked'
    },
  },
  responsive:true,
  scales:{
    x:{stacked:true},
    y:{stacked: true},
  },
}

const ComponentStackedBarChart = (props) =>{

  return <Bar data={data} options={options}/>

}

export default ComponentStackedBarChart