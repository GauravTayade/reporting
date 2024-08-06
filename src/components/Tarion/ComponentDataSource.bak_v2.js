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
import {useContext, useState, useEffect} from "react";
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

  const initialValues = {
    total_customer_firewall_data: 0,
    total_customer_endpoint_data: 0,
    total_customer_edr_data: 0,
    total_customer_nac_data: 0,
    total_customer_va_data: 0,
    total_customer_total_devices_count: 0,
    total_customer_total_devices_count_prev: 0,
    total_customer_total_devices_log_count: 0,
    total_customer_total_devices_log_count_prev: 0,
    total_customer_total_devices_count_diff_percentage: 0,
    total_customer_total_devices_log_count_diff_percentage: 0
  }

  const [datasourceData, setDatasourceData] = useState(initialValues)
  const [totalDeviceDiffPercentage, setTotalDeviceDiffPercentage] = useState(0);
  const [totalDeviceLogCountDiffPercentage, setTotalDeviceLogCountDiffPercentage] = useState(0);

  //get user context data
  const userDataContext = useContext(userContext)
  //get userContext data to get customerId
  const customerId = userDataContext.selectedCustomer.length > 0 ? userDataContext.selectedCustomer[0].customerId : null
  const reportStartDate = userDataContext.reportStartDate ? userDataContext.reportStartDate : null
  const reportEndDate = userDataContext.reportEndDate ? userDataContext.reportEndDate : null


  //get client firewalls count and logs count
  const getCustomerFirewalls = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getFirewallDataSourceDetails", {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(async response => {
        if (response.data) {
          setDatasourceData(prevState => {
            return {...prevState, total_customer_firewall_data: response.data}
          })
          setDatasourceData(prevState => {
            return {
              ...prevState,
              total_customer_total_devices_count: parseInt(prevState.total_customer_total_devices_count) + parseInt(response.data[0].firewallcount)
            }
          })
          setDatasourceData(prevState => {
            return {
              ...prevState,
              total_customer_total_devices_log_count: parseInt(prevState.total_customer_total_devices_log_count) + parseInt(response.data[0].totallogs)
            }
          })

          //calculate new date range based on current date range difference.
          const prevDateRange = getNewDateRange(reportStartDate, reportEndDate)

          //get previous month log count
          await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getFirewallDataSourceDetails", {
            params: {
              customerId: customerId,
              startDate: prevDateRange.newStartDate,
              endDate: prevDateRange.newEndDate
            }
          })
            .then(prevResponse => {
              if (prevResponse.data) {
                setDatasourceData(prevState => {
                  return {
                    ...prevState,
                    total_customer_total_devices_count_prev: parseInt(prevState.total_customer_total_devices_count_prev) + parseInt(prevResponse.data[0].firewallcount)
                  }
                })
                setDatasourceData(prevState => {
                  return {
                    ...prevState,
                    total_customer_total_devices_log_count_prev: parseInt(prevState.total_customer_total_devices_log_count_prev) + parseInt(prevResponse.data[0].totallogs)
                  }
                })
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
      .catch((error) => {
        console.log(error)
      })

  }

  //get client servers count and logs count
  const getCustomerEndpoints = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/endpoint/getEndpointDatSourceDetails", {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        if (response.data) {
          setDatasourceData(prevState => {
            return {...prevState, total_customer_endpoint_data: response.data}
          })
          setDatasourceData(prevState => {
            return {
              ...prevState,
              total_customer_total_devices_count: parseInt(prevState.total_customer_total_devices_count) + parseInt(response.data[0].endpointcount)
            }
          })
          setDatasourceData(prevState => {
            return {
              ...prevState,
              total_customer_total_devices_log_count: parseInt(prevState.total_customer_total_devices_log_count) + parseInt(response.data[0].totallogs)
            }
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
            .then(prevResponse => {
              if (prevResponse.data) {
                setDatasourceData(prevState => {
                  return {
                    ...prevState,
                    total_customer_total_devices_count_prev: parseInt(prevState.total_customer_total_devices_count_prev) + parseInt(prevResponse.data[0].endpointcount)
                  }
                })
                setDatasourceData(prevState => {
                  return {
                    ...prevState,
                    total_customer_total_devices_log_count_prev: parseInt(prevState.total_customer_total_devices_log_count_prev) + parseInt(prevResponse.data[0].totallogs)
                  }
                })
              }
            })
            .catch((error) => {
              console.log(error)
            })

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
          setDatasourceData(prevState => {
            return {...prevState, total_customer_nac_data: response.data}
          })
          setDatasourceData(prevState => {
            return {
              ...prevState,
              total_customer_total_devices_count: parseInt(prevState.total_customer_total_devices_count) + parseInt(response.data[0].naccount)
            }
          })
          setDatasourceData(prevState => {
            return {
              ...prevState,
              total_customer_total_devices_log_count: parseInt(prevState.total_customer_total_devices_log_count) + parseInt(response.data[0].totallogs)
            }
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
            .then(prevResponse => {
              if (prevResponse.data) {
                setDatasourceData(prevState => {
                  return {
                    ...prevState,
                    total_customer_total_devices_count_prev: parseInt(prevState.total_customer_total_devices_count_prev) + parseInt(prevResponse.data[0].naccount)
                  }
                })
                setDatasourceData(prevState => {
                  return {
                    ...prevState,
                    total_customer_total_devices_log_count_prev: parseInt(prevState.total_customer_total_devices_log_count_prev) + parseInt(prevResponse.data[0].totallogs)
                  }
                })
              }
            })
            .catch((error) => {
              console.log(error)
            })
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
          setDatasourceData(prevState => {
            return {...prevState, total_customer_edr_data: response.data}
          })
          setDatasourceData(prevState => {
            return {
              ...prevState,
              total_customer_total_devices_count: parseInt(prevState.total_customer_total_devices_count) + parseInt(response.data[0].edrcount)
            }
          })
          setDatasourceData(prevState => {
            return {
              ...prevState,
              total_customer_total_devices_log_count: parseInt(prevState.total_customer_total_devices_log_count) + parseInt(response.data[0].totallogs)
            }
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
            .then(prevResponse => {
              if (prevResponse.data) {
                setDatasourceData(prevState => {
                  return {
                    ...prevState,
                    total_customer_total_devices_count_prev: parseInt(prevState.total_customer_total_devices_count_prev) + parseInt(prevResponse.data[0].edrcount)
                  }
                })
                setDatasourceData(prevState => {
                  return {
                    ...prevState,
                    total_customer_total_devices_log_count_prev: parseInt(prevState.total_customer_total_devices_log_count_prev) + parseInt(prevResponse.data[0].totallogs)
                  }
                })
              }
            })
            .catch((error) => {
              console.log(error)
            })
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
          setDatasourceData(prevState => {
            return {...prevState, total_customer_va_data: response.data}
          })
          setDatasourceData(prevState => {
            return {
              ...prevState,
              total_customer_total_devices_count: parseInt(prevState.total_customer_total_devices_count) + parseInt(response.data.length)
            }
          })
          setDatasourceData(prevState => {
            return {
              ...prevState,
              total_customer_total_devices_log_count: parseInt(prevState.total_customer_total_devices_log_count) + parseInt(response.data[0].evacount) + parseInt(response.data[0].ivacount)
            }
          })
        }
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
          .then(prevResponse => {
            if (prevResponse.data) {
              setDatasourceData(prevState => {
                return {
                  ...prevState,
                  total_customer_total_devices_count_prev: parseInt(prevState.total_customer_total_devices_count_prev) + parseInt(prevResponse.data.length)
                }
              })
              setDatasourceData(prevState => {
                return {
                  ...prevState,
                  total_customer_total_devices_log_count_prev: parseInt(prevState.total_customer_total_devices_log_count_prev) + parseInt(prevResponse.data[0].evacount) + parseInt(prevResponse.data[0].ivacount)
                }
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      })
      .catch(error => {

      })

  }

  //get difference of devices count
  const getDevicesDifference = async () => {
    await getPercentageDifference(datasourceData.total_customer_total_devices_count, datasourceData.total_customer_total_devices_count_prev).then(result => {
      setTotalDeviceDiffPercentage(result)
    })
  }

  const getTotalLogsDifference = async () => {
    await getPercentageDifference(datasourceData.total_customer_total_devices_log_count, datasourceData.total_customer_total_devices_log_count_prev).then(result => {
      setTotalDeviceLogCountDiffPercentage(result)
    })
  }

  useEffect(() => {

    setDatasourceData(initialValues)
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

      })

  }, []);

  useEffect(() => {
    getDevicesDifference(),
      getTotalLogsDifference()
  }, [datasourceData]);

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
                  Data Sources
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
                    className="text-4xl text-yellow-500 font-bold">{datasourceData.total_customer_total_devices_count}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Data</b> Sources</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">

                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {totalDeviceDiffPercentage ?
                        totalDeviceDiffPercentage >= 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{totalDeviceDiffPercentage ? totalDeviceDiffPercentage : 0} %</h1>
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
                    className="text-4xl text-yellow-500 font-bold">{formatNumber(datasourceData.total_customer_total_devices_log_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Total Logs</b> Analyzed</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">

                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {totalDeviceLogCountDiffPercentage ?
                        totalDeviceLogCountDiffPercentage >= 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        :
                        ''
                      }
                      <h1
                        className="text-lg text-white">{totalDeviceLogCountDiffPercentage ? totalDeviceLogCountDiffPercentage : 0} %</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-9 row-span-12 grid grid-cols-12 grid-rows-13">
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
              {datasourceData.total_customer_firewall_data ?
                datasourceData.total_customer_firewall_data.map(firewall => {
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

              {datasourceData.total_customer_endpoint_data ?
                datasourceData.total_customer_endpoint_data.map(endpoint => {
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

              {datasourceData.total_customer_edr_data ?
                datasourceData.total_customer_edr_data.map(edr => {
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

              {datasourceData.total_customer_nac_data ?
                datasourceData.total_customer_nac_data.map(nac => {
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
              {datasourceData.total_customer_va_data ?
                datasourceData.total_customer_va_data.map(va => {
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
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{datasourceData.total_customer_va_data.length}</div>
                      <div
                        className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center border-b-white border-b-2">{formatNumber(va.ivacount + va.evacount)}</div>
                    </>
                  )
                })
                :
                ''
              }

              {datasourceData.total_customer_total_devices_count && datasourceData.total_customer_total_devices_log_count ?
                <>
                  <div
                    className="col-span-6 row-span-1 bg-white/10 flex items-center justify-center font-semibold text-xl">Total
                  </div>
                  <div
                    className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center font-semibold text-xl">{datasourceData.total_customer_total_devices_count}</div>
                  <div
                    className="col-span-2 row-span-1 bg-white/10 flex items-center justify-center font-semibold text-xl">{formatNumber(datasourceData.total_customer_total_devices_log_count)}</div>
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
        <div className="col-span-9 row-span-2 bg-green-200">

        </div>
      </div>
    </div>
  )
}

export default ComponentDataSource;
