import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend} from 'chart.js'
import {Line} from 'react-chartjs-2'

ChartJS.register(CategoryScale,LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const options = {
  responsive:true,
  plugins:{
    legend:{
      position:'top'
    },
    title:{
      display: true,
      text:'Chart.js Line Chart'
    }
  }
}

const data = {
  labels:['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      fill: true,
      label: 'Dataset 2',
      data: [12,45,32,12,20,3,7],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

const ComponentAreaChart = (props) =>{

  return <Line data={data} options={options}/>

}

export default ComponentAreaChart