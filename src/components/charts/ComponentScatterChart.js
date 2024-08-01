import {Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend} from 'chart.js'
import {Scatter} from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

const options ={
  scales:{
    y: {
      beginAtZero: true
    },
  },
};
const data = {
  datasets:[{
    label: 'A Dataset',
    data: [{x:1,y:2}, {x:2,y:2}, {x:3,y:4},{x:4,y:1},{x:4,y:5},{x:9,y:1},{x:1,y:9},{x:10,y:10}],
    backgroundColor: 'rgba(255, 99, 132, 1)',
  }]
}

const ComponentScatterChart = (props) => {

  return(<Scatter data={data} options={options}/> )

}

export default ComponentScatterChart;