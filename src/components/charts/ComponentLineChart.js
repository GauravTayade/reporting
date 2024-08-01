import React from 'react'
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Chart as ChartJS
} from 'chart.js'

import {Bar} from 'react-chartjs-2'

ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip, Legend);

const options = {
  responsive:true,
  plugins:{
    legend:{
      position:'top'
    },
    title:{
      display:true,
      text: 'LOG INGESTION BREAKDOWN'
    }
  }
}

const labels = ['Servers', 'Firewalls', 'EDR', 'NAC'];

const data = {
  labels,
  datasets:[
    {
      label: 'Ingested Logs',
      data: [10,4,20,14,9,10,2],
      backgroundColor:['rgba(255,9,132,0.5)'],
      borderColor:['rgba(255,99,132,0.8)'],
      borderWidth:1
    }
  ]
}

const ComponentLineChart = (props) =>{
  return <Bar data={data} options={options}/>
}

export default  ComponentLineChart