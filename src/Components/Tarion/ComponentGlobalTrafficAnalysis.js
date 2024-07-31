import ComponentPieChart from "@/Components/charts/ComponentPieChart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp, faPlaneDeparture} from "@fortawesome/free-solid-svg-icons";
import userContext from "@/context/userContext";
import {useContext, useEffect, useState} from "react";

import axios from "axios";
import {compileNonPath} from "next/dist/shared/lib/router/utils/prepare-destination";
import {faPlaneArrival} from "@fortawesome/free-solid-svg-icons/faPlaneArrival";
import {faShield} from "@fortawesome/free-solid-svg-icons/faShield";
import {formatNumber, getPercentageDifference,getNewDateRange} from "@/Utilities/Utilities";

const ComponentGlobalTrafficAnalysis = (props) =>{

  //one state to store all results
  const [result,setResult] = useState({});
  const [customerFirewallList, setCustomerFirewallList] = useState([])
  const [topNetworkProtocol, setTopNetworkProtocol] = useState([]);
  const [topNetworkRules, setTopNetworkRules] = useState([]);
  const [ipsCount,setIpsCount] = useState(0);
  const [sourceCountries,setSourceCountries] = useState(0)
  const [destinationCountries,setDestinationCountries] = useState(0)
  const [sourceIP,setSourceIP] = useState(0)
  const [destinationIP,setDestinationIP] = useState(0)

  const [sourceTrafficData, setSourceTrafficData] = useState(null)
  const [destinationTrafficData, setDestinationTrafficData] = useState(null)
  const [sourceIPSTrafficData, setSourceIPSTrafficData] = useState(null)
  const [destinationIPSTrafficData, setDestinationIPSTrafficData] = useState(null)
  const [totalIPSTrafficData, setTotalIPSTrafficData] = useState()

  let data = {

      resultCustomerFirewallList :[],
      resultFirewallTopNetworkProtocols:[],
      resultFirewallTopNetworkRules:[],
    }

  //get user context data
  const userDataContext = useContext(userContext)
  //get userContext data to get customerId
  const customerId = userDataContext.selectedCustomer ? userDataContext.selectedCustomer[0].customerId : null
  const reportStartDate = userDataContext.selectedCustomer ? userDataContext.selectedCustomer[0].reportStartDate : null
  const reportEndDate = userDataContext.selectedCustomer ? userDataContext.selectedCustomer[0].reportEndDate : null

  //get ips traffic count
  const getFirewallIPScount = async ()=>{
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/firewall/getClientFirewallList",{
      params:{
        customerId:customerId,
      }
    }).then(async response=>{
      let customerFirewallList = []
      await response.data.map( firewall=>{
        customerFirewallList.push(firewall.id)
      })
      axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/firewall/getFirewallIPSTrafficCount",{
        params:{
          firewallId:customerFirewallList.join(""),
          startDate : reportStartDate,
          endDate : reportEndDate
        }
      }).then(response=>{
        setIpsCount(response.data[0].ipstrafficcount)

        //calculate new date range based on current date range difference.
        const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

        //get previous month log count
        axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/firewall/getFirewallIPSTrafficCount",{
          params:{
            firewallId:customerFirewallList.join(""),
            startDate : prevDateRange.newStartDate,
            endDate : prevDateRange.newEndDate
          }
        })
          .then(response =>{
            if (response.data){
              data.total_IPS_traffic_log_count_diff_percentage = getPercentageDifference(ipsCount,response.data[0].ipstrafficcount)
            }
          })
          .catch(error=>{

          })
      })
        .catch(error=>{
          console.log(error)
        })
    })
  }
  //get firewall top network protocols
  const getFirewallTopNetworkProtocols =async()=>{

    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/firewall/getClientFirewallList",{
      params:{
        customerId:customerId,
        interval:30
      }
    }).then(async response=>{
      let customerFirewallList = []
      await response.data.map( firewall=>{
        customerFirewallList.push(firewall.id)
      })
      axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/firewall/getFirewallTopNetworkProtocols",{
        params:{
          firewallId:customerFirewallList.join(""),
          interval:30
        }
      }).then(response=>{
        setTopNetworkProtocol([...response.data])
      })
        .catch(error=>{
          console.log(error)
        })
    })
  }
  //get firewall top network rules
  const getFirewallTopNetworkRules = async () =>{
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/firewall/getClientFirewallList",{
      params:{
        customerId:customerId,
        interval:30
      }
    }).then(async response=>{
      let customerFirewallList = []
      await response.data.map( firewall=>{
        customerFirewallList.push(firewall.id)
      })
      axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/firewall/getFirewallTopNetworkRules",{
        params:{
          firewallId:customerFirewallList.join(""),
          interval:30
        }
      }).then(response=>{
        setTopNetworkRules([...response.data])
      })
        .catch(error=>{
          console.log(error)
        })
    })
  }
  //get firewall top source ip addresses
  const getFirewallTopSourceIPs= async () => {
  }
  //get firewall top destination ip addresses
  const getFirewallTopDestinationIPs= () => {
  }

  const getFirewallUniqueSourceCountries = async() => {
    const result =await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/firewall/country/src",{
      "index":"firewall-checkpoint-tarion*",
      "gte":reportStartDate+"T00:01:00",
      "lt":reportEndDate+"T00:01:00"
    })
      .then(async response=>{
        await setSourceCountries({"count":response.data.data.count, "countries":response.data.data.data.table})

        //calculate new date range based on current date range difference.
        const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

        //get previous month log count
        const result =await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/firewall/country/src",{
          "index":"firewall-checkpoint-tarion*",
          "gte":reportStartDate+"T00:01:00",
          "lt":reportEndDate+"T00:01:00"
        })
          .then(async response=>{
            data.total_unique_src_country_diff_percentage = getPercentageDifference(sourceCountries.count, response.data.data.count)
          })
          .catch(error=>{
            console.log(error)
          })
      })
      .catch(error=>{
        console.log(error)
      })
  }
  const getFirewallUniqueDestinationCountries = async() => {
    const result =await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/firewall/country/dest",{
      "index":"firewall-checkpoint-tarion*",
      "gte":reportStartDate+"T00:01:00",
      "lt":reportEndDate+"T00:01:00"
    })
      .then(async response=>{
        await setDestinationCountries({"count":response.data.data.count, "countries":response.data.data.data.table})

        //calculate new date range based on current date range difference.
        const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

        //get previous month log count
        const result =await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/firewall/country/dest",{
          "index":"firewall-checkpoint-tarion*",
          "gte":reportStartDate+"T00:01:00",
          "lt":reportEndDate+"T00:01:00"
        })
          .then(async response=>{
            data.total_unique_dest_country_diff_percentage = getPercentageDifference(destinationCountries.count, response.data.data.count)
          })
          .catch(error=>{

          })

      })
      .catch(error=>{
        console.log(error)
      })
  }
  const getFirewallUniqueSourceIPs = async () => {
    const result = await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/firewall/geo/unique/src/ip",
      {
        "index":"firewall-checkpoint-tarion*",
        "gte":reportStartDate+"T00:01:00",
        "lt":reportEndDate+"T00:01:00"
      })
      .then(async response=>{
        await setSourceIP({"count":response.data.data.count,"ipList":response.data.data.data.table})

        //calculate new date range based on current date range difference.
        const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

        //get previous month log count
        const result = await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/firewall/geo/unique/src/ip",{
          "index":"firewall-checkpoint-tarion*",
          "gte": prevDateRange.newStartDate,
          "lt": prevDateRange.newEndDate
        })
          .then(response=>{
            data.total_unique_src_ip_diff_percentage = getPercentageDifference(sourceIP.count, response.data.data.count)
          })

      })
      .catch(error=>{
        console.log(error)
      })
  }
  const getFirewallUniqueDestinationIPs = async () => {
    const result = await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/firewall/geo/unique/dest/ip",
      {
        "index":"firewall-checkpoint-tarion*",
        "gte":reportStartDate+"T00:01:00",
        "lt":reportEndDate+"T00:01:00"
      })
      .then(async response=>{
        await setDestinationIP({"count":response.data.data.count,"ipList":response.data.data.data.table})

        //calculate new date range based on current date range difference.
        const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

        //get previous month log count
        const result  = await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/firewall/geo/unique/dest/ip",{
          "index":"firewall-checkpoint-tarion*",
          "gte": prevDateRange.newStartDate,
          "lt": prevDateRange.newEndDate
        })
          .then(response => {
            data.total_unique_dest_ip_diff_percentage = getPercentageDifference(destinationIP.count, response.data.data.count)
          })
          .catch(error=>{
            console.log(error)
          })

      })
      .catch(error=>{
        console.log(error)
      })
  }

  const getSourceContinentTraffic = async() =>{
    axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/firewall/geo/unique/src/continent",{
      "index":"firewall-checkpoint-tarion",
      "gte":reportStartDate+"T00:01:00",
      "lt":reportEndDate+"T00:01:00"
    })
      .then(response=>{
          if(response.data.data.data.table){
            let sourceTrafficDataTemp={}
            response.data.data.data.table.map(continent=>{
              sourceTrafficDataTemp[continent.key.replace(/\s/g, '')] = continent.doc_count
            })
            setSourceTrafficData(sourceTrafficDataTemp)
          }
      })
      .catch(error=>{
        console.log(error)
      })
  }
  const getDestinationContinentTraffic = async() =>{
      axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/firewall/geo/unique/dest/continent",{
        "index":"firewall-checkpoint-tarion",
        "gte":reportStartDate+"T00:01:00",
        "lt":reportEndDate+"T00:01:00"
      })
        .then(response=>{
          if(response.data.data.data.table){
            let destinationTrafficDataTemp={}
            response.data.data.data.table.map(continent=>{
              destinationTrafficDataTemp[continent.key.replace(/\s/g, '')] = continent.doc_count
            })
            setDestinationTrafficData(destinationTrafficDataTemp)
          }
        })
        .catch(error=>{
          console.log(error)
        })
  }

  const getIPSContinentTraffic = async() =>{

    let destinationIPSTraffic ={}
    let sourceIPSTraffic = {}
    let totalIPSTraffic={}
    let continents = ["NorthAmerica","SouthAmerica","Europe","Oceania","Asia","Africa"]

    axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/firewall/geo/unique/src/ips/continent",{
      "index":"firewall-checkpoint-tarion",
      "gte":reportStartDate+"T00:01:00",
      "lt":reportEndDate+"T00:01:00"
    })
      .then(response=>{
        if(response.data.data.data.table) {
          response.data.data.data.table.map(continent=>{
            sourceIPSTraffic[continent.key.replace(/\s/g, '')]=continent.doc_count
          })
          axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/firewall/geo/unique/dest/ips/continent",{
                "index":"firewall-checkpoint-tarion",
                "gte":reportStartDate+"T00:01:00",
                "lt":reportEndDate+"T00:01:00"
              })
            .then(response=>{
                    if(response.data.data.data.table){
                      response.data.data.data.table.map(continent=>{
                        destinationIPSTraffic[continent.key.replace(/\s/g, '')] = continent.doc_count
                      })
                    }
                    continents.map(continent=>{
                      if(sourceIPSTraffic.hasOwnProperty(continent) && destinationIPSTraffic.hasOwnProperty(continent))
                      {
                        totalIPSTraffic[continent] = sourceIPSTraffic[continent] + destinationIPSTraffic[continent]
                      }
                      if(sourceIPSTraffic.hasOwnProperty(continent) && destinationIPSTraffic.hasOwnProperty(continent) === false)
                      {
                        totalIPSTraffic[continent] = sourceIPSTraffic[continent]
                      }
                      if(sourceIPSTraffic.hasOwnProperty(continent)=== false && destinationIPSTraffic.hasOwnProperty(continent))
                      {
                        totalIPSTraffic[continent] = destinationIPSTraffic[continent]
                      }
                      if(sourceIPSTraffic.hasOwnProperty(continent)=== false && destinationIPSTraffic.hasOwnProperty(continent)===false)
                      {
                        totalIPSTraffic[continent] = 0
                      }
                    })
              setTotalIPSTrafficData(totalIPSTraffic)
            }).catch(error=>{
              console.log(error)
          })
        }
      })
      .catch(error=>{
        console.log(error)
      })
  }

  //useEffect to make calls to apis
  useEffect(() => {
    Promise.all([
      getFirewallTopNetworkProtocols(),
      getFirewallTopNetworkRules(),
      getFirewallIPScount(),
      getFirewallUniqueSourceCountries(),
      getFirewallUniqueDestinationCountries(),
      getFirewallUniqueSourceIPs(),
      getFirewallUniqueDestinationIPs(),
      getSourceContinentTraffic(),
      getDestinationContinentTraffic(),
      getIPSContinentTraffic()
    ])
      .then(()=>{
        setResult(data)
      })
      .catch(error=>{
        console.log(error)
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
                className="w-full text-4xl text-white text-right pr-5 border-b-gray-400 border-b-2 uppercase">Global
                Traffic Analysis</h1>
            </div>
          </div>
        </div>
        <div className="col-span-3 row-span-14 grid grid-cols-12 grid-rows-13 gap-2">
          <div className="col-span-12 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">{formatNumber(ipsCount)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Total IPS</b> Counts</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {result.total_IPS_traffic_log_count_diff_percentage ?
                        result.total_IPS_traffic_log_count_diff_percentage >= 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{result.total_IPS_traffic_log_count_diff_percentage ? result.total_IPS_traffic_log_count_diff_percentage : 0} %</h1>
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
                  <h1 className="text-4xl text-yellow-500 font-bold">{formatNumber(sourceIP.count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Source IP&apos;s</b> Detected</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {result.total_unique_src_ip_diff_percentage ?
                        result.total_unique_src_ip_diff_percentage >= 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{result.total_unique_src_ip_diff_percentage ? result.total_unique_src_ip_diff_percentage : 0} %</h1>
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
                  <h1 className="text-4xl text-yellow-500 font-bold">{sourceCountries.count}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Source Countries</b></h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {result.total_unique_src_country_diff_percentage ?
                        result.total_unique_src_country_diff_percentage >= 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{result.total_unique_src_country_diff_percentage ? result.total_unique_src_country_diff_percentage : 0} %</h1>
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
                  <h1 className="text-4xl text-yellow-500 font-bold">{formatNumber(destinationIP.count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Destination IP&apos;s</b> Detected</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {result.total_unique_dest_ip_diff_percentage ?
                        result.total_unique_dest_ip_diff_percentage >= 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{result.total_unique_dest_ip_diff_percentage ? result.total_unique_dest_ip_diff_percentage : 0} %</h1>
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
                  <h1 className="text-4xl text-yellow-500 font-bold">{destinationCountries ? destinationCountries.count : 0}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Destination Countries</b></h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">

                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {result.total_unique_dest_country_diff_percentage ?
                        result.total_unique_dest_country_diff_percentage >= 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{result.total_unique_dest_country_diff_percentage ? result.total_unique_dest_country_diff_percentage : 0} %</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-9 row-span-14 grid grid-cols-12 grid-rows-13 px-1 bg-opacity-5 rounded-lg gap-2">
          <div
            className="col-span-12 row-span-14 bg-map bg-center bg-contain bg-no-repeat rounded-lg grid grid-rows-18 grid-cols-18">
            <div className="row-span-7 col-span-18"></div>
            <div className="row-span-2 col-span-3"></div>
            <div className="row-span-2 col-span-2">
              <div className="w-full h-full rounded-full bg-white bg-opacity-25">
                <div className="rounded-full w-full h-full overflow-hidden">
                  <div className="h-1/3 w-full border-b-2 border-b-white text-center text-white">
                    <FontAwesomeIcon icon={faPlaneDeparture} className="text-green-500"/>
                    {sourceTrafficData ? formatNumber(sourceTrafficData['NorthAmerica']) : 0}
                  </div>
                  <div className="h-1/3 w-full border-b-2 border-b-white text-center text-white">
                    {destinationTrafficData ? formatNumber(destinationTrafficData['NorthAmerica']) : 0}
                    <FontAwesomeIcon icon={faPlaneArrival} className="text-yellow-500"/>
                  </div>
                  <div className="h-1/3 w-full text-center text-white">
                    <FontAwesomeIcon icon={faShield} className="text-red-500"/>
                    {totalIPSTrafficData && totalIPSTrafficData.hasOwnProperty('NorthAmerica') ? formatNumber(totalIPSTrafficData['NorthAmerica']) : 0}
                  </div>
                </div>
              </div>
            </div>
            <div className="row-span-2 col-span-3"></div>
            <div className="row-span-2 col-span-2">
              <div className="w-full h-full rounded-full bg-white bg-opacity-25">
                <div className="rounded-full w-full h-full overflow-hidden">
                  <div className="h-1/3 w-full border-b-2 border-b-white text-center text-white">
                    <FontAwesomeIcon icon={faPlaneDeparture} className="text-green-500"/>
                    {sourceTrafficData ? formatNumber(sourceTrafficData['Europe']) : 0}
                  </div>
                  <div className="h-1/3 w-full border-b-2 border-b-white text-center text-white">
                    {destinationTrafficData ? formatNumber(destinationTrafficData['Europe']) : 0}
                    <FontAwesomeIcon icon={faPlaneArrival} className="text-yellow-500"/>
                  </div>
                  <div className="h-1/3 w-full text-center text-white">
                    <FontAwesomeIcon icon={faShield} className="text-red-500"/>
                    {totalIPSTrafficData && totalIPSTrafficData.hasOwnProperty('Europe') ? formatNumber(totalIPSTrafficData['Europe']) : 0}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 row-span-1"></div>
            <div className="row-span-2 col-span-2">
              <div className="w-full h-full rounded-full bg-white bg-opacity-25">
                <div className="rounded-full w-full h-full overflow-hidden">
                  <div className="h-1/3 w-full border-b-2 border-b-white text-center text-white">
                    <FontAwesomeIcon icon={faPlaneDeparture} className="text-green-500"/>
                    {formatNumber(sourceTrafficData ? sourceTrafficData['Asia'] : 0)}
                  </div>
                  <div className="h-1/3 w-full border-b-2 border-b-white text-center text-white">
                    {formatNumber(destinationTrafficData ? destinationTrafficData['Asia'] : 0)}
                    <FontAwesomeIcon icon={faPlaneArrival} className="text-yellow-500"/>
                  </div>
                  <div className="h-1/3 w-full text-center text-white">
                    <FontAwesomeIcon icon={faShield} className="text-red-500"/>
                    {totalIPSTrafficData && totalIPSTrafficData.hasOwnProperty('Asia') ? formatNumber(totalIPSTrafficData['Asia']) : 0}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-5 row-span-1"></div>
            <div className="col-span-18 row-span-1"></div>
            <div className="col-span-8 row-span-1"></div>
            <div className="row-span-2 col-span-2">
              <div className="w-full h-full rounded-full bg-white bg-opacity-25">
                <div className="rounded-full w-full h-full overflow-hidden">
                  <div className="h-1/3 w-full border-b-2 border-b-white text-center text-white">
                    <FontAwesomeIcon icon={faPlaneDeparture} className="text-green-500"/>
                    {formatNumber(sourceTrafficData ? sourceTrafficData['Africa'] : 0)}
                  </div>
                  <div className="h-1/3 w-full border-b-2 border-b-white text-center text-white">
                    {formatNumber(destinationTrafficData ? destinationTrafficData['Africa'] : 0)}
                    <FontAwesomeIcon icon={faPlaneArrival} className="text-yellow-500"/>
                  </div>
                  <div className="h-1/3 w-full text-center text-white">
                    <FontAwesomeIcon icon={faShield} className="text-red-500"/>
                    {totalIPSTrafficData && totalIPSTrafficData.hasOwnProperty('Africa') ? formatNumber(totalIPSTrafficData['Africa']) : 0}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-8 row-span-1"></div>
            <div className="col-span-5 row-span-2"></div>
            <div className="row-span-2 col-span-2">
              <div className="w-full h-full rounded-full bg-white bg-opacity-25">
                <div className="rounded-full w-full h-full overflow-hidden">
                  <div className="h-1/3 w-full border-b-2 border-b-white text-center text-white">
                    <FontAwesomeIcon icon={faPlaneDeparture} className="text-green-500"/>
                    {formatNumber(sourceTrafficData ? sourceTrafficData['SouthAmerica'] : 0)}
                  </div>
                  <div className="h-1/3 w-full border-b-2 border-b-white text-center text-white">
                    {formatNumber(destinationTrafficData ? destinationTrafficData['SouthAmerica'] : 0)}
                    <FontAwesomeIcon icon={faPlaneArrival} className="text-yellow-500"/>
                  </div>
                  <div className="h-1/3 w-full text-center text-white">
                    <FontAwesomeIcon icon={faShield} className="text-red-500"/>
                    {totalIPSTrafficData && totalIPSTrafficData.hasOwnProperty('SouthAfrica') ? formatNumber(totalIPSTrafficData['SouthAfrica']) : 0}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-8 row-span-1"></div>
            <div className="col-span-6 row-span-1"></div>
            <div className="row-span-2 col-span-2">
              <div className="w-full h-full rounded-full bg-white bg-opacity-25">
                <div className="rounded-full w-full h-full overflow-hidden">
                  <div className="h-1/3 w-full border-b-2 border-b-white text-center text-white">
                    <FontAwesomeIcon icon={faPlaneDeparture} className="text-green-500"/>
                    {formatNumber(sourceTrafficData ? sourceTrafficData['Oceania'] : 0)}
                  </div>
                  <div className="h-1/3 w-full border-b-2 border-b-white text-center text-white">
                    {formatNumber(destinationTrafficData ? destinationTrafficData['Oceania'] : 0)}
                    <FontAwesomeIcon icon={faPlaneArrival} className="text-yellow-500"/>
                  </div>
                  <div className="h-1/3 w-full text-center text-white">
                    <FontAwesomeIcon icon={faShield} className="text-red-500"/>
                    {totalIPSTrafficData && totalIPSTrafficData.hasOwnProperty('Oceania') ? formatNumber(totalIPSTrafficData['Oceania']) : 0}
                  </div>
                </div>
              </div>
            </div>
            <div className="row-span-1 col-span-3"></div>
            <div className="row-span-1 col-span-18"></div>
            <div className="row-span-1 col-span-18"></div>
            <div className="row-span-1 col-span-18"></div>
            <div className="col-span-18 row-span-1 grid grid-cols-7 grid-rows-1 border-2 border-white">
              <div className="row-span-1 col-span-2"></div>
              <div className="row-span-1 col-span-3 flex">
                <div className="w-1/3 h-full text-white flex items-center justify-center">
                  <FontAwesomeIcon icon={faPlaneDeparture} className="text-green-500"/> Outgoing Traffic
                </div>
                <div className="w-1/3 h-full text-white flex items-center justify-center">
                  <FontAwesomeIcon icon={faPlaneArrival} className="text-yellow-500"/> Incoming Traffic
                </div>
                <div className="w-1/3 h-full text-white flex items-center justify-center">
                  <FontAwesomeIcon icon={faShield} className="text-red-500"/> IPS Traffic
                </div>
              </div>
              <div className="row-span-1 col-span-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default ComponentGlobalTrafficAnalysis;