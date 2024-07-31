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
import {useContext, useState, useEffect, useRef} from "react";
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
import {Result} from "postcss";

const ComponentDataSource = (props) => {

  const router = useRouter()
  const userDataContext = useContext(userContext)

  //get userContext data to get customerId
  const customerId = userDataContext.selectedCustomer[0].customerId
  const reportStartDate = userDataContext.selectedCustomer[0].reportStartDate
  const reportEndDate = userDataContext.selectedCustomer[0].reportEndDate

  //to store all api call values once useEffect has completed
  const resultInitialValues = {
    customer_firewall_data : 0,
    customer_endpoint_data : 0,
    customer_edr_data : 0,
    customer_nac_data : 0,
    customer_va_data : 0,
    customer_total_devices_count: 0,
    customer_total_devices_log_count : 0,
    customer_total_devices_count_prev: 0,
    customer_total_devices_log_count_prev: 0,
  }

  const [result, setResult] = useState(resultInitialValues)

  //get client firewalls count and logs count
  const getCustomerFirewalls = async () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getFirewallDataSourceDetails", {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        if (response.data) {
          setResult({
            ...result,
            customer_firewall_data: response.data,
            customer_total_devices_count: response.data[0].firewallcount,
            customer_total_devices_log_count: response.data[0].totallogs
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })

    //calculate new date range based on current date range difference.
    const prevDateRange = getNewDateRange(reportStartDate, reportEndDate)

    //get previous month log count
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getFirewallDataSourceDetails", {
      params: {
        customerId: customerId,
        startDate: prevDateRange.newStartDate,
        endDate: prevDateRange.newEndDate
      }
    })
      .then(response => {
        if (response.data) {

        }
      })
      .catch((error) => {
        console.log(error)
      })

  }
  //get client servers count and logs count
  const getCustomerEndpoints = async () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/endpoint/getEndpointDatSourceDetails", {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        if (response.data) {
          setResult(prevResult => {
            return {
              ...prevResult,
              customer_endpoint_data: response.data,
              customer_total_devices_count: response.data[0].endpointcount,
              customer_total_devices_log_count: response.data[0].totallogs
            }
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })

    //calculate new date range based on current date range difference.
    const prevDateRange = getNewDateRange(reportStartDate, reportEndDate)

    //get previous month log count
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/endpoint/getEndpointDatSourceDetails", {
      params: {
        customerId: customerId,
        startDate: prevDateRange.newStartDate,
        endDate: prevDateRange.newEndDate
      }
    })
      .then(response => {
        if (response.data) {

        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get client edr count and logs count
  const getCustomerEDR = async () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/edr/getEDRDataSourceDetails", {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        if (response.data) {
          setResult(prevResult => {
            return {
              ...prevResult,
              customer_edr_data: response.data,
              customer_total_devices_count: response.data[0].edrcount,
              customer_total_devices_log_count: response.data[0].totallogs
            }
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })

    //calculate new date range based on current date range difference.
    const prevDateRange = getNewDateRange(reportStartDate, reportEndDate)

    //get previous month log count
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/edr/getEDRDataSourceDetails", {
      params: {
        customerId: customerId,
        startDate: prevDateRange.newStartDate,
        endDate: prevDateRange.newEndDate
      }
    })
      .then(response => {
        if (response.data) {

        }
      })
      .catch((error) => {
        console.log(error)
      })

  }

  //get client NAC count and logs count
  const getCustomerNAC = async () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/nac/getNACDataSourceDetails", {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        if (response.data) {
          setResult(prevResult => {return {...prevResult,customer_nac_data: response.data}})
        }
      })
      .catch((error) => {
        console.log(error)
      })

    //calculate new date range based on current date range difference.
    const prevDateRange = getNewDateRange(reportStartDate, reportEndDate)

    //get previous month log count
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/nac/getNACDataSourceDetails", {
      params: {
        customerId: customerId,
        startDate: prevDateRange.newStartDate,
        endDate: prevDateRange.newEndDate
      }
    })
      .then(response => {
        if (response.data) {

        }
      })
      .catch((error) => {
        console.log(error)
      })

  }

  //get client va scan count
  const getCustomerVAScan = async () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/endpoint/getVAScanDataSourceDetails", {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        if (response.data) {
          setResult(prevResult => {return {...prevResult,customer_va_data:response.data }})
        }
      })
      .catch(error => {

      })

    //calculate new date range based on current date range difference.
    const prevDateRange = getNewDateRange(reportStartDate, reportEndDate)

    //get previous month log count
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/endpoint/getVAScanDataSourceDetails", {
      params: {
        customerId: customerId,
        startDate: prevDateRange.newStartDate,
        endDate: prevDateRange.newEndDate
      }
    })
      .then(response => {
        if (response.data) {

        }
      })
      .catch((error) => {
        console.log(error)
      })

  }

  //get difference of devices count
  const getDevicesDifference = async () => {
    // data.customer_total_devices_count_diff_percentage = getPercentageDifference(totalDevices, totalDevicesPrev)
  }

  const getTotalLogsDifference = async () => {
    // data.customer_total_devices_logs_count_diff_percentage = getPercentageDifference(totalLogs, totalLogsPrev)
  }

  useEffect(() => {
    Promise.all([
      getCustomerFirewalls(),
      getCustomerEndpoints(),
      getCustomerEDR(),
      getCustomerNAC(),
      getCustomerVAScan()
    ])
      .then(() => {

      })
      .catch(error => {
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
                className="w-full text-4xl text-white text-right pr-5 border-b-gray-400 border-b-2 uppercase">Data
                Source</h1>
            </div>
          </div>
        </div>
        <div className="col-span-3 row-span-14 grid grid-cols-12 grid-rows-13 gap-2">
          <div className="col-span-12 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">298</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Data</b> Sources</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">

                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {result.customer_total_devices_count_diff_percentage ?
                        result.customer_total_devices_count_diff_percentage >= 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{result.customer_total_devices_count_diff_percentage ? result.customer_total_devices_count_diff_percentage : 0} %</h1>
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
                  <h1 className="text-4xl text-yellow-500 font-bold">9348</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Total Logs</b> Analyzed</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">

                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {result.customer_total_devices_logs_count_diff_percentage ?
                        result.customer_total_devices_logs_count_diff_percentage >= 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{result.customer_total_devices_logs_count_diff_percentage ? result.customer_total_devices_logs_count_diff_percentage : 0} %</h1>
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
                  <h1 className="text-4xl text-yellow-500 font-bold">609</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Alerts</b> Generated</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                      <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretUp}/>
                      <h1 className="text-lg text-white">19.4 %</h1>
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      <h1 className="text-lg text-white">{new Intl.NumberFormat('en', {
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
          <div className="col-span-12 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">0</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Critical</b> Advisories</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                      <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretUp}/>
                      <h1 className="text-lg text-white">19.4 %</h1>
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      <h1 className="text-lg text-white">{new Intl.NumberFormat('en', {
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
              {result.customer_firewall_data ?
                result.customer_firewall_data.map(firewall => {
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

              {result.customer_endpoint_data ?
                result.customer_endpoint_data.map(endpoint => {
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

              {result.customer_edr_data ?
                result.customer_edr_data.map(edr => {
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

              {result.customer_nac_data ?
                result.customer_nac_data.map(nac => {
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

              {result.customer_va_data ?
                result.customer_va_data.map(va => {
                  return (
                    <>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">
                        <FontAwesomeIcon className="text-4xl" icon={faMagnifyingGlass}/>
                      </div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">VA
                        SCAN
                      </div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{va.vendor}</div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{result.customer_va_data.length}</div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{formatNumber(va.ivacount + va.evacount)}</div>
                    </>
                  )
                })
                :
                ''
              }

              {result.customer_total_devices_count && result.customer_total_devices_log_count ?
                <>
                  <div
                    className="col-span-6 row-span-1 bg-white/10 flex items-center justify-center font-semibold text-xl">Total
                  </div>
                  <div
                    className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center font-semibold text-xl">{result.customer_total_devices_count}</div>
                  <div
                    className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center font-semibold text-xl">{formatNumber(result.customer_total_devices_log_count)}</div>
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