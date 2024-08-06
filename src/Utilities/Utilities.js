export const formatNumber = function(value) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    minimumFractionDigits:process.env.NEXT_PUBLIC_MINIMUM_FRACTION_DIGITS,
    maximumFractionDigits:process.env.NEXT_PUBLIC_MAXIMUM_FRACTION_DIGITS
  }).format(value)
}

export const formatNumberPercentage = (value)=>{
  return new Intl.NumberFormat('en', {
    minimumFractionDigits:2,
    maximumFractionDigits:3
  }).format(value)
}

export const getNewDateRange= function (startdate, enddate){

  let newStartDate = 0
  let newEndDate = 0

  if(startdate && enddate){
    let currentStartDate = new Date(startdate)
    let currentEndDate = new Date(enddate)
    let diff = Math.abs(currentEndDate - currentStartDate)
    let days = Math.ceil(diff / (1000*60*60*24))
    // newStartDate = currentStartDate.setDate(currentStartDate.getDate() - diff)
    // newEndDate = currentEndDate.setDate(currentEndDate.getDate() - diff)
    // newStartDate = new Date(currentStartDate.setDate(currentStartDate.getDate() - diff)).toLocaleDateString("en-CA")
    // newEndDate = new Date(currentEndDate.setDate(currentEndDate.getDate() - diff)).toLocaleDateString("en-CA")

    newStartDate = new Date(currentStartDate.setDate(currentStartDate.getDate() - days)).toLocaleDateString("en-CA")
    newEndDate = new Date(currentEndDate.setDate(currentEndDate.getDate() - days)).toLocaleDateString("en-CA")
  }

  return {newStartDate, newEndDate}
}

export const getPercentage = (partialValue, totalValue) =>{
  return (100 * partialValue) / totalValue;
}

export const getPercentageDifference = async(currentLogs , previouslogs) =>{
  if (previouslogs === 0 && currentLogs ===0){
    return 0
  }else if(previouslogs <= 0){
    return 100
  }else if(currentLogs <= 0){
    return -100
  }else{
    return (((currentLogs-previouslogs)/previouslogs) * 100).toFixed(2)
  }
}

export const getAverageLogsPerDay = async(startDate,endDate,logsCount)=>{
  let currentStartDate = new Date(startDate)
  let currentEndDate = new Date(endDate)
  let diff = Math.abs(currentEndDate - currentStartDate)
  let days = Math.ceil(diff / (1000*60*60*24))

  return (logsCount/days)

}

export const getAverageLogsPerMinuts = async(startDate,endDate,logsCount)=>{
  let currentStartDate = new Date(startDate)
  let currentEndDate = new Date(endDate)
  let diff = Math.abs(currentEndDate - currentStartDate)
  let minutes = Math.ceil(diff / (1000*60))

  return (logsCount/minutes)
}

export const getAverageLogsPerSeconds = async (startDate,endDate,logsCount)=>{
  let currentStartDate = new Date(startDate)
  let currentEndDate = new Date(endDate)
  let diff = Math.abs(currentEndDate - currentStartDate)
  let seconds = Math.ceil(diff / (1000))

  return Math.ceil(logsCount/seconds)
}

export const backgroundColorListHex = [
  '#CD86CA','#977CE9','#7076E7','#5E9ADA','#3E5495','#A9CC85','#E8C67B','#E89E6F','#D95D63','#944E3E'
]

export const chartBackgroundColorsList = [
  'rgb(205,134,202)',
  'rgb(151,124,233)',
  'rgb(112,118,231)',
  'rgb(94,154,218)',
  'rgb(62,84,149)',
  'rgb(169,204,133)',
  'rgb(232,198,123)',
  'rgb(232,158,111)',
  'rgb(217,93,99)',
  'rgb(148,78,62)'
]

export const chartBackgroundColorsListOpacity20 = [
  'rgb(205,134,202,0.2)',
  'rgb(151,124,233,0.2)',
  'rgb(112,118,231,0.2)',
  'rgb(94,154,218,0.2)',
  'rgb(62,84,149,0.2)',
  'rgb(169,204,133,0.2)',
  'rgb(232,198,123,0.2)',
  'rgb(232,158,111,0.2)',
  'rgb(217,93,99,0.2)',
  'rgb(148,78,62,0.2)'
]

export const chartBackgroundColorsListOpacity40 = [
  'rgb(205,134,202,0.4)',
  'rgb(151,124,233,0.4)',
  'rgb(112,118,231,0.4)',
  'rgb(94,154,218,0.4)',
  'rgb(62,84,149,0.4)',
  'rgb(169,204,133,0.4)',
  'rgb(232,198,123,0.4)',
  'rgb(232,158,111,0.4)',
  'rgb(217,93,99,0.4)',
  'rgb(148,78,62,0.4)'
]