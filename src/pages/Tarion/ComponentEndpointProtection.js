import ComponentPieChart from "@/Components/charts/ComponentPieChart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useState} from "react";
import userContext from "@/context/userContext";
import axios from "axios"
import {Editor, EditorState} from "draft-js"
import 'draft-js/dist/Draft.css'


const ComponentEndpointProtection = (props) =>{

  const data ={
    total_log_counts:0,
    total_endpoints_subscription:0,
    total_trojan_detected:0,
    total_riskware_detected:0,
    total_malware_detected:0,
    total_ransomware_detected:0,
    total_phishing_detected:0,
    total_url_filter_detected:0,
    total_threat_extraction_count:0,
    total_threat_emulation_count:0
  }

  const userDataContext = useContext(userContext)
  const customerId = userDataContext.selectedCustomer[0].customerId
  const reportStartDate = userDataContext.selectedCustomer[0].reportStartDate
  const reportEndDate = userDataContext.selectedCustomer[0].reportEndDate

  const [result,setResult] = useState()
  const [deviceType,setDeviceType] = useState()
  const [editorState,setEditorState] = useState(()=>EditorState.createEmpty())

  const getEDRDeviceTypes = async ()=>{
    let deviceTypesTemp={}
    await axios.post("http://10.3.22.37:4434/api/v1/endpoint/subscriptions",{
      "index": "tarion-checkpointsba"
    })
      .then(response=>{
        response.data.data.data.table.map(device=>{
          deviceTypesTemp[device.key.replace(/\s/g, '')] = device.device_type_count.value
        })
        setDeviceType(deviceTypesTemp)
      })
      .catch(error=>{
        console.log(error)
      })
  }

  const getEDRMetricsData = async() => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/edr/getEDRMetricsData",{
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response =>{
        console.log(response)
        data.total_log_counts = response.data[0].logcount
        data.total_endpoints_subscription = response.data[0].edrcount
        data.total_trojan_detected = response.data[0].trojancount
        data.total_riskware_detected = response.data[0].riskwarecount
        data.total_malware_detected = response.data[0].malwarecount
        data.total_ransomware_detected = response.data[0].ransomwarecount
        data.total_phishing_detected = response.data[0].phishingcount
        data.total_url_filter_detected = response.data[0].urlfiltercount
        data.total_threat_extraction_count = response.data[0].threatextractioncount
        data.total_threat_emulation_count = response.data[0].threatemulationcount
      })
      .catch(error=>{
        console.log(error)
      })
  }


  useEffect(() => {
    Promise.all([
      getEDRMetricsData(),
      getEDRDeviceTypes()
    ])
      .then(()=>{
        setResult(data)
      })
      .catch((error)=>{
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
                className="w-full text-4xl text-white text-right pr-5 border-b-gray-400 border-b-2 uppercase">Endpoint Protection</h1>
            </div>
          </div>
        </div>
        <div className="col-span-3 row-span-14 grid grid-cols-12 grid-rows-14 gap-2">
          <div className="col-span-12 row-span-2 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">{result?result.total_endpoints_subscription:0}</h1>
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
                  <h1 className="text-4xl text-yellow-500 font-bold">{deviceType && deviceType.hasOwnProperty('Laptop')?deviceType['Laptop']:0}</h1>
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
                  <h1 className="text-4xl text-yellow-500 font-bold">{deviceType && deviceType.hasOwnProperty('Desktop')?deviceType['Desktop']:0}</h1>
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
                  <h1 className="text-4xl text-yellow-500 font-bold">{deviceType && deviceType.hasOwnProperty('MacBookPro18,4')?deviceType['MacBookPro18,4']:0}</h1>
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
                  <h1 className="text-4xl text-yellow-500 font-bold">{deviceType && deviceType.hasOwnProperty('Server')?deviceType['Server']:0}</h1>
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
                  <h1 className="text-4xl text-yellow-500 font-bold">{result?result.total_threat_extraction_count:0}</h1>
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
                  <h1 className="text-4xl text-yellow-500 font-bold">{result?result.total_threat_emulation_count:0}</h1>
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
                    <div className="col-span-2 row-span-3 bg-pink-800 text-white shadow">
                      <div className="w-full h-1/2 flex items-center justify-center">
                      <h1 className="text-6xl text-center"><b>55</b></h1>
                      </div>
                      <div className="w-full h-1/2">
                        <h1 className="text-2xl text-center"><b>Threats</b> Detected</h1>
                      </div>
                    </div>
                    <div className="col-span-2 row-span-3 bg-pink-800 text-white shadow">
                      <div className="w-full h-full">
                      <div className="h-2/6">
                            <h1 className="text-xl text-center">Trojans</h1>
                          </div>
                          <div className="h-2/6 flex items-center justify-center">
                            <h1 className="text-3xl font-semibold">{result?result.total_trojan_detected:0}<small>/16</small></h1>
                          </div>
                          <div className="h-2/6 flex">
                            <div className="w-1/2 h-full">
                              <div className="w-full h-1/2">
                                <h1 className="font-bold text-sm text-center">MoM Trend</h1>
                              </div>
                              <div className="w-full h-1/2 flex items-center justify-center">
                                <h1 className="text-center"><FontAwesomeIcon icon={faCaretUp}
                                                                             className="text-green-700"/>5.9%
                                </h1>
                              </div>
                            </div>
                            <div className="w-1/2 h-full">
                              <div className="w-full h-1/2">
                                <h1 className="font-bold text-sm text-center">Efficiency</h1>
                              </div>
                              <div className="w-full h-1/2 flex items-center justify-center">
                                <h1 className="text-center"><FontAwesomeIcon icon={faCaretUp}
                                                                             className="text-green-700"/>100%
                                </h1>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 row-span-3 bg-pink-800 text-white shadow">
                        <div className="w-full h-full">
                          <div className="h-2/6">
                            <h1 className="text-xl text-center">URL Filtering</h1>
                          </div>
                          <div className="h-2/6 flex items-center justify-center">
                            <h1 className="text-3xl font-semibold">{result? result.total_url_filter_detected:0}<small>/5739</small></h1>
                          </div>
                          <div className="h-2/6 flex">
                            <div className="w-1/2 h-full">
                              <div className="w-full h-1/2">
                                <h1 className="font-bold text-sm text-center">MoM Trend</h1>
                              </div>
                              <div className="w-full h-1/2 flex items-center justify-center">
                                <h1 className="text-center"><FontAwesomeIcon icon={faCaretUp}
                                                                             className="text-green-700"/>5.9%
                                </h1>
                              </div>
                            </div>
                            <div className="w-1/2 h-full">
                              <div className="w-full h-1/2">
                                <h1 className="font-bold text-sm text-center">Efficiency</h1>
                              </div>
                              <div className="w-full h-1/2 flex items-center justify-center">
                                <h1 className="text-center"><FontAwesomeIcon icon={faCaretUp}
                                                                             className="text-green-700"/>100%
                                </h1>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 row-span-3 bg-pink-800 text-white shadow">
                        <div className="w-full h-full">
                          <div className="h-2/6">
                            <h1 className="text-xl text-center">Malware</h1>
                          </div>
                          <div className="h-2/6 flex items-center justify-center">
                            <h1 className="text-3xl font-semibold">{result? result.total_malware_detected:0}<small>/1</small></h1>
                          </div>
                          <div className="h-2/6 flex">
                            <div className="w-1/2 h-full">
                              <div className="w-full h-1/2">
                                <h1 className="font-bold text-sm text-center">MoM Trend</h1>
                              </div>
                              <div className="w-full h-1/2 flex items-center justify-center">
                                <h1 className="text-center"><FontAwesomeIcon icon={faCaretUp}
                                                                             className="text-green-700"/>5.9%
                                </h1>
                              </div>
                            </div>
                            <div className="w-1/2 h-full">
                              <div className="w-full h-1/2">
                                <h1 className="font-bold text-sm text-center">Efficiency</h1>
                              </div>
                              <div className="w-full h-1/2 flex items-center justify-center">
                                <h1 className="text-center"><FontAwesomeIcon icon={faCaretUp}
                                                                             className="text-green-700"/>100%
                                </h1>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 row-span-3 bg-pink-800 text-white shadow">
                        <div className="w-full h-full">
                          <div className="h-2/6">
                            <h1 className="text-xl text-center">Riskware</h1>
                          </div>
                          <div className="h-2/6 flex items-center justify-center">
                            <h1 className="text-3xl font-semibold">{result? result.total_riskware_detected:0}<small>/1</small></h1>
                          </div>
                          <div className="h-2/6 flex">
                            <div className="w-1/2 h-full">
                              <div className="w-full h-1/2">
                                <h1 className="font-bold text-sm text-center">MoM Trend</h1>
                              </div>
                              <div className="w-full h-1/2 flex items-center justify-center">
                                <h1 className="text-center"><FontAwesomeIcon icon={faCaretUp}
                                                                             className="text-green-700"/>0%
                                </h1>
                              </div>
                            </div>
                            <div className="w-1/2 h-full">
                              <div className="w-full h-1/2">
                                <h1 className="font-bold text-sm text-center">Efficiency</h1>
                              </div>
                              <div className="w-full h-1/2 flex items-center justify-center">
                                <h1 className="text-center"><FontAwesomeIcon icon={faCaretUp}
                                                                             className="text-green-700"/>100%
                                </h1>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-4/12 h-full grid grid-rows-18 grid-cols-2 gap-2">
                      <div className="col-span-2 row-span-3 bg-pink-800 text-white">
                        <div className="w-full h-1/2 flex items-center justify-center">
                          <h1 className="text-6xl text-center"><b>0</b></h1>
                        </div>
                        <div className="w-full h-1/2">
                          <h1 className="text-2xl text-center"><b>Ransomware</b> Remediation</h1>
                        </div>
                      </div>
                      <div className="col-span-2 row-span-3 bg-pink-800 text-white shadow">
                        <div className="w-full h-full">
                          <div className="h-2/6">
                            <h1 className="text-xl text-center">Ransomware</h1>
                          </div>
                          <div className="h-2/6 flex items-center justify-center">
                            <h1 className="text-3xl font-semibold">{result?result.total_ransomware_detected:0}<small>/13</small></h1>
                          </div>
                          <div className="h-2/6 flex">
                            <div className="w-1/2 h-full">
                              <div className="w-full h-1/2">
                                <h1 className="font-bold text-sm text-center">MoM Trend</h1>
                              </div>
                              <div className="w-full h-1/2 flex items-center justify-center">
                                <h1 className="text-center"><FontAwesomeIcon icon={faCaretUp}
                                                                             className="text-green-700"/>5.9%
                                </h1>
                              </div>
                            </div>
                            <div className="w-1/2 h-full">
                              <div className="w-full h-1/2">
                                <h1 className="font-bold text-sm text-center">Efficiency</h1>
                              </div>
                              <div className="w-full h-1/2 flex items-center justify-center">
                                <h1 className="text-center"><FontAwesomeIcon icon={faCaretUp}
                                                                             className="text-green-700"/>100%
                                </h1>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-4/12 h-full grid grid-rows-18 grid-cols-2 gap-2">
                      <div className="col-span-2 row-span-3 bg-pink-800 text-white">
                        <div className="w-full h-1/2 flex items-center justify-center">
                          <h1 className="text-6xl text-center"><b>2</b></h1>
                        </div>
                        <div className="w-full h-1/2">
                          <h1 className="text-2xl text-center"><b>Other</b> Detections</h1>
                        </div>
                      </div>
                      <div className="col-span-2 row-span-3 bg-pink-800 text-white shadow">
                        <div className="w-full h-full">
                          <div className="h-2/6">
                            <h1 className="text-xl text-center">Phishing</h1>
                          </div>
                          <div className="h-2/6 flex items-center justify-center">
                            <h1 className="text-3xl font-semibold">{result? result.total_phishing_detected: 0}<small>/13</small></h1>
                          </div>
                          <div className="h-2/6 flex">
                            <div className="w-1/2 h-full">
                              <div className="w-full h-1/2">
                                <h1 className="font-bold text-sm text-center">MoM Trend</h1>
                              </div>
                              <div className="w-full h-1/2 flex items-center justify-center">
                                <h1 className="text-center"><FontAwesomeIcon icon={faCaretUp}
                                                                             className="text-green-700"/>5.9%
                                </h1>
                              </div>
                            </div>
                            <div className="w-1/2 h-full">
                              <div className="w-full h-1/2">
                                <h1 className="font-bold text-sm text-center">Efficiency</h1>
                              </div>
                              <div className="w-full h-1/2 flex items-center justify-center">
                                <h1 className="text-center"><FontAwesomeIcon icon={faCaretUp}
                                                                             className="text-green-700"/>100%
                                </h1>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-4 row-span-6 text-white">
                  <div
                    className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                    <div className="h-1/6 w-full  border-b-gray-400 border-b-2">
                      <h1 className="text-2xl flex items-center justify-center">
                        Threat Indicators <small className="text-sm"></small>
                      </h1>
                    </div>
                    <div className="h-5/6 w-full flex items-center justify-center">
                      <div className="h-full w-full">
                        <div className="w-full h-1/2 flex border-b border-b-gray-400">
                          <div className="h-full w-4/12">
                            <div className="h-2/6 w-full border-b-gray-200 border-b flex items-center justify-center">
                              <h1 className="text-center">Overall Efficiency</h1>
                            </div>
                            <div className="h-4/6 w-full flex items-center justify-center">
                              <h1 className="text-5xl">99%</h1>
                            </div>
                          </div>
                          <div className="w-full h-full pl-8">
                            <ul className="list-disc">
                              <li>
                                Overall Efficiency shows the changes from the initial scan to the current scan.
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="w-full h-1/2 flex">
                          <div className="h-full w-4/12">
                            <div className="h-2/6 w-full border-b-gray-200 border-b flex items-center justify-center">
                              <h1 className="text-center">MoM Risk Exposure</h1>
                            </div>
                            <div className="h-4/6 w-full flex items-center justify-center">
                              <h1 className="text-5xl">
                                <small><FontAwesomeIcon icon={faArrowUp} className="text-red-700"/></small>
                                100%
                              </h1>
                            </div>
                          </div>
                          <div className="w-full h-full pl-8">
                            <ul className="list-disc">
                              <li>
                                M2M Exposure (Month to Month) shows exposure changes monthly comparing the current scan
                                to
                                previous scan.
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-4 row-span-6 text-white">
                  <div
                    className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                    <div className="h-1/6 w-full border-b-gray-400 border-b-2">
                      <h1 className="text-2xl flex items-center justify-center">
                        A2N Recommendations
                      </h1>
                    </div>
                    <div className="h-5/6 w-full">
                      <div className="w-full h-full">
                        <Editor editorState={editorState} onChange={setEditorState} userSelect="none" contentEditable={false} />
                        {/*<ul className="list-disc p-5">*/}
                        {/*  <li>We have observed an upward trend on the total log ingestion.</li>*/}
                        {/*  <li>We observed the use of attack type “Apache OFBiz Authentication Bypass (CVE-2023-51467)”*/}
                        {/*    is*/}
                        {/*    in a rise.*/}
                        {/*  </li>*/}
                        {/*  <li>General recommendation will be to upgrade Apache OFBiz software to version 18.12.11, If it*/}
                        {/*    exists on your network and if not done already.*/}
                        {/*  </li>*/}
                        {/*  <li>We recommend blocking these exploits on IPS if it is not required for operational*/}
                        {/*    purposes.*/}
                        {/*  </li>*/}
                        {/*  <li>A2N recommends to block all the malicious IP.</li>*/}
                        {/*</ul>*/}
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