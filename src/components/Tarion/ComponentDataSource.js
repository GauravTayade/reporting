import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretUp,
  faComputer,
  faDungeon,
  faEye,
  faMagnifyingGlass,
  faShield
} from "@fortawesome/free-solid-svg-icons";
import {useContext, useState,useEffect} from "react";
import userContext from "@/context/userContext";
import axios from "axios";
import {
  chartBackgroundColorsListOpacity20,
  chartBackgroundColorsList,
  chartBackgroundColorsListOpacity40,
  formatNumber,
  getPercentageDifference,
  getNewDateRange
} from '@/Utilities/Utilities'
import {useRouter} from "next/router";

const ComponentDataSource = (props) => {

  const router = useRouter()
  //to store all api call values once useEffect has completed
  const [result,setResult] = useState({})
  const [firewallData, setFirewallData] = useState(0)
  const [endpointData, setEndpointData] = useState(0)
  const [edrData, setEdrData] = useState(0)
  const [nacData, setNacData] = useState(0)
  const [vaData, setVaData] = useState(0)

  const [totalDevices , setTotalDevices] = useState(0)
  const [totalDevicesPrev, setTotalDevicesPrev] = useState(0)
  const [totalDevicesDiffPercentage, setTotalDevicesDiffPercentage] = useState(0)
  const [totalLogs, setTotalLogs] = useState(0)
  const [totalLogsPrev,setTotalLogsPrev] = useState(0)
  const [totalLogsDiffPercentage, setTotalLogsDiffPercentage] = useState(0)

  const userDataContext = useContext(userContext)
  //get userContext data to get customerId
  const customerId = userDataContext.selectedCustomer ? userDataContext.selectedCustomer[0].customerId : null
  const reportStartDate = userDataContext.selectedCustomer ? userDataContext.selectedCustomer[0].reportStartDate : null
  const reportEndDate = userDataContext.selectedCustomer ? userDataContext.selectedCustomer[0].reportEndDate : null

  const data = {
    totalLogs:0,
    totalDevices:0
  }

  //get client firewalls count and logs count
  const getCustomerFirewalls = async() => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/firewall/getFirewallDataSourceDetails",{params:{
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }})
      .then(response=>{
        if (response.data){
          setFirewallData(response.data)
          setTotalDevices(parseInt(response.data[0].firewallcount))
          setTotalLogs(parseInt(response.data[0].totallogs))
        }
      })
      .catch((error)=>{
        console.log(error)
      })

    //calculate new date range based on current date range difference.
    const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

    //get previous month log count
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/firewall/getFirewallDataSourceDetails",{params:{
        customerId: customerId,
        startDate: prevDateRange.newStartDate,
        endDate: prevDateRange.newEndDate
      }})
      .then(response=>{
        if (response.data){
          setTotalDevicesPrev(parseInt(response.data[0].firewallcount))
          setTotalLogsPrev(parseInt(response.data[0].totallogs))
        }
      })
      .catch((error)=>{
        console.log(error)
      })

  }
  //get client servers count and logs count
  const getCustomerEndpoints = async() =>{
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/endpoint/getEndpointDatSourceDetails",{params:{
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }})
      .then(response=>{
        if(response.data){
          setEndpointData(response.data)
          setTotalDevices(prevTotalDevices => { return prevTotalDevices+parseInt(response.data[0].endpointcount)})
          setTotalLogs(prevTotalLogs=>{return prevTotalLogs + parseInt(response.data[0].totallogs)})
        }
      })
      .catch((error)=>{
        console.log(error)
      })

    //calculate new date range based on current date range difference.
    const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

    //get previous month log count
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/endpoint/getEndpointDatSourceDetails",{params:{
        customerId: customerId,
        startDate: prevDateRange.newStartDate,
        endDate: prevDateRange.newEndDate
      }})
      .then(response=>{
        if (response.data){
          setTotalDevicesPrev(prevTotalDevicesPrev =>{return prevTotalDevicesPrev + parseInt(response.data[0].endpointcount)})
          setTotalLogsPrev(prevTotalLogsPrev=>{return prevTotalLogsPrev + parseInt(response.data[0].totallogs)})
        }
      })
      .catch((error)=>{
        console.log(error)
      })
  }
  //get client NAC count and logs count
  const getCustomerNAC = async() =>{
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/nac/getNACDataSourceDetails",{params:{
        customerId: customerId,
        startDate:reportStartDate,
        endDate:reportEndDate
      }})
      .then(response=>{
        if(response.data){
          setNacData(response.data)
          setTotalDevices(prevTotalDevices => { return prevTotalDevices+parseInt(response.data[0].naccount)})
          setTotalLogs(prevTotalLogs=>{return prevTotalLogs + parseInt(response.data[0].totallogs)})
        }
      })
      .catch((error)=>{
        console.log(error)
      })

    //calculate new date range based on current date range difference.
    const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

    //get previous month log count
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/nac/getNACDataSourceDetails",{params:{
        customerId: customerId,
        startDate: prevDateRange.newStartDate,
        endDate: prevDateRange.newEndDate
      }})
      .then(response=>{
        if (response.data){
          setTotalDevicesPrev(prevTotalDevicesPrev =>{return prevTotalDevicesPrev + parseInt(response.data[0].naccount)})
          setTotalLogsPrev(prevTotalLogs=>{return prevTotalLogs + parseInt(response.data[0].totallogs)})
        }
      })
      .catch((error)=>{
        console.log(error)
      })

  }
  //get client edr count and logs count
  const getCustomerEDR = async() =>{
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/edr/getEDRDataSourceDetails",{params:{
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }})
      .then(response=>{
        if(response.data){
          setEdrData(response.data)
          setTotalDevices(prevTotalDevices => { return prevTotalDevices+parseInt(response.data[0].edrcount)})
          setTotalLogs(prevTotalLogs=>{return prevTotalLogs + parseInt(response.data[0].totallogs)})
        }
      })
      .catch((error)=>{
        console.log(error)
      })

    //calculate new date range based on current date range difference.
    const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

    //get previous month log count
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/edr/getEDRDataSourceDetails",{params:{
        customerId: customerId,
        startDate: prevDateRange.newStartDate,
        endDate: prevDateRange.newEndDate
      }})
      .then(response=>{
        if (response.data){
          setTotalDevicesPrev(prevTotalDevicesPrev =>{return prevTotalDevicesPrev + parseInt(response.data[0].edrcount)})
          setTotalLogsPrev(prevTotalLogs=>{return prevTotalLogs + parseInt(response.data[0].totallogs)})
        }
      })
      .catch((error)=>{
        console.log(error)
      })

  }
  //get client va scan count
  const getCustomerVAScan =async() =>{
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/endpoint/getVAScanDataSourceDetails",{params:{
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }})
      .then(response=>{
        if(response.data){
          setVaData(response.data)
          setTotalDevices(prevTotalDevices => { return prevTotalDevices+response.data.length})
          setTotalLogs(prevTotalLogs=>{return prevTotalLogs + parseInt(response.data[0].evacount)+parseInt(response.data[0].ivacount)})
        }
      })
      .catch(error=>{

      })

    //calculate new date range based on current date range difference.
    const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

    //get previous month log count
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/endpoint/getVAScanDataSourceDetails",{params:{
        customerId: customerId,
        startDate: prevDateRange.newStartDate,
        endDate: prevDateRange.newEndDate
      }})
      .then(response=>{
        if (response.data){
          setTotalDevicesPrev(prevTotalDevicesPrev =>{return prevTotalDevicesPrev + parseInt(response.data.length)})
          setTotalLogsPrev(prevTotalLogs=>{return prevTotalLogs + parseInt(response.data[0].evacount)+parseInt(response.data[0].ivacount)})
        }
      })
      .catch((error)=>{
        console.log(error)
      })

  }

  //get difference of devices count
  const getDevicesDifference = async () =>{

    data.total_devices_count_dff = getPercentageDifference(totalDevices,totalDevicesPrev)
    await setTotalDevicesDiffPercentage(getPercentageDifference(totalDevices,totalDevicesPrev))

  }

  const getTotalLogsDifference = async () =>{
    await setTotalLogsDiffPercentage(getPercentageDifference(totalLogs,totalLogsPrev))
  }

  useEffect(() => {
    setTotalDevices(0)
    setTotalLogs(0)

    Promise.all([
      getCustomerFirewalls(),
      getCustomerEndpoints(),
      getCustomerEDR(),
      getCustomerNAC(),
      getCustomerVAScan(),
      getDevicesDifference(),
      getTotalLogsDifference()
    ])
      .then(async()=>{
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
                className="w-full text-4xl text-white text-right pr-5 border-b-gray-400 border-b-2 uppercase">Data Source</h1>
            </div>
          </div>
        </div>
        <div className="col-span-3 row-span-14 grid grid-cols-12 grid-rows-13 gap-2">
          <div className="col-span-12 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">{totalDevices}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Data</b> Sources</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">

                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {totalDevicesDiffPercentage ?
                        totalDevicesDiffPercentage >= 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{totalDevicesDiffPercentage ? totalDevicesDiffPercentage : 0} %</h1>
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
                  <h1 className="text-4xl text-yellow-500 font-bold">{formatNumber(totalLogs)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Total Logs</b> Analyzed</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">

                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {totalLogsDiffPercentage ?
                        totalLogsDiffPercentage >= 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{totalLogsDiffPercentage ? totalLogsDiffPercentage : 0} %</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*<div className="col-span-12 row-span-2 px-1">*/}
          {/*  <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">*/}
          {/*    <div className="w-full h-full flex">*/}
          {/*      <div className="w-1/3 h-full flex items-center justify-center">*/}
          {/*        <h1 className="text-4xl text-yellow-500 font-bold">609</h1>*/}
          {/*      </div>*/}
          {/*      <div className="w-2/3 h-full flex-col">*/}
          {/*        <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">*/}
          {/*          <h2 className="text-xl text-white"><b>Alerts</b> Generated</h2>*/}
          {/*        </div>*/}
          {/*        <div className="w-full h-1/2 flex items-center">*/}
          {/*          <div className="w-1/2 h-full flex items-center justify-center">*/}
          {/*            <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretUp}/>*/}
          {/*            <h1 className="text-lg text-white">19.4 %</h1>*/}
          {/*          </div>*/}
          {/*          <div className="w-1/2 h-full flex items-center justify-center">*/}
          {/*            <h1 className="text-lg text-white">{new Intl.NumberFormat('en', {*/}
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
          {/*<div className="col-span-12 row-span-2 px-1">*/}
          {/*  <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">*/}
          {/*    <div className="w-full h-full flex">*/}
          {/*      <div className="w-1/3 h-full flex items-center justify-center">*/}
          {/*        <h1 className="text-4xl text-yellow-500 font-bold">0</h1>*/}
          {/*      </div>*/}
          {/*      <div className="w-2/3 h-full flex-col">*/}
          {/*        <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">*/}
          {/*          <h2 className="text-xl text-white"><b>Critical</b> Advisories</h2>*/}
          {/*        </div>*/}
          {/*        <div className="w-full h-1/2 flex items-center">*/}
          {/*          <div className="w-1/2 h-full flex items-center justify-center">*/}
          {/*            <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretUp}/>*/}
          {/*            <h1 className="text-lg text-white">19.4 %</h1>*/}
          {/*          </div>*/}
          {/*          <div className="w-1/2 h-full flex items-center justify-center">*/}
          {/*            <h1 className="text-lg text-white">{new Intl.NumberFormat('en', {*/}
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
        <div className="col-span-9 row-span-14 grid grid-cols-12 grid-rows-13">
          <div className="col-span-12 row-span-13 bg-white bg-opacity-5">
            <div className="w-full h-full grid grid-rows-8 grid-cols-10 text-white">
              <div
                className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center text-2xl border-b-white border-b-2">#
              </div>
              <div
                className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center text-2xl border-b-white border-b-2">Device
                Type
              </div>
              <div
                className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center text-2xl border-b-white border-b-2">Vendor
              </div>
              <div
                className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center text-2xl border-b-white border-b-2">Device
                Count
              </div>
              <div
                className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center text-2xl border-b-white border-b-2">#
                of Logs
              </div>
              {firewallData ?
                firewallData.map(firewall => {
                  return (
                    <>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">
                        <FontAwesomeIcon className="text-4xl" icon={faShield}/>
                      </div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">Firewall
                      </div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{firewall.vendor}</div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{firewall.firewallcount}</div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{formatNumber(firewall.totallogs)}</div>
                    </>
                  )
                })
                :
                ''
              }

              {endpointData ?
                endpointData.map(endpoint => {
                  return (
                    <>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">
                        <FontAwesomeIcon className="text-4xl" icon={faComputer}/>
                      </div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">Endpoint
                      </div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{endpoint.vendor}</div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{endpoint.endpointcount}</div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{formatNumber(endpoint.totallogs)}</div>
                    </>
                  )
                })
                :
                ''
              }

              {edrData ?
                edrData.map(edr => {
                  return (
                    <>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">
                        <FontAwesomeIcon className="text-4xl" icon={faEye}/>
                      </div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">EDR
                      </div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{edr.vendor}</div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{edr.edrcount}</div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{formatNumber(edr.totallogs)}</div>
                    </>
                  )
                })
                :
                ''
              }

              {nacData ?
                nacData.map(nac => {
                  return (
                    <>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">
                        <FontAwesomeIcon className="text-4xl" icon={faDungeon}/>
                      </div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">NAC
                      </div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{nac.vendor}</div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{nac.naccount}</div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{formatNumber(nac.totallogs)}</div>
                    </>
                  )
                })
                :
                ''
              }

              {vaData ?
                vaData.map(va => {
                  return (
                    <>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">
                        <FontAwesomeIcon className="text-4xl" icon={faMagnifyingGlass}/>
                      </div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">VA SCAN
                      </div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{va.vendor}</div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{vaData.length}</div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{formatNumber(va.ivacount + va.evacount)}</div>
                    </>
                  )
                })
                :
                ''
              }

              {totalDevices && totalLogs ?
                <>
                  <div
                    className="col-span-6 row-span-1 bg-white/10 flex items-center justify-center font-semibold text-xl">Total
                  </div>
                  <div
                    className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center font-semibold text-xl">{totalDevices}</div>
                  <div
                    className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center font-semibold text-xl">{formatNumber(totalLogs)}</div>
                </>
                :
                <>
                  <div
                    className="col-span-6 row-span-1 bg-white/10 flex items-center justify-center font-semibold text-xl">Total
                  </div>
                  <div
                    className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center font-semibold text-xl">00
                  </div>
                  <div
                    className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center font-semibold text-xl">00
                  </div>
                </>
              }

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComponentDataSource;
