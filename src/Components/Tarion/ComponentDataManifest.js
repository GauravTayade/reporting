import ComponentPieChart from "@/Components/charts/ComponentPieChart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import ComponentHorizontalBarChart from "@/Components/charts/ComponentHorizontalBarChart";
import userContext from "@/context/userContext";
import {
  chartBackgroundColorsList,
  chartBackgroundColorsListOpacity40,
  formatNumber, getNewDateRange, getPercentageDifference
} from "@/Utilities/Utilities"

const ComponentDataManifest = (props) => {

  const userDataContext = useContext(userContext)
  const customerId = userDataContext.selectedCustomer ? userDataContext.selectedCustomer[0].customerId : null
  const reportStartDate = userDataContext.selectedCustomer ? userDataContext.selectedCustomer[0].reportStartDate : null
  const reportEndDate = userDataContext.selectedCustomer ? userDataContext.selectedCustomer[0].reportEndDate : null

  const [result, setResult] = useState({})
  let data = {
    total_firewall_subscriptions_count: 0,   //firewall/getFirewallCount
    total_server_subscriptions_count: 0,  //endpoint/getEndpointCount
    total_edr_subscriptions_count: 0, //edr/getEDRCount
    total_nac_subscriptions_count: 0,  //nac/getNACCount
    total_firewall_log_ingestion_count: 0, //firewall/getFirewallTotalLogCount
    total_server_log_ingestion_count: 0, //endpoint/getEndpointTotalLogCount
    total_edr_log_ingestion_count: 0, //edr/getEDRLogcount
    total_nac_log_ingestion_count: 0, //nac/getNACLogIngestionCount
    average_firewall_log_ingestion_count: 0, //find-total-target-usernames-count
    average_server_log_ingestion_count: 0, //find-total-registry-changes-count
    average_edr_log_ingestion_count: 0, //find-total-service-creation-count
    average_nac_log_ingestion_count: 0//find-total-process-creation-count
  }


  //get unique Firewalls count for a customer
  const getUniqueFirewallCount = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallCount', {
      params:
        {
          customerId: customerId,
        }
    })
      .then(response => {
        data.total_firewall_subscriptions_count = response.data[0].clientfirewallcount
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get unique Endpoint count for a customer
  const getUniqueServerCount = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/endpoint/getEndpointCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }})
      .then(response => {
        data.total_server_subscriptions_count = response.data[0].hostcount
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get unique EDR count for a customer
  const getUniqueEDRCount = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/edr/getEDRCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        console.log('deijoijis', response.data)
        data.total_edr_subscriptions_count = response.data[0].clientedrcount
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get unique NAC count for a customer
  const getUniqueNACCount = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/nac/getNACCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        data.total_nac_subscriptions_count = response.data[0].clientnaccount
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get count of total logs ingested by customer Firewalls
  const getFirewallTotalLogIngestion = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallTotalLogCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        data.total_firewall_log_ingestion_count = response.data[0].logcount
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get count of total logs ingested by customer Endpoints
  const getServerTotalLogIngestion = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/endpoint/getEndpointTotalLogCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        data.total_server_log_ingestion_count = response.data[0].logcount
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get count of total logs ingested by customer EDR
  const getEDRTotalLogIngestion = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/edr/getEDRLogcount', {
      params: {
        customerId: customerId,
        startDate:reportStartDate,
        endDate:reportEndDate
      }})
      .then(response => {
        data.total_edr_log_ingestion_count = response.data[0].logcount
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get count of total logs ingested by customer NAC
  const getNACTotalLogIngestion = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/nac/getNACLogIngestionCount', {
      params: {
        customerId: customerId,
        startDate:reportStartDate,
        endDate:reportEndDate
      }
    })
      .then(response => {
        data.total_nac_log_ingestion_count = response.data[0].logcount
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    Promise.all([
      getUniqueFirewallCount(),
      getUniqueServerCount(),
      getUniqueEDRCount(),
      getUniqueNACCount(),
      getFirewallTotalLogIngestion(),
      getServerTotalLogIngestion(),
      getEDRTotalLogIngestion(),
      getNACTotalLogIngestion(),
    ]).then(() => {
      setResult(data)
    })

  }, [])

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
              <h1
                className="w-full text-4xl text-white text-right pr-5 border-b-gray-400 border-b-2 uppercase">Data
                Manifest</h1>
            </div>
          </div>
        </div>
        <div className="col-span-3 row-span-14 grid grid-cols-12 grid-rows-12 gap-2">
          <div className="col-span-12 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">
                    {result.total_firewall_subscriptions_count}
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
                      <div className="h-1/2 w-full border-b-2 border-b-white flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(result.total_firewall_log_ingestion_count / 30)} logs/d</h1>
                      </div>
                      <div className="h-1/2 w-full flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(result.total_firewall_log_ingestion_count / 43200)} logs/m</h1>
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
                    {result.total_server_subscriptions_count}
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
                      <div className="h-1/2 w-full border-b-2 border-b-white flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(result.total_server_log_ingestion_count / 30)} logs/d</h1>
                      </div>
                      <div className="h-1/2 w-full flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(result.total_server_log_ingestion_count / 43200)} logs/m</h1>
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
                    {result.total_edr_subscriptions_count}
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
                      <div className="h-1/2 w-full border-b-2 border-b-white flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(result.total_edr_log_ingestion_count / 30)} logs/d</h1>
                      </div>
                      <div className="h-1/2 w-full flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(result.total_edr_log_ingestion_count / 43200)} logs/m</h1>
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
                    {result.total_nac_subscriptions_count}
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
                      <div className="h-1/2 w-full border-b-2 border-b-white flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(result.total_nac_log_ingestion_count / 30)} logs/d</h1>
                      </div>
                      <div className="h-1/2 w-full flex items-center justify-end px-2">
                        <h1
                          className="text-sm text-white">{formatNumber(result.total_nac_log_ingestion_count / 43200)} logs/m</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 row-span-1 px-1">
            <div
              className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black flex items-center justify-center">
              <h1 className="text-xl text-yellow-500 font-bold">SIEM Performance Matrix</h1>
            </div>
          </div>
          <div className="col-span-6 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-2xl text-yellow-500 font-bold">11.5</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>MTTD</b></h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                      <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretUp}/>
                      <h1 className="text-sm text-white">19.4 %</h1>
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      <h1 className="text-sm text-white">{new Intl.NumberFormat('en', {
                        notation: 'compact',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }).format(8993.57)} logs/m</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-6 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-2xl text-yellow-500 font-bold">&lt; 200</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Query</b> Time</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                      <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretUp}/>
                      <h1 className="text-sm text-white">19.4 %</h1>
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      <h1 className="text-sm text-white">{new Intl.NumberFormat('en', {
                        notation: 'compact',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }).format(8993.57)} logs/m</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-9 row-span-14 grid grid-cols-12 grid-rows-12 gap-2">
          <div className="col-span-12 row-span-14 px-1">
            <div className="w-full h-full grid grid-rows-12 grid-cols-8 gap-2">
              <div className="col-span-4 row-span-9">
                <div
                  className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                  <div className="h-1/6 w-full">
                    <h1 className="text-3xl flex items-center justify-center text-white">
                      Log Ingestion Breakdown
                    </h1>
                  </div>
                  <div className="h-5/6 w-full flex items-center justify-center">
                    {result ?
                      <ComponentPieChart
                        labels={['Firewall', 'Endpoint', 'EDR', 'NAC']}
                        logdata={[
                          result.total_firewall_log_ingestion_count,
                          result.total_server_log_ingestion_count,
                          result.total_edr_log_ingestion_count,
                          result.total_nac_log_ingestion_count
                        ]}
                      />
                      : ''}
                  </div>
                </div>
              </div>
              <div className="col-span-4 row-span-9">
                <div
                  className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                  <div className="h-1/6 w-full">
                    <h1 className="text-3xl flex items-center justify-center text-white">
                      Average Log Ingestion Rate
                    </h1>
                  </div>
                  <div className="h-5/6 w-full flex items-center justify-center">
                    <ComponentHorizontalBarChart
                      labels={['Firewall', 'Endpoint', 'EDR', 'NAC']}
                      logdata={[
                        (result.total_firewall_log_ingestion_count / 2592000),
                        (result.total_server_log_ingestion_count / 2592000),
                        (result.total_edr_log_ingestion_count / 2592000),
                        (result.total_nac_log_ingestion_count / 2592000)
                      ]}/>
                  </div>
                </div>
              </div>
              <div className="col-span-8 row-span-3">
                <div className="w-full h-full flex">
                  <div className="w-3/12 p-2 text-white">
                    <div className="w-full h-full bg-white bg-opacity-5 rounded-lg">
                      <div className="w-full h-12 flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-red-700 uppercase">Data Reservoir</h1>
                      </div>
                      <div className="w-full h-20 flex">
                        <div className="w-1/2 h-20 flex items-center justify-center">
                          <h1 className="text-3xl font-bold">Total</h1>
                        </div>
                        <div className="w-1/2 h-20 flex items-center justify-center">
                          <h1 className="text-3xl font-bold">8.25 TB</h1>
                        </div>
                      </div>

                    </div>
                  </div>
                  <div className="w-3/12 p-2 text-white">
                    <div className="w-full h-full bg-white bg-opacity-5 rounded-lg">
                      <div className="w-full h-12 flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-red-700 uppercase">Hot Node</h1>
                      </div>
                      <div className="w-full h-20 flex">
                        <div className="w-1/2 h-20 flex items-center justify-center">
                          <h1 className="text-3xl font-bold">8 days</h1>
                        </div>
                        <div className="w-1/2 h-20 flex items-center justify-center">
                          <h1 className="text-3xl font-bold">3.65 TB</h1>
                        </div>
                      </div>

                    </div>
                  </div>
                  <div className="w-3/12 p-2 text-white">
                    <div className="w-full h-full bg-white bg-opacity-5 rounded-lg">
                      <div className="w-full h-12 flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-yellow-500">Warm Node</h1>
                      </div>
                      <div className="w-full h-20 flex">
                        <div className="w-1/2 h-20 flex items-center justify-center">
                          <h1 className="text-3xl font-bold">32 days</h1>
                        </div>
                        <div className="w-1/2 h-20 flex items-center justify-center">
                          <h1 className="text-3xl font-bold">2.15 TB</h1>
                        </div>
                      </div>

                    </div>
                  </div>
                  <div className="w-3/12 p-2 text-white">
                    <div className="w-full h-full bg-white bg-opacity-5 rounded-lg">
                      <div className="w-full h-12 flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-blue-700">Frozen Node</h1>
                      </div>
                      <div className="w-full h-20 flex">
                        <div className="w-1/2 h-20 flex items-center justify-center">
                          <h1 className="text-3xl font-bold">32 days</h1>
                        </div>
                        <div className="w-1/2 h-20 flex items-center justify-center">
                          <h1 className="text-3xl font-bold">2.43 TB</h1>
                        </div>
                      </div>

                    </div>
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