import {useContext, useEffect, useState} from "react";
import userContext from "@/context/userContext";
import axios from "axios"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlaneArrival} from "@fortawesome/free-solid-svg-icons/faPlaneArrival";
import {faEthernet, faPlaneDeparture, faShieldDog} from "@fortawesome/free-solid-svg-icons";
import ReportContext from "@/context/ReportContext";

const ComponentNetworkStats = () =>{

  //get user context data
  //const userDataContext = useContext(userContext)
  const {reportContextData, setReportContextData} = useContext(ReportContext)
  //get userContext data to get customerId
  const customerId = reportContextData.selectedCustomer.length > 0 ? reportContextData.selectedCustomer[0].customerId : null
  const reportStartDate = reportContextData.reportStartDate ? reportContextData.reportStartDate : null
  const reportEndDate = reportContextData.reportEndDate ? reportContextData.reportEndDate : null
  //for future implimentation
  const previousReportStartDate = reportContextData.previousReportStartDate ? reportContextData.previousReportStartDate : null
  const previousReportEndDate = reportContextData.previousReportEndDate ? reportContextData.previousReportEndDate : null

  const [customerFirewallList, setCustomerFirewallList] = useState([])
  const [topNetworkProtocol, setTopNetworkProtocol] = useState([]);
  const [topNetworkRules, setTopNetworkRules] = useState([]);
  const [sourceIP,setSourceIP] = useState(0)
  const [destinationIP,setDestinationIP] = useState(0)


  //get firewall top network protocols
  const getFirewallTopNetworkProtocols =()=>{

    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/firewall/getClientFirewallList",{
      params:{
        customerId:customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    }).then(response=>{
      let customerFirewallList = []
      response.data.map( firewall=>{
        customerFirewallList.push(firewall.id)
      })
      axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/firewall/getFirewallTopNetworkProtocols",{
        params:{
          firewallId:customerFirewallList.join(""),
          startDate: reportStartDate,
          endDate: reportEndDate
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
  const getFirewallTopNetworkRules = () =>{
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/firewall/getClientFirewallList",{
      params:{
        customerId:customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    }).then(response=>{
      let customerFirewallList = []
      response.data.map( firewall=>{
        customerFirewallList.push(firewall.id)
      })
      axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/firewall/getFirewallTopNetworkRules",{
        params:{
          firewallId:customerFirewallList.join(""),
          startDate: reportStartDate,
          endDate: reportEndDate
        }
      }).then(response=>{
        setTopNetworkRules([...response.data])
      })
        .catch(error=>{
          console.log(error)
        })
    })
  }

  const getFirewallUniqueSourceIPs = () => {
    axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/firewall/geo/unique/src/ip",
      {
        "index":"firewall-checkpoint-tarion*",
        "gte":reportStartDate + "T00:01:00",
        "lt":reportEndDate + "T23:59:00"
      })
      .then(response=>{
        setSourceIP({"count":response.data.data.count,"ipList":response.data.data.data.table})
      })
      .catch(error=>{
        console.log(error)
      })
  }

  const getFirewallUniqueDestinationIPs = () => {
    axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/firewall/geo/unique/dest/ip",
      {
        "index":"firewall-checkpoint-tarion*",
        "gte":reportStartDate + "T00:01:00",
        "lt":reportEndDate + "T23:59:00"
      })
      .then(response=>{
        setDestinationIP({"count":response.data.data.count,"ipList":response.data.data.data.table})
      })
      .catch(error=>{
        console.log(error)
      })
  }

  useEffect(() => {

    getFirewallTopNetworkRules()
    getFirewallTopNetworkProtocols()
    getFirewallUniqueSourceIPs()
    getFirewallUniqueDestinationIPs()

  }, [reportContextData]);

  return(
    <div className="w-screen h-screen">
      <div className="w-full h-full grid grid-cols-12 grid-rows-16">
        <div className="col-span-12 row-span-2 flex px-5">
          <div className="h-full w-2/12">
            <div className="w-full h-full bg-logo bg-contain bg-center bg-no-repeat">
            </div>
          </div>
          <div className="h-full w-10/12">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-2/3 flex-col">
                <h1 className="w-full text-4xl text-white text-right pr-5 border-b-gray-400 uppercase border-b">
                  Top Network States
                </h1>
                <h2 className="w-full h-1/3 text-sm text-white text-right pr-5 border-b-gray-400">
                  {reportStartDate} - {reportEndDate}
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-16 row-span-14 grid grid-cols-12 grid-rows-16 gap-4">
          <div className="row-span-1 col-span-16"></div>
          <div className="row-span-14 col-span-2"></div>
          <div className="bg-white/10 row-span-14 col-span-2 rounded-xl">
            <div className="w-full h-full overflow-hidden">
              <h1 className="text-xl text-white text-center uppercase my-4 border-b-white border-b-2">
                <FontAwesomeIcon icon={faPlaneDeparture} className="text-green-500 text-2xl px-2"/> Sources
              </h1>
              {sourceIP ?
                sourceIP.ipList.slice(0,10).map(source=> {
                  return <div key={source.key} className="w-full h-12 bg-white/20 my-2 mx-2 px-2 rounded-xl text-white flex items-center justify-center text-lg">{source.key}</div>
                })
                :
                'No Data'
              }
            </div>
          </div>
          <div className="bg-white/10 row-span-14 col-span-2 rounded-xl">
            <div className="w-full h-full overflow-hidden">
              <h1 className="text-xl text-white text-center uppercase my-4 border-b-white border-b-2">
                <FontAwesomeIcon icon={faPlaneArrival} className="text-yellow-500 text-2xl px-2"/> Destination
              </h1>
              {destinationIP ?
                destinationIP.ipList.slice(0,10).map(destination=> {
                  return <div key={destination.key} className="w-full h-12 bg-white/20 my-2 mx-2 px-2 rounded-xl text-white flex items-center justify-center text-lg">{destination.key}</div>
                })
                :
                'No Data'
              }
            </div>
          </div>
          <div className="bg-white/10 row-span-14 col-span-2 rounded-xl">
            <div className="w-full h-full overflow-hidden">
              <h1 className="text-xl text-white text-center uppercase my-4 border-b-white border-b-2">
                <FontAwesomeIcon icon={faEthernet} /> Network Protocol
              </h1>
              {topNetworkProtocol ?
                topNetworkProtocol.map(protocol=> {
                  return <div className="w-full h-12 bg-white/20 my-2 mx-2 px-2 rounded-xl break-all text-white flex items-center justify-center text-lg break-words"
                              key={protocol.network_protocol}>{protocol.network_protocol}</div>
                })
                :
                'No data'
              }
            </div>
          </div>
          <div className="bg-white/10 row-span-14 col-span-2 rounded-xl">
            <div className="w-full h-full overflow-hidden">
              <h1 className="text-xl text-white text-center uppercase my-4 border-b-white border-b-2">
                <FontAwesomeIcon icon={faShieldDog} /> Rule Name
              </h1>
              {topNetworkRules ?
                topNetworkRules.map(rule=>{
                  return <div key={rule.firewallrulename} className="w-full h-12 bg-white/20 my-2 mx-2 px-2 rounded-xl break-all text-white flex items-center justify-center text-lg">{rule.firewallrulename}</div>
                })
                :
                'No Data'
              }
            </div>
          </div>
          <div className="row-span-14 col-span-2"></div>
        </div>
      </div>
    </div>
  )

}

export default ComponentNetworkStats;