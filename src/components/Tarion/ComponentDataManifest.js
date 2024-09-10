import ComponentPieChart from "@/components/charts/ComponentPieChart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import ComponentHorizontalBarChart from "@/components/charts/ComponentHorizontalBarChart";
import userContext from "@/context/userContext";
import {
  chartBackgroundColorsList,
  chartBackgroundColorsListOpacity40,
  formatNumber,
  getNewDateRange,
  getPercentageDifference,
  getAverageLogsPerDay,
  getAverageLogsPerMinuts,
  getAverageLogsPerSeconds, getPercentage
} from "@/Utilities/Utilities"

const ComponentDataManifest = (props) => {

  //get user context data
  const userDataContext = useContext(userContext)
  //get userContext data to get customerId
  const customerId = userDataContext.selectedCustomer.length > 0 ? userDataContext.selectedCustomer[0].customerId : null
  const reportStartDate = userDataContext.reportStartDate ? userDataContext.reportStartDate : null
  const reportEndDate = userDataContext.reportEndDate ? userDataContext.reportEndDate : null

  const initialValues = {
    total_customer_firewall_subscriptions_count: 0,
    total_customer_server_subscriptions_count: 0,
    total_customer_edr_subscriptions_count: 0,
    total_customer_nac_subscriptions_count: 0,
    total_customer_firewall_log_ingestion_count: 0,
    total_customer_server_log_ingestion_count: 0,
    total_customer_edr_log_ingestion_count: 0,
    total_customer_nac_log_ingestion_count: 0,
    total_customer_firewall_log_ingestion_count_average_day: 0,
    total_customer_server_log_ingestion_count_average_day: 0,
    total_customer_edr_log_ingestion_count_average_day: 0,
    total_customer_nac_log_ingestion_count_average_day: 0,
    total_customer_firewall_log_ingestion_count_average_minute: 0,
    total_customer_server_log_ingestion_count_average_minute: 0,
    total_customer_edr_log_ingestion_count_average_minute: 0,
    total_customer_nac_log_ingestion_count_average_minute: 0,
    total_customer_firewall_log_ingestion_count_average_second: 0,
    total_customer_server_log_ingestion_count_average_second: 0,
    total_customer_edr_log_ingestion_count_average_second: 0,
    total_customer_nac_log_ingestion_count_average_second: 0,
    total_customer_firewall_log_ingestion_count_percentage:0,
    total_customer_server_log_ingestion_count_percentage:0,
    total_customer_edr_log_ingestion_count_percentage:0,
    total_customer_nac_log_ingestion_count_percentage:0,
  }

  const logCountInitialValues = {logCount:0}

  const [dataManifestData,setDataManifestData] = useState(initialValues)
  const [totalLogCount,setTotalLogCount] = useState(logCountInitialValues)


  //get unique Firewalls count for a customer
  const getUniqueFirewallCount = () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallCount', {
      params:
        {
          customerId: customerId,
        }
    })
      .then(response => {
        setDataManifestData(prevState => {
          return {...prevState, total_customer_firewall_subscriptions_count: response.data[0].clientfirewallcount}
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get unique Endpoint count for a customer
  const getUniqueServerCount = () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/endpoint/getEndpointCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }})
      .then(response => {
        setDataManifestData(prevState => {return{...prevState,total_customer_server_subscriptions_count: response.data[0].hostcount}})
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get unique EDR count for a customer
  const getUniqueEDRCount = () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/edr/getEDRCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        setDataManifestData(prevState => {return{...prevState,total_customer_edr_subscriptions_count:response.data[0].clientedrcount}})
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get unique NAC count for a customer
  const getUniqueNACCount = () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/nac/getNACCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        setDataManifestData(prevState => {return{...prevState,total_customer_nac_subscriptions_count:response.data[0].clientnaccount}})
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get count of total logs ingested by customer Firewalls
  const getFirewallTotalLogIngestion = () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallTotalLogCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        setDataManifestData(prevState => {return{...prevState,total_customer_firewall_log_ingestion_count: response.data[0].logcount}})
        setTotalLogCount(prevState => {return{...prevState,logCount:parseInt(prevState.logCount)+parseInt(response.data[0].logcount)}})

        getAverageLogsPerDay(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          setDataManifestData(prevState => {return{...prevState,total_customer_firewall_log_ingestion_count_average_day: result}})
        })

        getAverageLogsPerMinuts(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          setDataManifestData(prevState => {return{...prevState,total_customer_firewall_log_ingestion_count_average_minute: result}})
        })

        getAverageLogsPerSeconds(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          setDataManifestData(prevState => {return{...prevState,total_customer_firewall_log_ingestion_count_average_second: result}})
        })

      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get count of total logs ingested by customer Endpoints
  const getServerTotalLogIngestion = () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/endpoint/getEndpointTotalLogCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        setDataManifestData(prevState => {return{...prevState,total_customer_server_log_ingestion_count: response.data[0].logcount}})
        setTotalLogCount(prevState => {return{...prevState,logCount:parseInt(prevState.logCount)+parseInt(response.data[0].logcount)}})

        getAverageLogsPerDay(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          setDataManifestData(prevState => {return{...prevState,total_customer_server_log_ingestion_count_average_day: result}})
        })

        getAverageLogsPerMinuts(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          setDataManifestData(prevState => {return{...prevState,total_customer_server_log_ingestion_count_average_minute: result}})
        })

        getAverageLogsPerSeconds(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          setDataManifestData(prevState => {return{...prevState,total_customer_server_log_ingestion_count_average_second: result}})
        })

      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get count of total logs ingested by customer EDR
  const getEDRTotalLogIngestion = () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/edr/getEDRLogcount', {
      params: {
        customerId: customerId,
        startDate:reportStartDate,
        endDate:reportEndDate
      }})
      .then(response => {
        setDataManifestData(prevState => {return{...prevState,total_customer_edr_log_ingestion_count:response.data[0].logcount}})
        setTotalLogCount(prevState => {return{...prevState,logCount:parseInt(prevState.logCount)+parseInt(response.data[0].logcount)}})

        getAverageLogsPerDay(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          setDataManifestData(prevState => {return{...prevState,total_customer_edr_log_ingestion_count_average_day: result}})
        })

        getAverageLogsPerMinuts(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          console.log(result)
          setDataManifestData(prevState => {return{...prevState,total_customer_edr_log_ingestion_count_average_minute: result}})
        })

        getAverageLogsPerSeconds(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          setDataManifestData(prevState => {return{...prevState,total_customer_edr_log_ingestion_count_average_second: result}})
        })

      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get count of total logs ingested by customer NAC
  const getNACTotalLogIngestion = () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/nac/getNACLogIngestionCount', {
      params: {
        customerId: customerId,
        startDate:reportStartDate,
        endDate:reportEndDate
      }
    })
      .then(response => {
        setDataManifestData(prevState => {return{...prevState,total_customer_nac_log_ingestion_count:response.data[0].logcount}})
        setTotalLogCount(prevState => {return{...prevState,logCount:parseInt(prevState.logCount)+parseInt(response.data[0].logcount)}})

        getAverageLogsPerDay(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          setDataManifestData(prevState => {return{...prevState,total_customer_nac_log_ingestion_count_average_day: result}})
        })

        getAverageLogsPerMinuts(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          setDataManifestData(prevState => {return{...prevState,total_customer_nac_log_ingestion_count_average_minute: result}})
        })

        getAverageLogsPerSeconds(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          setDataManifestData(prevState => {return{...prevState,total_customer_nac_log_ingestion_count_average_second: result}})
        })

      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    setDataManifestData(initialValues)
    setTotalLogCount(logCountInitialValues)

    getUniqueFirewallCount()
    getUniqueServerCount()
    getUniqueEDRCount()
    getUniqueNACCount()
    getFirewallTotalLogIngestion()
    getServerTotalLogIngestion()
    getEDRTotalLogIngestion()
    getNACTotalLogIngestion()

  }, [])


  useEffect(() => {

    let firewallLogPercentage = getPercentage(dataManifestData.total_customer_firewall_log_ingestion_count,totalLogCount.logCount)
    let ednpointLogPercentage = getPercentage(dataManifestData.total_customer_server_log_ingestion_count,totalLogCount.logCount)
    let edrLogPercentage = getPercentage(dataManifestData.total_customer_edr_log_ingestion_count,totalLogCount.logCount)
    let nacLogPercentage = getPercentage(dataManifestData.total_customer_nac_log_ingestion_count,totalLogCount.logCount)

    setDataManifestData(prevState=>{return{...prevState,total_customer_firewall_log_ingestion_count_percentage: firewallLogPercentage}})
    setDataManifestData(prevState=>{return{...prevState,total_customer_server_log_ingestion_count_percentage: ednpointLogPercentage}})
    setDataManifestData(prevState=>{return{...prevState,total_customer_edr_log_ingestion_count_percentage: edrLogPercentage}})
    setDataManifestData(prevState=>{return{...prevState,total_customer_nuc_log_ingestion_count_percentage: nacLogPercentage}})

  }, [totalLogCount]);

  return (
    <div className="w-full h-full">
      <div className="w-full h-full grid grid-cols-12 grid-rows-16 gap-2">
        <div className="col-span-12 row-span-2 flex">
          <div className="h-full w-2/12">
            <div className="w-full h-full bg-logo bg-contain bg-center bg-no-repeat">
            </div>
          </div>
          <div className="h-full w-10/12">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-2/3 flex-col">
                <h1 className="w-full text-4xl text-white text-right pr-5 border-b-gray-400 uppercase border-b">
                  Data Manifest
                </h1>
                <h2 className="w-full h-1/3 text-sm text-white text-right pr-5 border-b-gray-400">
                  {reportStartDate} - {reportEndDate}
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3 row-span-14 grid grid-cols-12 grid-rows-12 gap-2">
          <div className="col-span-12 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">
                    {dataManifestData.total_customer_firewall_subscriptions_count ? dataManifestData.total_customer_firewall_subscriptions_count : 0}
                  </h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Firewall</b> Subscriptions</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex-col items-center justify-center">
                      <div className="h-1/2 w-full border-b border-b-white flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(dataManifestData.total_customer_firewall_log_ingestion_count_average_day)} logs/d</h1>
                      </div>
                      <div className="h-1/2 w-full flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(dataManifestData.total_customer_firewall_log_ingestion_count_average_minute)} logs/m</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">
                    {dataManifestData.total_customer_server_subscriptions_count ? dataManifestData.total_customer_server_subscriptions_count : 0}
                  </h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Server</b> Subscriptions</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex-col items-center justify-center">
                      <div className="h-1/2 w-full border-b border-b-white flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(dataManifestData.total_customer_server_log_ingestion_count_average_day)} logs/d</h1>
                      </div>
                      <div className="h-1/2 w-full flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(dataManifestData.total_customer_server_log_ingestion_count_average_minute)} logs/m</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">
                    {dataManifestData.total_customer_edr_subscriptions_count ? dataManifestData.total_customer_edr_subscriptions_count : 0}
                  </h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>EDR</b> Subscriptions</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex-col items-center justify-center">
                      <div className="h-1/2 w-full border-b border-b-white flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(dataManifestData.total_customer_edr_log_ingestion_count_average_day)} logs/d</h1>
                      </div>
                      <div className="h-1/2 w-full flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(dataManifestData.total_customer_edr_log_ingestion_count_average_minute)} logs/m</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">
                    {dataManifestData.total_customer_nac_subscriptions_count ? dataManifestData.total_customer_nac_subscriptions_count : 0}
                  </h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Network Access Control</b> Subscriptions</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex-col items-center justify-center">
                      <div className="h-1/2 w-full border-b border-b-white flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(dataManifestData.total_customer_nac_log_ingestion_count_average_day)} logs/d</h1>
                      </div>
                      <div className="h-1/2 w-full flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(dataManifestData.total_customer_nac_log_ingestion_count_average_minute)} logs/m</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*<div className="col-span-12 row-span-1 px-1">*/}
          {/*  <div*/}
          {/*    className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black flex items-center justify-center">*/}
          {/*    <h1 className="text-xl text-yellow-500 font-bold">SIEM Performance Matrix</h1>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div className="col-span-6 row-span-2 px-1">*/}
          {/*  <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">*/}
          {/*    <div className="w-full h-full flex">*/}
          {/*      <div className="w-1/3 h-full flex items-center justify-center">*/}
          {/*        <h1 className="text-2xl text-yellow-500 font-bold">11.5</h1>*/}
          {/*      </div>*/}
          {/*      <div className="w-2/3 h-full flex-col">*/}
          {/*        <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">*/}
          {/*          <h2 className="text-xl text-white"><b>MTTD</b></h2>*/}
          {/*        </div>*/}
          {/*        <div className="w-full h-1/2 flex items-center">*/}
          {/*          <div className="w-1/2 h-full flex items-center justify-center">*/}
          {/*            <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretUp}/>*/}
          {/*            <h1 className="text-sm text-white">19.4 %</h1>*/}
          {/*          </div>*/}
          {/*          <div className="w-1/2 h-full flex items-center justify-center">*/}
          {/*            <h1 className="text-sm text-white">{new Intl.NumberFormat('en', {*/}
          {/*              notation: 'compact',*/}
          {/*              minimumFractionDigits: 2,*/}
          {/*              maximumFractionDigits: 2*/}
          {/*            }).format(8993.57)} logs/m</h1>*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div className="col-span-6 row-span-2 px-1">*/}
          {/*  <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">*/}
          {/*    <div className="w-full h-full flex">*/}
          {/*      <div className="w-1/3 h-full flex items-center justify-center">*/}
          {/*        <h1 className="text-2xl text-yellow-500 font-bold">&lt; 200</h1>*/}
          {/*      </div>*/}
          {/*      <div className="w-2/3 h-full flex-col">*/}
          {/*        <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">*/}
          {/*          <h2 className="text-xl text-white"><b>Query</b> Time</h2>*/}
          {/*        </div>*/}
          {/*        <div className="w-full h-1/2 flex items-center">*/}
          {/*          <div className="w-1/2 h-full flex items-center justify-center">*/}
          {/*            <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretUp}/>*/}
          {/*            <h1 className="text-sm text-white">19.4 %</h1>*/}
          {/*          </div>*/}
          {/*          <div className="w-1/2 h-full flex items-center justify-center">*/}
          {/*            <h1 className="text-sm text-white">{new Intl.NumberFormat('en', {*/}
          {/*              notation: 'compact',*/}
          {/*              minimumFractionDigits: 2,*/}
          {/*              maximumFractionDigits: 2*/}
          {/*            }).format(8993.57)} logs/m</h1>*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
        <div className="col-span-9 row-span-14 grid grid-cols-12 grid-rows-12 gap-2">
          <div className="col-span-12 row-span-14 px-1">
            <div className="w-full h-full grid grid-rows-12 grid-cols-8 gap-2">
              <div className="col-span-4 row-span-12">
                <div className="w-full h-3/6 p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                  <div className="h-1/6 w-full">
                    <h1 className="text-3xl text-white flex items-center justify-center border-b">
                      Log Ingestion Breakdown
                    </h1>
                    <h2 className="text-lg text-white flex items-center justify-center">Total Logs: {formatNumber(totalLogCount.logCount)}</h2>
                  </div>
                  <div className="h-5/6 w-full flex flex-wrap items-center justify-center">
                    <div className="w-2/4 h-2/4 p-2">
                      <div className="w-full h-full bg-white/10 p-2">
                      <div className="text-4xl text-white border-b">
                        <h1>Firewall</h1>
                      </div>
                      <div className="text-white w-full h-full flex items-center justify-center">
                        <h2 className="text-4xl px-1">
                          {formatNumber(dataManifestData.total_customer_firewall_log_ingestion_count)}
                        </h2>
                        <label
                          className="text-sm">( {formatNumber(dataManifestData.total_customer_firewall_log_ingestion_count_percentage)} %
                          )</label>
                      </div>
                      </div>
                    </div>
                    <div className="w-2/4 h-2/4 p-2">
                      <div className="w-full h-full bg-white/10 p-2">
                      <div className="text-4xl text-white border-b">
                        <h1>Endpoint</h1>
                      </div>
                      <div className="text-white w-full h-full flex items-center justify-center">
                        <h2 className="text-4xl px-1">
                          {formatNumber(dataManifestData.total_customer_server_log_ingestion_count)}
                        </h2>
                        <label
                          className="text-sm">( {formatNumber(dataManifestData.total_customer_server_log_ingestion_count_percentage)} %
                          )</label>
                      </div>
                      </div>
                    </div>
                    <div className="w-2/4 h-2/4 p-2">
                      <div className="w-full h-full bg-white/10 p-2">
                      <div className="text-4xl text-white border-b">
                        <h1>EDR</h1>
                      </div>
                      <div className="text-white w-full h-full flex items-center justify-center">
                        <h2 className="text-4xl px-1">
                          {formatNumber(dataManifestData.total_customer_edr_log_ingestion_count)}
                        </h2>
                        <label
                          className="text-sm">( {formatNumber(dataManifestData.total_customer_edr_log_ingestion_count_percentage)} %
                          )</label>
                      </div>
                      </div>
                    </div>
                    <div className="w-2/4 h-2/4 p-2">
                      <div className="w-full h-full bg-white/10 p-2">
                      <div className="text-4xl text-white border-b">
                        <h1>NAC</h1>
                      </div>
                      <div className="text-white w-full h-full flex items-center justify-center">
                        <h2 className="text-4xl px-1">
                          {formatNumber(dataManifestData.total_customer_nac_log_ingestion_count)}
                        </h2>
                        <label
                          className="text-sm">( {formatNumber(dataManifestData.total_customer_nac_log_ingestion_count_percentage)} %
                          )</label>
                      </div>
                      </div>
                    </div>
                    {/*{dataManifestData ?*/}
                    {/*  <ComponentPieChart*/}
                    {/*    labels={['Firewall', 'Endpoint', 'EDR', 'NAC']}*/}
                    {/*    logdata={[*/}
                    {/*      dataManifestData.total_customer_firewall_log_ingestion_count,*/}
                    {/*      dataManifestData.total_customer_server_log_ingestion_count,*/}
                    {/*      dataManifestData.total_customer_edr_log_ingestion_count,*/}
                    {/*      dataManifestData.total_customer_nac_log_ingestion_count,*/}
                    {/*    ]}*/}
                    {/*  />*/}
                    {/*  : ''}*/}
                  </div>
                </div>
                <div className="w-full h-3/6 p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                  <div className="h-1/6 w-full">
                    <h1 className="text-3xl text-white flex items-center justify-center border-b">
                      Average Log Ingestion Rate
                    </h1>
                    <h2 className="text-lg text-white flex items-center justify-center">
                    </h2>
                  </div>
                  <div className="h-5/6 w-full flex flex-wrap items-center justify-center">
                    <div className="w-2/4 h-2/4 p-2">
                      <div className="w-full h-full bg-white/10 p-2">
                        <div className="text-4xl text-white border-b">
                          <h1>Firewall</h1>
                        </div>
                        <div className="text-white w-full h-full flex items-center justify-center">
                          <h2 className="text-4xl px-1">
                            {dataManifestData.total_customer_firewall_log_ingestion_count_average_second}
                          </h2>
                          <label className="text-sm">logs/sec </label>
                        </div>
                      </div>
                    </div>
                    <div className="w-2/4 h-2/4 p-2">
                      <div className="w-full h-full bg-white/10 p-2">
                        <div className="text-4xl text-white border-b">
                          <h1>Endpoint</h1>
                        </div>
                        <div className="text-white w-full h-full flex items-center justify-center">
                          <h2 className="text-4xl px-1">
                            {dataManifestData.total_customer_server_log_ingestion_count_average_second}
                          </h2>
                          <label className="text-sm">logs/sec </label>
                        </div>
                      </div>
                    </div>
                    <div className="w-2/4 h-2/4 p-2">
                      <div className="w-full h-full bg-white/10 p-2">
                        <div className="text-4xl text-white border-b">
                          <h1>EDR</h1>
                        </div>
                        <div className="text-white w-full h-full flex items-center justify-center">
                          <h2 className="text-4xl px-1">
                            {dataManifestData.total_customer_edr_log_ingestion_count_average_second}
                          </h2>
                          <label className="text-sm">logs/sec </label>
                        </div>
                      </div>
                    </div>
                    <div className="w-2/4 h-2/4 p-2">
                      <div className="w-full h-full bg-white/10 p-2">
                        <div className="text-4xl text-white border-b">
                          <h1>NAC</h1>
                        </div>
                        <div className="text-white w-full h-full flex items-center justify-center">
                          <h2 className="text-4xl px-1">
                            {dataManifestData.total_customer_nac_log_ingestion_count_average_second}
                          </h2>
                          <label className="text-sm">logs/sec </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-4 row-span-12">
                <div
                  className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                  <div className="h-1/6 w-full">
                    <h1 className="text-3xl flex items-center justify-center text-white">
                      Average Log Ingestion Rate
                    </h1>
                  </div>
                  <div className="h-5/6 w-full flex items-center justify-center gap-2">
                    {/*<div className="w-1/4 h-24 bg-white/10 p-2">*/}
                    {/*  <div className="text-4xl text-white border-b">*/}
                    {/*    <h1>Firewall</h1>*/}
                    {/*  </div>*/}
                    {/*  <div className="text-white flex">*/}
                    {/*    <h2 className="text-2xl px-1">*/}
                    {/*      {dataManifestData.total_customer_firewall_log_ingestion_count_average_second}*/}
                    {/*    </h2>*/}
                    {/*    <label className="text-sm">logs/sec </label>*/}
                    {/*  </div>*/}
                    {/*</div>*/}
                    {/*<div className="w-1/4 h-24 bg-white/10 p-2">*/}
                    {/*  <div className="text-4xl text-white border-b">*/}
                    {/*    <h1>Endpoint</h1>*/}
                    {/*  </div>*/}
                    {/*  <div className="text-white flex">*/}
                    {/*    <h2 className="text-2xl px-1">*/}
                    {/*      {dataManifestData.total_customer_server_log_ingestion_count_average_second}*/}
                    {/*    </h2>*/}
                    {/*    <label className="text-sm">logs/sec </label>*/}
                    {/*  </div>*/}
                    {/*</div>*/}
                    {/*<div className="w-1/4 h-24 bg-white/10 p-2">*/}
                    {/*  <div className="text-4xl text-white border-b">*/}
                    {/*    <h1>EDR</h1>*/}
                    {/*  </div>*/}
                    {/*  <div className="text-white flex">*/}
                    {/*    <h2 className="text-2xl px-1">*/}
                    {/*      {dataManifestData.total_customer_edr_log_ingestion_count_average_second}*/}
                    {/*    </h2>*/}
                    {/*    <label className="text-sm">logs/sec </label>*/}
                    {/*  </div>*/}
                    {/*</div>*/}
                    {/*<div className="w-1/4 h-24 bg-white/10 p-2">*/}
                    {/*  <div className="text-4xl text-white border-b">*/}
                    {/*    <h1>NAC</h1>*/}
                    {/*  </div>*/}
                    {/*  <div className="text-white flex">*/}
                    {/*    <h2 className="text-2xl px-1">*/}
                    {/*      {dataManifestData.total_customer_nac_log_ingestion_count_average_second}*/}
                    {/*    </h2>*/}
                    {/*    <label className="text-sm">logs/sec </label>*/}
                    {/*  </div>*/}
                    {/*</div>*/}
                    {/*<ComponentHorizontalBarChart*/}
                    {/*  labels={['Firewall', 'Endpoint', 'EDR', 'NAC']}*/}
                    {/*  logdata={[*/}
                    {/*    dataManifestData.total_customer_firewall_log_ingestion_count_average_second,*/}
                    {/*    dataManifestData.total_customer_server_log_ingestion_count_average_second,*/}
                    {/*    dataManifestData.total_customer_edr_log_ingestion_count_average_second,*/}
                    {/*    dataManifestData.total_customer_nac_log_ingestion_count_average_second*/}
                    {/*  ]}/>*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default ComponentDataManifest;