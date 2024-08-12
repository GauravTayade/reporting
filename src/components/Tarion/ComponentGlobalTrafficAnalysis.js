import ComponentPieChart from "@/components/charts/ComponentPieChart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp, faPlaneDeparture} from "@fortawesome/free-solid-svg-icons";
import userContext from "@/context/userContext";
import {useContext, useEffect, useState} from "react";

import axios from "axios";
import {compileNonPath} from "next/dist/shared/lib/router/utils/prepare-destination";
import {faPlaneArrival} from "@fortawesome/free-solid-svg-icons/faPlaneArrival";
import {faShield} from "@fortawesome/free-solid-svg-icons/faShield";
import {formatNumber, getPercentageDifference, getNewDateRange} from "@/Utilities/Utilities";

const ComponentGlobalTrafficAnalysis = (props) => {

  //get user context data
  const userDataContext = useContext(userContext)
  //get userContext data to get customerId
  const customerId = userDataContext.selectedCustomer.length > 0 ? userDataContext.selectedCustomer[0].customerId : null
  const reportStartDate = userDataContext.reportStartDate ? userDataContext.reportStartDate : null
  const reportEndDate = userDataContext.reportEndDate ? userDataContext.reportEndDate : null

  const initialValues = {
    total_unique_IPS_count: 0,
    total_unique_IPS_diff_percentage: 0,
    total_unique_src_ip_count: 0,
    total_unique_src_countries_count: 0,
    total_unique_src_ip_diff_percentage: 0,
    total_unique_src_countries_diff_percentage: 0,
    total_unique_dest_ip_count: 0,
    total_unique_dest_countries_count: 0,
    total_unique_dest_ip_diff_percentage: 0,
    total_unique_dest_countries_diff_percentage: 0,
  }

  //one state to store all results
  const [globalTrafficAnalysisData, setGlobalTrafficAnalysisData] = useState(initialValues);

  const [sourceTrafficData, setSourceTrafficData] = useState(null)
  const [destinationTrafficData, setDestinationTrafficData] = useState(null)
  const [totalIPSTrafficData, setTotalIPSTrafficData] = useState()

  let data = {
    resultCustomerFirewallList: [],
    resultFirewallTopNetworkProtocols: [],
    resultFirewallTopNetworkRules: [],
  }

  //get ips traffic count
  const getFirewallIPScount = () => {

    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getClientFirewallList", {
      params: {
        customerId: customerId,
      }
    }).then(async response => {

      let customerFirewallList = []
      await response.data.map(firewall => {
        customerFirewallList.push(firewall.id)
      })

      await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getFirewallIPSTrafficCount", {
        params: {
          firewallId: customerFirewallList.join(""),
          startDate: reportStartDate,
          endDate: reportEndDate
        }
      }).then(async response => {
        setGlobalTrafficAnalysisData(globalTrafficAnalysisData => {
          return {
            ...globalTrafficAnalysisData,
            total_unique_IPS_count: response.data[0].ipstrafficcount
          }
        })

        //calculate new date range based on current date range difference.
        const prevDateRange = getNewDateRange(reportStartDate, reportEndDate)

        //get previous month log count
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getFirewallIPSTrafficCount", {
          params: {
            firewallId: customerFirewallList.join(""),
            startDate: prevDateRange.newStartDate,
            endDate: prevDateRange.newEndDate
          }
        })
          .then(prevResponse => {
            if (prevResponse.data) {
              getPercentageDifference(response.data[0].ipstrafficcount, prevResponse.data[0].ipstrafficcount).then(result => {
                setGlobalTrafficAnalysisData(prevGlobalTrafficAnalysisData => {
                  return {...prevGlobalTrafficAnalysisData, total_unique_IPS_diff_percentage: result}
                })
              })
            }
          })
          .catch(error => {

          })
      })
        .catch(error => {
          console.log(error)
        })
    })
  }

  const getFirewallUniqueSourceIPs = () => {

    axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL + "/firewall/geo/unique/src/ip",
      {
        "index": "firewall-checkpoint-tarion*",
        "gte": reportStartDate + "T00:01:00",
        "lt": reportEndDate + "T00:01:00"
      })
      .then(async response => {

        setGlobalTrafficAnalysisData(prevGlobalTrafficAnalysisData => {
          return {...prevGlobalTrafficAnalysisData, total_unique_src_ip_count: response.data.data.count}
        })
        //calculate new date range based on current date range difference.
        const prevDateRange = getNewDateRange(reportStartDate, reportEndDate)

        //get previous month log count
        await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL + "/firewall/geo/unique/src/ip", {
          "index": "firewall-checkpoint-tarion*",
          "gte": prevDateRange.newStartDate,
          "lt": prevDateRange.newEndDate
        })
          .then(async prevResponse => {
            getPercentageDifference(response.data.data.count, prevResponse.data.data.count).then(result => {
              setGlobalTrafficAnalysisData(prevGlobalTrafficAnalysisData => {
                return {...prevGlobalTrafficAnalysisData, total_unique_src_ip_diff_percentage: result}
              })
            })
          })

      })
      .catch(error => {
        console.log(error)
      })
  }

  const getFirewallUniqueSourceCountries = () => {
    axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL + "/firewall/country/src", {
      "index": "firewall-checkpoint-tarion*",
      "gte": reportStartDate + "T00:01:00",
      "lt": reportEndDate + "T00:01:00"
    })
      .then(async response => {

        let srcCountryCount = 0

        if (response.data) {
          response.data.data.data.table.map(cont => {
            srcCountryCount += parseInt(cont.country.buckets.length)
          })
        }

        setGlobalTrafficAnalysisData(prevGlobalTrafficAnalysisData => {
          return {...prevGlobalTrafficAnalysisData, total_unique_src_countries_count: srcCountryCount}
        })

        //calculate new date range based on current date range difference.
        const prevDateRange = getNewDateRange(reportStartDate, reportEndDate)

        //get previous month log count
        const result = await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL + "/firewall/country/src", {
          "index": "firewall-checkpoint-tarion*",
          "gte": prevDateRange.newStartDate + "T00:01:00",
          "lt": prevDateRange.newEndDate + "T00:01:00"
        })
          .then(async prevResponse => {

            let prevSrcCountryCount = 0

            if (prevResponse.data) {
              prevResponse.data.data.data.table.map(cont => {
                prevSrcCountryCount += parseInt(cont.country.buckets.length)
              })
            }

            getPercentageDifference(srcCountryCount, prevSrcCountryCount).then(result => {
              setGlobalTrafficAnalysisData(prevGlobalTrafficAnalysisData => {
                return {...prevGlobalTrafficAnalysisData, total_unique_src_countries_diff_percentage: result}
              })
            })
          })
          .catch(error => {
            console.log(error)
          })
      })
      .catch(error => {
        console.log(error)
      })
  }

  const getFirewallUniqueDestinationIPs = () => {
    axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL + "/firewall/geo/unique/dest/ip",
      {
        "index": "firewall-checkpoint-tarion*",
        "gte": reportStartDate + "T00:01:00",
        "lt": reportEndDate + "T00:01:00"
      })
      .then(async response => {
        setGlobalTrafficAnalysisData(prevGlobalTrafficAnalysisData => {
          return {...prevGlobalTrafficAnalysisData, total_unique_dest_ip_count: response.data.data.count}
        })

        //calculate new date range based on current date range difference.
        const prevDateRange = getNewDateRange(reportStartDate, reportEndDate)

        //get previous month log count
        const result = await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL + "/firewall/geo/unique/dest/ip", {
          "index": "firewall-checkpoint-tarion*",
          "gte": prevDateRange.newStartDate,
          "lt": prevDateRange.newEndDate
        })
          .then(prevResponse => {
            getPercentageDifference(response.data.data.count, prevResponse.data.data.count).then(result => {
              setGlobalTrafficAnalysisData(prevGlobalTrafficAnalysisData => {
                return {...prevGlobalTrafficAnalysisData, total_unique_dest_ip_diff_percentage: result}
              })
            })
          })
          .catch(error => {
            console.log(error)
          })

      })
      .catch(error => {
        console.log(error)
      })
  }

  const getFirewallUniqueDestinationCountries = () => {
    axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL + "/firewall/country/dest", {
      "index": "firewall-checkpoint-tarion*",
      "gte": reportStartDate + "T00:01:00",
      "lt": reportEndDate + "T00:01:00"
    })
      .then(async response => {

        let destCountryCount = 0

        if (response.data) {
          response.data.data.data.table.map(cont => {
            destCountryCount += parseInt(cont.country.buckets.length)
          })
        }

        setGlobalTrafficAnalysisData(prevGlobalTrafficAnalysisData => {
          console.log(prevGlobalTrafficAnalysisData)
          return {...prevGlobalTrafficAnalysisData, total_unique_dest_countries_count: destCountryCount}
        })

        //setGlobalTrafficAnalysisData(prevGlobalTrafficAnalysisData => {return {...prevGlobalTrafficAnalysisData,total_unique_dest_countries_count:response.data.data.count}})

        //calculate new date range based on current date range difference.
        const prevDateRange = getNewDateRange(reportStartDate, reportEndDate)

        //get previous month log count
        await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL + "/firewall/country/dest", {
          "index": "firewall-checkpoint-tarion*",
          "gte": prevDateRange.newStartDate + "T00:01:00",
          "lt": prevDateRange.newEndDate + "T00:01:00"
        })
          .then(async prevResponse => {

            let prevDestCountryCount = 0

            if (prevResponse.data) {
              prevResponse.data.data.data.table.map(cont => {
                prevDestCountryCount += parseInt(cont.country.buckets.length)
              })
            }

            await getPercentageDifference(destCountryCount, prevDestCountryCount).then(result => {
              setGlobalTrafficAnalysisData(prevGlobalTrafficAnalysisData => {
                return {...prevGlobalTrafficAnalysisData, total_unique_dest_countries_diff_percentage: result}
              })
            })

            // getPercentageDifference(response.data.data.count,prevResponse.data.data.count).then(result=>{
            //   setGlobalTrafficAnalysisData(prevGlobalTrafficAnalysisData => {return{...prevGlobalTrafficAnalysisData,total_unique_dest_countries_diff_percentage:result}})
            // })
          })
          .catch(error => {

          })

      })
      .catch(error => {
        console.log(error)
      })
  }

  const getSourceContinentTraffic = () => {
    axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL + "/firewall/geo/unique/src/continent", {
      "index": "firewall-checkpoint-tarion",
      "gte": reportStartDate + "T00:01:00",
      "lt": reportEndDate + "T00:01:00"
    })
      .then(response => {
        if (response.data.data.data.table) {
          let sourceTrafficDataTemp = {}
          response.data.data.data.table.map(continent => {
            sourceTrafficDataTemp[continent.key.replace(/\s/g, '')] = continent.doc_count
          })
          setSourceTrafficData(sourceTrafficDataTemp)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const getDestinationContinentTraffic = () => {
    axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL + "/firewall/geo/unique/dest/continent", {
      "index": "firewall-checkpoint-tarion",
      "gte": reportStartDate + "T00:01:00",
      "lt": reportEndDate + "T00:01:00"
    })
      .then(response => {
        if (response.data.data.data.table) {
          let destinationTrafficDataTemp = {}
          response.data.data.data.table.map(continent => {
            destinationTrafficDataTemp[continent.key.replace(/\s/g, '')] = continent.doc_count
          })
          setDestinationTrafficData(destinationTrafficDataTemp)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const getIPSContinentTraffic = () => {

    let destinationIPSTraffic = {}
    let sourceIPSTraffic = {}
    let totalIPSTraffic = {}
    let continents = ["NorthAmerica", "SouthAmerica", "Europe", "Oceania", "Asia", "Africa"]

    axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL + "/firewall/geo/unique/src/ips/continent", {
      "index": "firewall-checkpoint-tarion",
      "gte": reportStartDate + "T00:01:00",
      "lt": reportEndDate + "T00:01:00"
    })
      .then(response => {
        if (response.data.data.data.table) {
          response.data.data.data.table.map(continent => {
            sourceIPSTraffic[continent.key.replace(/\s/g, '')] = continent.doc_count
          })
          axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL + "/firewall/geo/unique/dest/ips/continent", {
            "index": "firewall-checkpoint-tarion",
            "gte": reportStartDate + "T00:01:00",
            "lt": reportEndDate + "T00:01:00"
          })
            .then(response => {
              if (response.data.data.data.table) {
                response.data.data.data.table.map(continent => {
                  destinationIPSTraffic[continent.key.replace(/\s/g, '')] = continent.doc_count
                })
              }
              continents.map(continent => {
                if (sourceIPSTraffic.hasOwnProperty(continent) && destinationIPSTraffic.hasOwnProperty(continent)) {
                  totalIPSTraffic[continent] = sourceIPSTraffic[continent] + destinationIPSTraffic[continent]
                }
                if (sourceIPSTraffic.hasOwnProperty(continent) && destinationIPSTraffic.hasOwnProperty(continent) === false) {
                  totalIPSTraffic[continent] = sourceIPSTraffic[continent]
                }
                if (sourceIPSTraffic.hasOwnProperty(continent) === false && destinationIPSTraffic.hasOwnProperty(continent)) {
                  totalIPSTraffic[continent] = destinationIPSTraffic[continent]
                }
                if (sourceIPSTraffic.hasOwnProperty(continent) === false && destinationIPSTraffic.hasOwnProperty(continent) === false) {
                  totalIPSTraffic[continent] = 0
                }
              })
              setTotalIPSTrafficData(totalIPSTraffic)
            }).catch(error => {
            console.log(error)
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }


  //useEffect to make calls to apis
  useEffect(() => {
    setGlobalTrafficAnalysisData(initialValues)
    getFirewallIPScount()
    getFirewallUniqueSourceIPs()
    getFirewallUniqueDestinationIPs()
    getFirewallUniqueSourceCountries()
    getFirewallUniqueDestinationCountries()
    getSourceContinentTraffic()
    getDestinationContinentTraffic()
    getIPSContinentTraffic()

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
              <div className="w-full h-2/3 flex-col">
                <h1 className="w-full text-4xl text-white text-right pr-5 border-b-gray-400 uppercase border-b">
                  Global Traffic Analysis
                </h1>
                <h2 className="w-full h-1/3 text-sm text-white text-right pr-5 border-b-gray-400">
                  {reportStartDate} - {reportEndDate}
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3 row-span-14 grid grid-cols-12 grid-rows-13 gap-2">
          <div className="col-span-12 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1
                    className="text-4xl text-yellow-500 font-bold">{formatNumber(globalTrafficAnalysisData.total_unique_IPS_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Total IPS</b> Counts</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {globalTrafficAnalysisData.total_unique_IPS_diff_percentage === 0 ?
                        <>
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        </>
                        :
                        globalTrafficAnalysisData.total_unique_IPS_diff_percentage > 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                      }
                      <h1
                        className="text-lg text-white">{globalTrafficAnalysisData.total_unique_IPS_diff_percentage ? globalTrafficAnalysisData.total_unique_IPS_diff_percentage : 0} %</h1>
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
                    className="text-4xl text-yellow-500 font-bold">{formatNumber(globalTrafficAnalysisData.total_unique_src_ip_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Source IP&apos;s</b> Detected</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {globalTrafficAnalysisData.total_unique_src_ip_diff_percentage === 0 ?
                          <>
                            <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                            <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                          </>
                          :
                          parseInt(globalTrafficAnalysisData.total_unique_src_countries_diff_percentage) > 0 ?
                            <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                            :
                            <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                      }
                      <h1
                        className="text-lg text-white">{globalTrafficAnalysisData.total_unique_src_ip_diff_percentage ? globalTrafficAnalysisData.total_unique_src_ip_diff_percentage : 0} %</h1>
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
                    className="text-4xl text-yellow-500 font-bold">{globalTrafficAnalysisData.total_unique_src_countries_count}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Source Countries</b></h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {globalTrafficAnalysisData.total_unique_src_countries_diff_percentage === 0 ?
                          <>
                            <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                            <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                          </>
                          :
                          parseInt(globalTrafficAnalysisData.total_unique_src_countries_diff_percentage) > 0 ?
                            <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                            :
                            <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                      }
                      <h1
                        className="text-lg text-white">{globalTrafficAnalysisData.total_unique_src_countries_diff_percentage ? globalTrafficAnalysisData.total_unique_src_countries_diff_percentage : 0} %</h1>
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
                    className="text-4xl text-yellow-500 font-bold">{formatNumber(globalTrafficAnalysisData.total_unique_dest_ip_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Destination IP&apos;s</b> Detected</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {globalTrafficAnalysisData.total_unique_dest_ip_diff_percentage === 0 ?
                        <>
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        </>
                        :
                        globalTrafficAnalysisData.total_unique_dest_ip_diff_percentage > 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>

                      }
                      <h1
                        className="text-lg text-white">{globalTrafficAnalysisData.total_unique_dest_ip_diff_percentage ? globalTrafficAnalysisData.total_unique_dest_ip_diff_percentage : 0} %</h1>
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
                    className="text-4xl text-yellow-500 font-bold">{globalTrafficAnalysisData ? globalTrafficAnalysisData.total_unique_dest_countries_count : 0}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Destination Countries</b></h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">

                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {globalTrafficAnalysisData.total_unique_dest_countries_diff_percentage === 0?
                          <>
                            <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                            <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                          </>
                          :
                          parseInt(globalTrafficAnalysisData.total_unique_dest_countries_diff_percentage) > 0 ?
                            <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                            :
                            <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                      }
                      <h1
                        className="text-lg text-white">{globalTrafficAnalysisData.total_unique_dest_countries_diff_percentage ? globalTrafficAnalysisData.total_unique_dest_countries_diff_percentage : 0} %</h1>
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