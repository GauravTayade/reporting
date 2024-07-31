import ComponentPieChart from "@/Components/charts/ComponentPieChart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretUp,faCaretDown} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import userContext from "@/context/userContext";
import {
  chartBackgroundColorsListOpacity20,
  chartBackgroundColorsList,
  chartBackgroundColorsListOpacity40,
  formatNumber,
  getPercentageDifference,
  getNewDateRange
} from '@/Utilities/Utilities'

const ComponentAnalyzingGateway = (props) => {

  //get user context data
  const userDataContext = useContext(userContext)
  const customerId = userDataContext.selectedCustomer ? userDataContext.selectedCustomer[0].customerId : null
  const reportStartDate = userDataContext.selectedCustomer ? userDataContext.selectedCustomer[0].reportStartDate : null
  const reportEndDate = userDataContext.selectedCustomer ? userDataContext.selectedCustomer[0].reportEndDate : null

  //useState variables to store state data
  const [result, setResult] = useState({})
  const [pieActiveBlades, setPieActiveBlades] = useState()
  const [pieActiveBladesCount, setPieActiveBladesCount] = useState()
  const [pieExternalThreats, setPieExternalThreats] = useState()
  const [pieExternalThreatsCount, setPieExternalThreatsCount] = useState()
  const [ipsHitsAnalysis, setIPsHitsAnalysis] = useState([])

  //initial values of variables
  let data = {
    total_firewall_subscriptions_count: 0,   //firewall/getFirewallSubscriptionCount
    total_firewall_log_ingestion_count: 0, //firewall/getFirewallTotalLogCount
    total_firewall_allowed_traffic_count: 0, //firewall/getFirewallAllowedTrafficCount
    total_firewall_denied_traffic_count: 0, //firewall/getFirewallDeniedTrafficCount
    total_firewall_ips_traffic_count: 0, //firewall/getFirewallIPSTrafficCount
    total_firewall_admin_activities_log_count: 0, //firewall/getFirewallAdminActivitiesLogCount
    total_firewall_active_blade_count: 0, //firewall/getFirewallActiveBladeCount
    total_firewall_threats_count: 0, //firewall/getTopExternalThreat
    total_ips_hits_analysis: 0,
    total_top_active_threats: [],
    active_blades: [],
    active_blades_count: [],
    top_external_threats: [],
    top_external_threats_count: [],
    top_ips_hits_analysis: [],
    top_external_threats_data:[]
  }

  const getFirewallSubscriptionCount = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallCount', {
      params: {
        customerId: customerId,
        interval: 30
      }
    })
      .then(response => {
        data.total_firewall_subscriptions_count = response.data[0].clientfirewallcount
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getFirewallTotalLogIngestion = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallTotalLogCount', {
      params: {
        customerId: customerId,
        interval: 30,
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

    //calculate new date range based on current date range difference.
    const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)
    //get previous month log count
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallTotalLogCount', {
      params: {
        customerId: customerId,
        interval: 30,
        startDate: prevDateRange.newStartDate,
        endDate: prevDateRange.newEndDate
      }
    })
      .then(response => {
        //get percentage diff and set it to result
        data.total_firewall_log_ingestion_count_diff_percentage = getPercentageDifference(data.total_firewall_log_ingestion_count,response.data[0].logcount)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getFirewallTotalAllowedLogIngestion = async () => {

    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getClientFirewallList", {
      params: {
        customerId: customerId
      }
    })
      .then(async (response) => {
        let firewallList = new Set()
        if (response.data) {
          response.data.map(async (firewall) => {
            await firewallList.add(firewall.id);
          })
        }
        firewallList = [...firewallList].join(",")
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallAllowedTrafficCount', {
          params: {
            firewallId: firewallList,
            interval: 30,
            startDate: reportStartDate,
            endDate: reportEndDate
          }
        })
          .then(response => {
            data.total_firewall_allowed_traffic_count = response.data[0].allowedtraffic
          })
          .catch((error) => {
            console.log(error)
          })

        //calculate new date range based on current date range difference.
        const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

        //get previous month log count
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallAllowedTrafficCount', {
          params: {
            firewallId: firewallList,
            interval: 30,
            startDate: prevDateRange.newStartDate,
            endDate: prevDateRange.newEndDate
          }
        })
          .then(response => {
            //get percentage diff and set it to result
            data.total_firewall_allowed_traffic_count_diff_percentage = getPercentageDifference(data.total_firewall_allowed_traffic_count,response.data[0].allowedtraffic)
          })
          .catch((error) => {
            console.log(error)
          })
      })
  }

  const getFirewallTotalDeniedLogIngestion = async () => {

    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getClientFirewallList", {
      params: {
        customerId: customerId
      }
    })
      .then(async (response) => {
        let firewallList = new Set()
        if (response.data) {
          response.data.map(async (firewall) => {
            await firewallList.add(firewall.id);
          })
        }
        firewallList = [...firewallList].join(",")
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallDeniedTrafficCount', {
          params: {
            firewallId: firewallList,
            interval: 30,
            startDate: reportStartDate,
            endDate: reportEndDate
          }
        })
          .then(response => {
            data.total_firewall_denied_traffic_count = response.data[0].deniedtraffic
          })
          .catch((error) => {
            console.log(error)
          })

        //calculate new date range based on current date range difference.
        const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

        //get previous month log count
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallDeniedTrafficCount', {
          params: {
            firewallId: firewallList,
            interval: 30,
            startDate: prevDateRange.newStartDate,
            endDate: prevDateRange.newEndDate
          }
        })
          .then(response => {
            console.log(response.data)
            //get percentage diff and set it to result
            data.total_firewall_denied_traffic_count_diff_percentage = getPercentageDifference(data.total_firewall_denied_traffic_count,response.data[0].deniedtraffic)
          })
          .catch((error) => {
            console.log(error)
          })

      })
  }

  const getFirewallTotalIPSTrafficLogIngestion = async () => {

    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getClientFirewallList", {
      params: {
        customerId: customerId
      }
    })
      .then(async (response) => {
        let firewallList = new Set()
        if (response.data) {
          response.data.map(async (firewall) => {
            await firewallList.add(firewall.id);
          })
        }
        firewallList = [...firewallList].join(",")
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallIPSTrafficCount', {
          params: {
            firewallId: firewallList,
            interval: 30,
            startDate: reportStartDate,
            endDate: reportEndDate
          }
        })
          .then(response => {
            data.total_firewall_ips_traffic_count = response.data[0].ipstrafficcount
          })
          .catch((error) => {
            console.log(error)
          })

        //calculate new date range based on current date range difference.
        const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

        //get previous month log count
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallIPSTrafficCount', {
          params: {
            firewallId: firewallList,
            interval: 30,
            startDate: prevDateRange.newStartDate,
            endDate: prevDateRange.newEndDate
          }
        })
          .then(response => {
            //get percentage diff and set it to result
            data.total_firewall_ips_traffic_count_diff_percentage = getPercentageDifference(data.total_firewall_ips_traffic_count,response.data[0].ipstrafficcount)
          })
          .catch((error) => {
            console.log(error)
          })
      })
  }

  const getFirewallAdminActivitiesLogIngestion = async () => {

    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getClientFirewallList", {
      params: {
        customerId: customerId,
        interval: 30
      }
    })
      .then(async (response) => {
        let firewallList = new Set()
        if (response.data) {
          response.data.map(async (firewall) => {
            await firewallList.add(firewall.id);
          })
        }
        firewallList = [...firewallList].join(",")
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallAdminActivitiesLogCount', {
          params: {
            firewallId: firewallList,
            interval: 30,
            startDate : reportStartDate,
            endDate : reportEndDate
          }
        })
          .then(response => {
            data.total_firewall_admin_activities_log_count = response.data[0].adminactivitylogcount
          })
          .catch((error) => {
            console.log(error)
          })

        //calculate new date range based on current date range difference.
        const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

        //get previous month log count
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallAdminActivitiesLogCount', {
          params: {
            firewallId: firewallList,
            interval: 30,
            startDate : prevDateRange.newStartDate,
            endDate : prevDateRange.newEndDate
          }
        })
          .then(response => {
            data.total_firewall_admin_activities_log_count_diff_percentage = getPercentageDifference(data.total_firewall_admin_activities_log_count,response.data[0].adminactivitylogcount)
          })
          .catch((error) => {
            console.log(error)
          })
      })
  }

  const getFirewallActiveBlades = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getClientFirewallList", {
      params: {
        customerId: customerId,
        interval: 30
      }
    })
      .then(async (response) => {
        let firewallList = new Set()
        if (response.data) {
          response.data.map(async (firewall) => {
            await firewallList.add(firewall.id);
          })
        }
        firewallList = [...firewallList].join(",")
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getFirewallActiveBladeCount", {
          params: {
            firewallId: firewallList,
            interval: 30,
            startDate: reportStartDate,
            endDate: reportEndDate
          }
        })
          .then(response => {
            //prepare data for active blades pie chart
            data.active_blades = []
            data.active_blades_count = []

            response.data.map(blade => {
              data.active_blades.push(blade.active_blade)
              data.active_blades_count.push(blade.bladecount)

            })
            setPieActiveBlades(data.active_blades)
            setPieActiveBladesCount(data.active_blades_count)
            data.total_firewall_active_blade_count = response.data
          })
          .catch((error) => {
            console.log(error)
          })
      })
  }

  const getTopExternalThreat = async () => {
    await axios.post("http://10.3.22.37:4434/api/v1/threats/external/", {
      "index": ".siem-signals*",
      "gte":reportStartDate+"T00:01:00",
      "lt":reportEndDate+"T00:00:00"
    }).then(async response => {
      const result = response.data.data.data.buckets.splice(0, 5)

      //prepare data to external threats chart
      data.top_external_threats = []
      data.top_external_threats_count = []

      result.map(threat => {
        data.top_external_threats.push(threat.key)
        data.top_external_threats_count.push(threat.doc_count)
      })

      setPieExternalThreats(data.top_external_threats)
      setPieExternalThreatsCount(data.top_external_threats_count)
      data.top_external_threats_data = result

    }).catch(error => {
      console.log(error)
    })
  }

  const getIPSHitsAnalysis = async () => {
    await axios.post("http://10.3.22.37:4434/api/v1/firewall/attack/list", {
      "index": "firewall-checkpoint-tarion*",
      "gte":reportStartDate+"T00:01:00",
      "lt":reportEndDate+"T00:00:00"
    })
      .then(response => {
        data.top_ips_hits_analysis = []
        const attackTypes = response.data.data.data.buckets.splice(0, 5)
        attackTypes.map(attack => {
          data.top_ips_hits_analysis.push({
            source: attack.key[0],
            destination: attack.key[1],
            attackType: attack.key[2]
          })
        })

        setIPsHitsAnalysis(data.top_ips_hits_analysis)
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    Promise.all([
      getFirewallSubscriptionCount(),
      getFirewallTotalLogIngestion(),
      getFirewallTotalAllowedLogIngestion(),
      getFirewallTotalDeniedLogIngestion(),
      getFirewallTotalIPSTrafficLogIngestion(),
      getFirewallAdminActivitiesLogIngestion(),
      getFirewallActiveBlades(),
      getTopExternalThreat(),
      getIPSHitsAnalysis()
    ]).then(() => {
      setResult(data)
    })
  }, []);

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
                className="w-full text-4xl text-white text-right pr-5 border-b-gray-400 border-b-2 uppercase">Analyzing
                Gateway</h1>
            </div>
          </div>
        </div>
        <div className="col-span-3 row-span-14 grid grid-cols-12 grid-rows-13 gap-2">
          <div className="col-span-12 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">{result.total_firewall_subscriptions_count}</h1>
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
          <div className="col-span-12 row-span-1 px-1">
            <div
              className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black flex items-center justify-center">
              <h1 className="text-xl text-yellow-500 font-bold">Firewall Highlights</h1>
            </div>
          </div>
          <div className="col-span-12 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1
                    className="text-4xl text-yellow-500 font-bold">{formatNumber(result.total_firewall_log_ingestion_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Total</b> Logs</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">

                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {result.total_firewall_log_ingestion_count_diff_percentage ?
                        result.total_firewall_log_ingestion_count_diff_percentage >= 0 ?
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{result.total_firewall_log_ingestion_count_diff_percentage ? result.total_firewall_log_ingestion_count_diff_percentage : 0} %</h1>
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
                  <h1
                    className="text-4xl text-yellow-500 font-bold">{formatNumber(result.total_firewall_allowed_traffic_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Allowed</b> Traffic</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {result.total_firewall_allowed_traffic_count_diff_percentage ?
                        result.total_firewall_allowed_traffic_count_diff_percentage >= 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{result.total_firewall_allowed_traffic_count_diff_percentage ? result.total_firewall_allowed_traffic_count_diff_percentage : 0} %</h1>
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
                  <h1
                    className="text-4xl text-yellow-500 font-bold">{formatNumber(result.total_firewall_denied_traffic_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Denied</b> Traffic</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {result.total_firewall_denied_traffic_count_diff_percentage ?
                        result.total_firewall_denied_traffic_count_diff_percentage >= 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{result.total_firewall_denied_traffic_count_diff_percentage ? result.total_firewall_denied_traffic_count_diff_percentage : 0} %</h1>
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
                  <h1
                    className="text-4xl text-yellow-500 font-bold">{formatNumber(result.total_firewall_ips_traffic_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>IPS</b> Hits</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {result.total_firewall_ips_traffic_count_diff_percentage ?
                        result.total_firewall_ips_traffic_count_diff_percentage >= 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{result.total_firewall_ips_traffic_count_diff_percentage ? result.total_firewall_ips_traffic_count_diff_percentage : 0} %</h1>
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
                  <h1
                    className="text-4xl text-yellow-500 font-bold">{formatNumber(result.total_firewall_admin_activities_log_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Admin</b> Activities</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {result.total_firewall_admin_activities_log_count_diff_percentage ?
                        result.total_firewall_admin_activities_log_count_diff_percentage >= 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{result.total_firewall_admin_activities_log_count_diff_percentage ? result.total_firewall_admin_activities_log_count_diff_percentage : 0} %</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-9 row-span-14 grid grid-cols-12 grid-rows-13">
          <div className="col-span-12 row-span-13 px-1">
            <div className="w-full h-full grid grid-rows-12 grid-cols-8 gap-2">
              <div className="col-span-4 row-span-6">
                <div
                  className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                  <div className="h-1/6 w-full">
                    <h1 className="text-white text-3xl flex items-center justify-center">
                      Most Active Blade
                    </h1>
                  </div>
                  <div className="h-5/6 w-full flex items-center justify-center">
                    <div className="w-2/6 h-full">
                      {result.total_firewall_active_blade_count ?
                        result.total_firewall_active_blade_count.map((blade,index)=>{
                          return (
                            <div key={index} className="w-full h-8 flex my-2 rounded-lg" style={{backgroundColor:chartBackgroundColorsListOpacity40[index]}}>
                              <div className="w-2/3 h-full flex items-center justify-center text-sm text-white">{blade.active_blade}</div>
                              <div className="w-1/3 h-full flex items-center justify-center text-sm text-white">{formatNumber(blade.bladecount)}</div>
                            </div>
                          )
                        })
                        : ''}
                    </div>
                    <div className="w-4/6 h-full flex items-center justify-center">
                      <ComponentPieChart backGroundColors={chartBackgroundColorsList} logdata={pieActiveBladesCount} labels={pieActiveBlades}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-4 row-span-6">
                <div
                  className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                  <div className="h-1/6 w-full">
                    <h1 className="text-white text-3xl flex items-center justify-center">
                      Top External Threats
                    </h1>
                  </div>
                  <div className="h-5/6 w-full flex items-center justify-center">
                    <div className="w-2/6 h-full">
                      {result.top_external_threats_data?
                        result.top_external_threats_data.map((threat,index)=> {
                          return (
                            <div key={index} className="w-full h-8 flex my-2 rounded-lg" style={{backgroundColor:chartBackgroundColorsListOpacity40[index]}}>
                              <div
                                className="w-2/3 h-full flex items-center justify-center text-sm text-white">{threat.key}</div>
                              <div
                                className="w-1/3 h-full flex items-center justify-center text-sm text-white">{formatNumber(threat.doc_count)}</div>
                            </div>
                          )
                        })
                        : ''}
                    </div>
                    <div className="w-4/6 h-full flex items-center justify-center">
                      <ComponentPieChart backGroundColors={chartBackgroundColorsList} logdata={pieExternalThreatsCount} labels={pieExternalThreats}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-4 row-span-6">
                <div
                  className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                  <div className="h-1/6 w-full  border-b-gray-400 border-b-2">
                    <h1 className="text-white text-2xl flex items-center justify-center">
                      IPS Hits Analysis <small className="text-sm">(By Severity)</small>
                    </h1>
                  </div>
                  <div className="h-5/6 w-full flex items-center justify-center">
                    <div className="h-full w-full">
                      <div className="h-8 flex text-white">
                        <div
                          className="h-8 w-1/3 flex items-center justify-center font-semibold uppercase border-b-2 border-b-gray-400">Source
                        </div>
                        <div
                          className="h-8 w-1/3 flex items-center justify-center font-semibold uppercase border-b-2 border-b-gray-400">Destination
                        </div>
                        <div
                          className="h-8 w-1/3 flex items-center justify-center font-semibold uppercase border-b-2 border-b-gray-400 ">Type
                          of Attack
                        </div>
                      </div>
                      {ipsHitsAnalysis ?
                        ipsHitsAnalysis.map((attack,index) => {
                          return (
                            <div key={index} className="h-12 flex text-white border-b-2">
                              <div
                                className="h-12 bg-white/10 w-1/3 flex items-center justify-center mr-1">{attack.source}</div>
                              <div
                                className="h-12 bg-white/10 w-1/3 flex items-center justify-center mr-1">{attack.destination}</div>
                              <div className="h-12 bg-white/10 w-1/3 text-center">{attack.attackType}</div>
                            </div>
                          )
                        })
                        : 'No Data'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-4 row-span-6">
                <div
                  className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                  <div className="h-1/6 w-full border-b-gray-400 border-b-2">
                    <h1 className="text-white text-2xl flex items-center justify-center">
                      Security Overview Remarks
                    </h1>
                  </div>
                  <div className="h-5/6 w-full">
                    <div className="w-full h-full">
                      <ul className="list-disc p-5 text-white">
                        <li>We have observed an upward trend on the total log ingestion.</li>
                        <li>We observed the use of attack type “Apache OFBiz Authentication Bypass (CVE-2023-51467)” is
                          in a rise.
                        </li>
                        <li>General recommendation will be to upgrade Apache OFBiz software to version 18.12.11, If it
                          exists on your network and if not done already.
                        </li>
                        <li>We recommend blocking these exploits on IPS if it is not required for operational
                          purposes.
                        </li>
                        <li>A2N recommends to block all the malicious IP.</li>
                      </ul>
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

export default ComponentAnalyzingGateway