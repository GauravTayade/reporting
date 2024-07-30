export const formatNumber = function(value) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    minimumFractionDigits:process.env.NEXT_PUBLIC_MINIMUM_FRACTION_DIGITS,
    maximumFractionDigits:process.env.NEXT_PUBLIC_MAXIMUM_FRACTION_DIGITS
  }).format(value)
}

export const getNewDateRange= function (startdate, enddate){

  let newStartDate = 0
  let newEndDate = 0

  if(startdate && enddate){
    let currentStartDate = new Date(startdate)
    let currentEndDate = new Date(enddate)
    let diff = currentEndDate.getDate() - currentStartDate.getDate()
    newStartDate = new Date(currentStartDate.setDate(currentStartDate.getDate() - diff)).toLocaleDateString("en-CA")
    newEndDate = new Date(currentEndDate.setDate(currentEndDate.getDate() - diff)).toLocaleDateString("en-CA")
  }

  return {newStartDate, newEndDate}
}

export const getPercentageDifference = function(currentLogs , previouslogs){
  if(previouslogs <= 0){
    return 100
  }else if(currentLogs <= 0){
    return -100
  }else{
    return (((currentLogs-previouslogs)/previouslogs) * 100).toFixed(2)
  }
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