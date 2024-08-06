import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import {Pie} from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend)

const options= {
  responsive:true,
  plugins:{
    legend:{
      labels:{
        color:'#fff'
      },
      position:"right",
    }
  }
}

const backgroundColorList =  [
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 205, 86)',
  'rgb(255,165,0)'
]

export default function ComponentPieChart(props){

  const data =  {
    labels: props.labels? props.labels :'',
    datasets:[{
      label:props.valuelabel ? props.valuelabel : '',
      data:props.logdata ? props.logdata : '',
      backgroundColor: props.backGroundColors ? props.backGroundColors : backgroundColorList,
      hoverOffset: 4
    }]
  }

  return(
    <Pie data={data} options={options} />
  )

}