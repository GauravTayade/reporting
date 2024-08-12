import ComponentPieChart from "@/components/charts/ComponentPieChart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp, faCaretUp, faCross, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useState} from "react";
import userContext from "@/context/userContext";
import axios from "axios"
import Swal from "sweetalert2";


const ComponentEndpointProtection = (props) => {

  //get user context data
  const userDataContext = useContext(userContext)
  //get userContext data to get customerId
  const customerId = userDataContext.selectedCustomer.length > 0 ? userDataContext.selectedCustomer[0].customerId : null
  const reportStartDate = userDataContext.reportStartDate ? userDataContext.reportStartDate : null
  const reportEndDate = userDataContext.reportEndDate ? userDataContext.reportEndDate : null
  const employeeId = userDataContext.employeeId ? userDataContext.employeeId : 0
  const reportId = userDataContext.reportId ? userDataContext.reportId : 0

  const initialValues = {
    total_log_counts: 0,
    total_threats_identified: 0,
    total_endpoints_subscription: 0,
    total_trojan_detected: 0,
    total_riskware_detected: 0,
    total_malware_detected: 0,
    total_ransomware_detected: 0,
    total_phishing_detected: 0,
    total_url_filter_detected: 0,
    total_threat_extraction_count: 0,
    total_threat_emulation_count: 0,
    total_log_counts_permitted: 0,
    total_endpoints_subscription_permitted: 0,
    total_trojan_detected_permitted: 0,
    total_riskware_detected_permitted: 0,
    total_malware_detected_permitted: 0,
    total_ransomware_detected_permitted: 0,
    total_phishing_detected_permitted: 0,
    total_url_filter_detected_permitted: 0,
    total_threat_extraction_count_permitted: 0,
    total_threat_emulation_count_permitted: 0
  }

  const [endpointProtectionData, setEndpointProtectionData] = useState(initialValues)
  const [deviceType, setDeviceType] = useState()
  const [endpointProtectionRecommendation, setEndpointProtectionRecommendation] = useState()
  const [endpointProtectionRecommendationList, setEndpointProtectionRecommendationList] = useState([])
  const [isEditable, setIsEditable] = useState(true)

  const getEndpointRecommendation =async ()=>{
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/edr/getEndpointRecommendation",{
      params:{
        crId:reportId,
        category:'endpoint'
      }
    })
      .then(response=>{
        if(response.data.length > 0){
          response.data.map(comment=>{
            let temp = endpointProtectionRecommendationList
            temp.push({
              'comment': comment.comment,
              'category': comment.category,
              'crId': comment.cr_id,
              'employeeId': comment.employee_id
            })
            setEndpointProtectionRecommendationList(temp)
          })
        }
      })
      .catch(error=>{
        console.log(error)
      })
  }

  const handleSaveEndpointRecommendation = () => {
    axios.post(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/edr/saveRecommendation", {
      endpointRecommendations: endpointProtectionRecommendationList
    })
      .then(response => {
        if (response.data.output === false) {
          Swal.fire({
            title: "Error",
            text: "Something went wrong while savin comment",
            icon: "error"
          })
        } else {
          Swal.fire({
            title: "Success",
            text: "Your Comments has been saved successfully",
            icon: "success"
          })
          setIsEditable(!isEditable)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const handleEditEndpointRecommendation = () => {
    setIsEditable(!isEditable)
  }

  const handleEndpointProtectionRecommendation = (e) => {
    setEndpointProtectionRecommendation(e.target.value)
  }

  const addEndpointRecommendation = () => {

    let temp = endpointProtectionRecommendationList
    temp.push({
      'comment': endpointProtectionRecommendation,
      'category': 'endpoint',
      'crId': reportId,
      'employeeId': employeeId
    })
    setEndpointProtectionRecommendationList(temp)
    setEndpointProtectionRecommendation('')
  }

  const handleEndpointProtectionRecommendationRemove = (indexRemove) => {
    setEndpointProtectionRecommendationList(endpointProtectionRecommendationList.filter((recommendation, index) => index !== indexRemove))
  }

  const getEDRDeviceTypes = async () => {
    let deviceTypesTemp = {}
    await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL + "/endpoint/subscriptions", {
      "index": "tarion-checkpointsba"
    })
      .then(response => {
        response.data.data.data.table.map(device => {
          deviceTypesTemp[device.key.replace(/\s/g, '')] = device.device_type_count.value
        })
        setDeviceType(deviceTypesTemp)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const getEDRMetricsData = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/edr/getEDRMetricsData", {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        setEndpointProtectionData(prevState => {
          return {...prevState, total_log_counts: response.data[0].logcount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_endpoints_subscription: response.data[0].edrcount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_trojan_detected: response.data[0].trojancount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_riskware_detected: response.data[0].riskwarecount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_malware_detected: response.data[0].malwarecount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_ransomware_detected: response.data[0].ransomwarecount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_phishing_detected: response.data[0].phishingcount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_url_filter_detected: response.data[0].urlfiltercount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_threat_extraction_count: response.data[0].threatextractioncount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_threat_emulation_count: response.data[0].threatemulationcount}
        })

        setEndpointProtectionData(prevState => {
          return {
            ...prevState,
            total_threats_identified: parseInt(response.data[0].trojancount) + parseInt(response.data[0].urlfiltercount) + parseInt(response.data[0].malwarecount) + parseInt(response.data[0].riskwarecount)
          }
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  const getEDRPermittedMetricsData = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/edr/getEDRMPermittedMtricsData", {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        setEndpointProtectionData(prevState => {
          return {...prevState, total_log_counts_permitted: response.data[0].logcount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_endpoints_subscription_permitted: response.data[0].edrcount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_trojan_detected_permitted: response.data[0].trojancount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_riskware_detected_permitted: response.data[0].riskwarecount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_malware_detected_permitted: response.data[0].malwarecount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_ransomware_detected_permitted: response.data[0].ransomwarecount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_phishing_detected_permitted: response.data[0].phishingcount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_url_filter_detected_permitted: response.data[0].urlfiltercount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_threat_extraction_count_permitted: response.data[0].threatextractioncount}
        })
        setEndpointProtectionData(prevState => {
          return {...prevState, total_threat_emulation_count_permitted: response.data[0].threatemulationcount}
        })
      })
      .catch(error => {
        console.log(error)
      })
  }


  useEffect(() => {

    Promise.all([
      getEDRMetricsData(),
      getEDRDeviceTypes(),
      getEDRPermittedMetricsData(),
      getEndpointRecommendation()
    ])
      .then(() => {
      })
      .catch((error) => {
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
              <div className="w-full h-2/3 flex-col">
                <h1 className="w-full text-4xl text-white text-right pr-5 border-b-gray-400 uppercase border-b">
                  Endpoint Protection
                </h1>
                <h2 className="w-full h-1/3 text-sm text-white text-right pr-5 border-b-gray-400">
                  {reportStartDate} - {reportEndDate}
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3 row-span-14 grid grid-cols-12 grid-rows-14 gap-2">
          <div className="col-span-12 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1
                    className="text-4xl text-yellow-500 font-bold">{endpointProtectionData ? endpointProtectionData.total_endpoints_subscription : 0}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Endpoint</b> Subscriptions</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 row-span-1 px-1">
            <div
              className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black flex items-center justify-center">
              <h1 className="text-xl text-yellow-500 font-bold">Endpoint Highlights</h1>
            </div>
          </div>
          <div className="col-span-12 row-span-2 px-1 gap-1 flex">
            <div className="w-1/2 h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1
                    className="text-4xl text-yellow-500 font-bold">{deviceType && deviceType.hasOwnProperty('Laptop') ? deviceType['Laptop'] : 0}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Laptops</b></h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2 h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1
                    className="text-4xl text-yellow-500 font-bold">{deviceType && deviceType.hasOwnProperty('Desktop') ? deviceType['Desktop'] : 0}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Desktops</b></h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 row-span-2 px-1 gap-1 flex">
            <div className="w-1/2 h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1
                    className="text-4xl text-yellow-500 font-bold">{deviceType && deviceType.hasOwnProperty('MacBookPro18,4') ? deviceType['MacBookPro18,4'] : 0}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>MAC</b></h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2 h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1
                    className="text-4xl text-yellow-500 font-bold">{deviceType && deviceType.hasOwnProperty('Server') ? deviceType['Server'] : 0}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Servers</b></h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
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
                    className="text-4xl text-yellow-500 font-bold">{endpointProtectionData ? endpointProtectionData.total_threat_extraction_count : 0}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Content</b> Extraction</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">

                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">

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
                    className="text-4xl text-yellow-500 font-bold">{endpointProtectionData.total_threat_emulation_count ? endpointProtectionData.total_threat_emulation_count : 0}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Threat</b> Emulation</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-9 row-span-14 grid grid-cols-12 grid-rows-15">
          <div className="col-span-12 row-span-15 px-1">
            <div className="w-full h-full grid grid-rows-12 grid-cols-8 gap-1">
              <div className="col-span-4 row-span-12">
                <div
                  className="w-full h-full p-2 flex items-center justify-center bg-white bg-opacity-5 rounded-lg gap-4">
                  <div className="w-4/12 h-full grid grid-rows-18 grid-cols-2 gap-2">
                    <div className="col-span-2 row-span-3 bg-white/10 text-white shadow">
                      <div className="w-full h-1/2 flex items-center justify-center">
                        <h1 className="text-6xl text-center">
                          <b>{endpointProtectionData.total_threats_identified ? endpointProtectionData.total_threats_identified : 0}</b>
                        </h1>
                      </div>
                      <div className="w-full h-1/2">
                        <h1 className="text-2xl text-center"><b>Threats</b> Detected</h1>
                      </div>
                    </div>
                    <div className="col-span-2 row-span-3 bg-white/10 text-white shadow">
                      <div className="w-full h-full">
                        <div className="h-2/6">
                          <h1 className="text-xl text-center">Trojans</h1>
                        </div>
                        <div className="h-2/6 flex items-center justify-center">
                          <h1
                            className="text-3xl font-semibold">{endpointProtectionData ? endpointProtectionData.total_trojan_detected : 0}<small>/{endpointProtectionData ? endpointProtectionData.total_trojan_detected_permitted : 0}</small>
                          </h1>
                        </div>
                        <div className="h-2/6 flex">

                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 row-span-3 bg-white/10 text-white shadow">
                      <div className="w-full h-full">
                        <div className="h-2/6">
                          <h1 className="text-xl text-center">URL Filtering</h1>
                        </div>
                        <div className="h-2/6 flex items-center justify-center">
                          <h1
                            className="text-3xl font-semibold">{endpointProtectionData ? endpointProtectionData.total_url_filter_detected : 0}<small>/{endpointProtectionData ? endpointProtectionData.total_url_filter_detected_permitted : 0}</small>
                          </h1>
                        </div>
                        <div className="h-2/6 flex">

                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 row-span-3 bg-white/10 text-white shadow">
                      <div className="w-full h-full">
                        <div className="h-2/6">
                          <h1 className="text-xl text-center">Malware</h1>
                        </div>
                        <div className="h-2/6 flex items-center justify-center">
                          <h1
                            className="text-3xl font-semibold">{endpointProtectionData ? endpointProtectionData.total_malware_detected : 0}<small>/{endpointProtectionData ? endpointProtectionData.total_malware_detected_permitted : 0}</small>
                          </h1>
                        </div>
                        <div className="h-2/6 flex">

                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 row-span-3 bg-white/10 text-white shadow">
                      <div className="w-full h-full">
                        <div className="h-2/6">
                          <h1 className="text-xl text-center">Riskware</h1>
                        </div>
                        <div className="h-2/6 flex items-center justify-center">
                          <h1
                            className="text-3xl font-semibold">{endpointProtectionData ? endpointProtectionData.total_riskware_detected : 0}<small>/{endpointProtectionData ? endpointProtectionData.total_riskware_detected_permitted : 0}</small>
                          </h1>
                        </div>
                        <div className="h-2/6 flex">

                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-4/12 h-full grid grid-rows-18 grid-cols-2 gap-2">
                    <div className="col-span-2 row-span-3 bg-white/10 text-white">
                      <div className="w-full h-1/2 flex items-center justify-center">
                        <h1 className="text-6xl text-center"><b>
                          {endpointProtectionData.total_ransomware_detected ? endpointProtectionData.total_ransomware_detected : 0}
                        </b></h1>
                      </div>
                      <div className="w-full h-1/2">
                        <h1 className="text-2xl text-center"><b>Ransomware</b> Remediation</h1>
                      </div>
                    </div>
                    <div className="col-span-2 row-span-3 bg-white/10 text-white shadow">
                      <div className="w-full h-full">
                        <div className="h-2/6">
                          <h1 className="text-xl text-center">Ransomware</h1>
                        </div>
                        <div className="h-2/6 flex items-center justify-center">
                          <h1
                            className="text-3xl font-semibold">{endpointProtectionData ? endpointProtectionData.total_ransomware_detected : 0}<small>/{endpointProtectionData ? endpointProtectionData.total_ransomware_detected_permitted : 0}</small>
                          </h1>
                        </div>
                        <div className="h-2/6 flex">

                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-4/12 h-full grid grid-rows-18 grid-cols-2 gap-2">
                    <div className="col-span-2 row-span-3 bg-white/10 text-white">
                      <div className="w-full h-1/2 flex items-center justify-center">
                        <h1 className="text-6xl text-center"><b>
                          {endpointProtectionData.total_phishing_detected ? endpointProtectionData.total_phishing_detected : 0}</b>
                        </h1>
                      </div>
                      <div className="w-full h-1/2">
                        <h1 className="text-2xl text-center"><b>Other</b> Detections</h1>
                      </div>
                    </div>
                    <div className="col-span-2 row-span-3 bg-white/10 text-white shadow">
                      <div className="w-full h-full">
                        <div className="h-2/6">
                          <h1 className="text-xl text-center">Phishing</h1>
                        </div>
                        <div className="h-2/6 flex items-center justify-center">
                          <h1
                            className="text-3xl font-semibold">{endpointProtectionData ? endpointProtectionData.total_phishing_detected : 0}<small>/{endpointProtectionData ? endpointProtectionData.total_phishing_detected_permitted : 0}</small>
                          </h1>
                        </div>
                        <div className="h-2/6 flex">

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*<div className="col-span-4 row-span-6 text-white">*/}
              {/*  <div*/}
              {/*    className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">*/}
              {/*    <div className="h-1/6 w-full  border-b-gray-400 border-b-2">*/}
              {/*      <h1 className="text-2xl flex items-center justify-center">*/}
              {/*        Threat Indicators <small className="text-sm"></small>*/}
              {/*      </h1>*/}
              {/*    </div>*/}
              {/*    <div className="h-5/6 w-full flex items-center justify-center">*/}
              {/*      <div className="h-full w-full">*/}
              {/*        <div className="w-full h-1/2 flex border-b border-b-gray-400">*/}
              {/*          <div className="h-full w-4/12">*/}
              {/*            <div className="h-2/6 w-full border-b-gray-200 border-b flex items-center justify-center">*/}
              {/*              <h1 className="text-center">Overall Efficiency</h1>*/}
              {/*            </div>*/}
              {/*            <div className="h-4/6 w-full flex items-center justify-center">*/}
              {/*              <h1 className="text-5xl">99%</h1>*/}
              {/*            </div>*/}
              {/*          </div>*/}
              {/*          <div className="w-full h-full pl-8">*/}
              {/*            <ul className="list-disc">*/}
              {/*              <li>*/}
              {/*                Overall Efficiency shows the changes from the initial scan to the current scan.*/}
              {/*              </li>*/}
              {/*            </ul>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*        <div className="w-full h-1/2 flex">*/}
              {/*          <div className="h-full w-4/12">*/}
              {/*            <div className="h-2/6 w-full border-b-gray-200 border-b flex items-center justify-center">*/}
              {/*              <h1 className="text-center">MoM Risk Exposure</h1>*/}
              {/*            </div>*/}
              {/*            <div className="h-4/6 w-full flex items-center justify-center">*/}
              {/*              <h1 className="text-5xl">*/}
              {/*                <small><FontAwesomeIcon icon={faArrowUp} className="text-red-700"/></small>*/}
              {/*                100%*/}
              {/*              </h1>*/}
              {/*            </div>*/}
              {/*          </div>*/}
              {/*          <div className="w-full h-full pl-8">*/}
              {/*            <ul className="list-disc">*/}
              {/*              <li>*/}
              {/*                M2M Exposure (Month to Month) shows exposure changes monthly comparing the current scan*/}
              {/*                to*/}
              {/*                previous scan.*/}
              {/*              </li>*/}
              {/*            </ul>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
              <div className="col-span-4 row-span-12 text-white">
                <div
                  className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                  <div className="h-1/12 w-full border-b-gray-400 border-b-2 flex">
                    {isEditable ?
                      <>
                        <div className="w-11/12 h-full flex items-center justify-center">
                          <h1 className="text-2xl flex items-center justify-center">
                            A2N Recommendations
                          </h1>
                        </div>
                        <div className="w-1/12 h-full flex items-center justify-center p-2">
                          <button className="bg-green-700 px-2 py-1 rounded-lg"
                                  onClick={handleSaveEndpointRecommendation}>Save
                          </button>
                        </div>
                      </>
                      :
                      <>
                        <div className="w-full h-full flex items-center justify-center">
                          <h1 className="text-2xl flex items-center justify-center">
                            A2N Recommendations
                          </h1>
                        </div>
                        <div className="w-1/12 h-full flex items-center justify-center p-2">
                          <button className="bg-green-700 px-2 py-1 rounded-lg"
                                  onClick={handleEditEndpointRecommendation}>Edit
                          </button>
                        </div>
                      </>
                    }
                  </div>
                  <div className="h-5/6 w-full">
                    <div className="w-full h-full">
                      {isEditable ?
                        <div className="w-full h-1/6 flex items-center justify-center">
                          <div className="w-9/12 h-12 px-4 flex items-center justify-center">
                            <input type="text"
                                   value={endpointProtectionRecommendation}
                                   className="w-full px-2 text-gray-800 rounded-lg"
                                   name="endpointProtectionRecommendation"
                                   onChange={handleEndpointProtectionRecommendation}/>
                          </div>
                          <div className="w-3/12 h-12 flex items-center justify-center px-5">
                            <input value="Add" type="button"
                                   className="bg-green-700 rounded-lg w-10/12 py-1 shadow-lg"
                                   onClick={addEndpointRecommendation}/>
                          </div>
                        </div>
                        :
                        ''
                      }
                      <div className="w-full h-5/6 flex items-center justify-center">
                        <div className="w-11/12 h-5/6">
                          <ul className="list-disc">
                            {
                              endpointProtectionRecommendationList.length > 0 ?
                                endpointProtectionRecommendationList.map((recommendation, index) => {
                                  return <div className="flex py-1" key={index}>
                                    <li className="w-11/12">{recommendation.comment}</li>
                                    {isEditable ?
                                      <div className="w-1/12 flex items-center justify-center">
                                        <button onClick={() => handleEndpointProtectionRecommendationRemove(index)}
                                                className="py-1 px-2 bg-white/10">
                                          <FontAwesomeIcon className="text-red-700" icon={faTrashCan}/>
                                        </button>
                                      </div>
                                      :
                                      ''
                                    }
                                  </div>
                                })
                                :
                                ''
                            }
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
      </div>
    </div>
  )

}

export default ComponentEndpointProtection;