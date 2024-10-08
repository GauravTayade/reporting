import ComponentPieChart from "@/components/charts/ComponentPieChart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretUp, faCaretDown, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import userContext from "@/context/userContext";
import {
  chartBackgroundColorsListOpacity40,
  chartBackgroundColorsList,
  chartBackgroundColorsListOpacity60,
  formatNumber,
  getPercentageDifference,
  getNewDateRange, getAverageLogsPerDay, getAverageLogsPerMinuts
} from '@/Utilities/Utilities'
import Swal from "sweetalert2";
import ReportContext from "@/context/ReportContext";
import {useSession} from "next-auth/react";

const ComponentAnalyzingGateway = (props) => {


  const {reportContextData, setReportContextData} = useContext(ReportContext)

  const {data:sessionData,status} = useSession()

  //get userContext data to get customerId
  const customerId = reportContextData.selectedCustomer.length > 0 ? reportContextData.selectedCustomer[0].customerId : null
  const reportStartDate = reportContextData.reportStartDate ? reportContextData.reportStartDate : null
  const reportEndDate = reportContextData.reportEndDate ? reportContextData.reportEndDate : null
  const previousReportStartDate = reportContextData.previousReportStartDate ? reportContextData.previousReportStartDate : null
  const previousReportEndDate = reportContextData.previousReportEndDate ? reportContextData.previousReportEndDate : null
  const employeeId = reportContextData.employeeId ? reportContextData.employeeId : 0
  const reportId = reportContextData.reportId ? reportContextData.reportId : 0

  //useState variables to store state data
  const [result, setResult] = useState({})
  const [pieActiveBlades, setPieActiveBlades] = useState()
  const [pieActiveBladesCount, setPieActiveBladesCount] = useState()
  const [pieExternalThreats, setPieExternalThreats] = useState()
  const [pieExternalThreatsCount, setPieExternalThreatsCount] = useState()
  const [ipsHitsAnalysis, setIPsHitsAnalysis] = useState([])

  const initialValues = {
    total_firewall_subscription_count:0,
    total_firewall_log_ingestion_count:0,
    total_firewall_log_ingestion_count_per_day:0,
    total_firewall_log_ingestion_count_per_minute:0,
    total_firewall_log_ingestion_count_diff_percentage:0,
    total_firewall_log_allowed_count:0,
    total_firewall_log_allowed_count_dff_percentage:0,
    total_firewall_log_denied_count:0,
    total_firewall_log_denied_count_diff_percentage:0,
    total_firewall_log_IPS_count:0,
    total_firewall_log_IPS_count_diff_percentage:0,
    total_firewall_log_admin_activities_count:0,
    total_firewall_log_admin_activities_count_diff_percentage:0,
    total_firewall_active_blade_count:0,
    total_firewall_external_threat_data:0
  }

  const [analyzingGatewayData, setAnalyzingGatewayData] = useState(initialValues)
  const [gatewayRecommendation, setGatewayRecommendation] = useState()
  const [gatewayRecommendationList, setGatewayRecommendationList] = useState([])
  const [isEditable, setIsEditable] = useState(false)

  //initial values of variables
  let data = {
    total_top_active_threats: [],
    active_blades: [],
    active_blades_count: [],
    top_external_threats: [],
    top_external_threats_count: [],
    top_ips_hits_analysis: [],
    top_external_threats_data:[]
  }

  const getGatewayRecommendation =()=>{

    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/edr/getEndpointRecommendation",{
      params:{
        crId:reportId,
        category:'gateway'
      }
    })
      .then(response=>{
        setGatewayRecommendationList([])
        if(response.data.length > 0){
          const temp = []
          response.data.map(comment=>{
            temp.push({
              'comment': comment.comment,
              'category': comment.category,
              'crId': comment.crc_id,
              'employeeId': comment.employee_id
            })
          })
          setGatewayRecommendationList(temp)
        }
      })
      .catch(error=>{
        console.log(error)
      })
  }

  const handleSaveGatewayRecommendation = () => {

    if(gatewayRecommendationList.length > 0){
      axios.post(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/saveRecommendation", {
        gatewayRecommendation: gatewayRecommendationList
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
    }else{
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Please Enter Recommendation to save",
        showConfirmButton: false,
        timer: 2000
      });
    }
  }

  const handleEditGatewayRecommendation = () => {
      setIsEditable(!isEditable)
  }

  const handleGatewayRecommendation = (e) => {
    setGatewayRecommendation(e.target.value)
  }

  const addGatewayRecommendation = () => {

    let temp = gatewayRecommendationList
    temp.push({
      'comment': gatewayRecommendation,
      'category': 'gateway',
      'crId': reportId,
      'employeeId': employeeId
    })
    setGatewayRecommendationList(temp)
    setGatewayRecommendation('')
  }

  const handleGatewayRecommendationRemove = (indexRemove) => {
    setGatewayRecommendationList(gatewayRecommendationList.filter((recommendation, index) => index !== indexRemove))
  }

  const getFirewallSubscriptionCount = () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallCount', {
      params: {
        customerId: customerId,
      }
    })
      .then(response => {
        setAnalyzingGatewayData( prevState => {return{...prevState,total_firewall_subscription_count:response.data[0].clientfirewallcount}})
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getFirewallTotalLogIngestion = () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallTotalLogCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(response => {
        setAnalyzingGatewayData(prevState => {return{...prevState,total_firewall_log_ingestion_count:response.data[0].logcount}})

        getAverageLogsPerDay(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          setAnalyzingGatewayData(prevState => {return{...prevState,total_firewall_log_ingestion_count_per_day:result}})
        })

        getAverageLogsPerMinuts(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          setAnalyzingGatewayData(prevState => {return{...prevState,total_firewall_log_ingestion_count_per_minute: result}})
        })

        //calculate new date range based on current date range difference.
        //const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)
        //get previous month log count
        axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallTotalLogCount', {
          params: {
            customerId: customerId,
            startDate: previousReportStartDate,
            endDate: previousReportEndDate
          }
        })
          .then(prevResponse => {
            //get percentage diff and set it to result
            getPercentageDifference(response.data[0].logcount,prevResponse.data[0].logcount).then(result=>{
              setAnalyzingGatewayData(prevState => {return{...prevState,total_firewall_log_ingestion_count_diff_percentage: result}})
            })
          })
          .catch((error) => {
            console.log(error)
          })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getFirewallTotalAllowedLogIngestion = () => {

    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getClientFirewallList", {
      params: {
        customerId: customerId
      }
    })
      .then((response) => {
        let firewallList = new Set()
        if (response.data) {
          response.data.map(async (firewall) => {
            firewallList.add(firewall.id);
          })
        }
        firewallList = [...firewallList].join(",")
        axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallAllowedTrafficCount', {
          params: {
            firewallId: firewallList,
            startDate: reportStartDate,
            endDate: reportEndDate
          }
        })
          .then(response => {
            setAnalyzingGatewayData(prevState => {return{...prevState,total_firewall_log_allowed_count: response.data[0].allowedtraffic}})

            //calculate new date range based on current date range difference.
            //const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)
            //get previous month log count
            axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallAllowedTrafficCount', {
              params: {
                firewallId: firewallList,
                startDate: previousReportStartDate,
                endDate: previousReportEndDate
              }
            })
              .then(prevResponse => {
                //get percentage diff and set it to result
                getPercentageDifference(response.data[0].allowedtraffic,prevResponse.data[0].allowedtraffic).then(result=>{
                  setAnalyzingGatewayData(prevState => {return{...prevState,total_firewall_log_allowed_count_dff_percentage: result}})
                })
              })
              .catch((error) => {
                console.log(error)
              })
          })
          .catch((error) => {
            console.log(error)
          })
      })
  }

  const getFirewallTotalDeniedLogIngestion = () => {

    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getClientFirewallList", {
      params: {
        customerId: customerId
      }
    })
      .then((response) => {
        let firewallList = new Set()
        if (response.data) {
          response.data.map(async (firewall) => {
            firewallList.add(firewall.id);
          })
        }
        firewallList = [...firewallList].join(",")
        axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallDeniedTrafficCount', {
          params: {
            firewallId: firewallList,
            interval: 30,
            startDate: reportStartDate,
            endDate: reportEndDate
          }
        })
          .then(response => {
            setAnalyzingGatewayData(prevState => {return{...prevState,total_firewall_log_denied_count:response.data[0].deniedtraffic}})
            //calculate new date range based on current date range difference.
            //const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

            //get previous month log count
            axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallDeniedTrafficCount', {
              params: {
                firewallId: firewallList,
                interval: 30,
                startDate: previousReportStartDate,
                endDate: previousReportEndDate
              }
            })
              .then(prevResponse => {
                //get percentage diff and set it to result
                getPercentageDifference(response.data[0].deniedtraffic,prevResponse.data[0].deniedtraffic).then(result=>{
                  setAnalyzingGatewayData(prevState => {return{...prevState,total_firewall_log_denied_count_diff_percentage: result}})
                })
              })
              .catch((error) => {
                console.log(error)
              })
          })
          .catch((error) => {
            console.log(error)
          })
      })
  }

  const getFirewallTotalIPSTrafficLogIngestion =  () => {

    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getClientFirewallList", {
      params: {
        customerId: customerId
      }
    })
      .then((response) => {
        let firewallList = new Set()
        if (response.data) {
          response.data.map(async (firewall) => {
            firewallList.add(firewall.id);
          })
        }
        firewallList = [...firewallList].join(",")
        axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallIPSTrafficCount', {
          params: {
            firewallId: firewallList,
            startDate: reportStartDate,
            endDate: reportEndDate
          }
        })
          .then(response => {

            setAnalyzingGatewayData(prevState => {return{...prevState,total_firewall_log_IPS_count:response.data[0].ipstrafficcount}})

            //calculate new date range based on current date range difference.
            //const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

            //get previous month log count
            axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallIPSTrafficCount', {
              params: {
                firewallId: firewallList,
                startDate: previousReportStartDate,
                endDate: previousReportEndDate
              }
            })
              .then(prevResponse => {
                //get percentage diff and set it to result
                getPercentageDifference(response.data[0].ipstrafficcount,prevResponse.data[0].ipstrafficcount).then(result=>{
                  setAnalyzingGatewayData(prevState => {return{...prevState,total_firewall_log_IPS_count_diff_percentage: result}})
                })
              })
              .catch((error) => {
                console.log(error)
              })
          })
          .catch((error) => {
            console.log(error)
          })
      })
  }

  const getFirewallAdminActivitiesLogIngestion = () => {

    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getClientFirewallList", {
      params: {
        customerId: customerId,
      }
    })
      .then((response) => {
        let firewallList = new Set()
        if (response.data) {
          response.data.map((firewall) => {
            firewallList.add(firewall.id);
          })
        }
        firewallList = [...firewallList].join(",")
        axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallAdminActivitiesLogCount', {
          params: {
            firewallId: firewallList,
            startDate : reportStartDate,
            endDate : reportEndDate
          }
        })
          .then(response => {

            setAnalyzingGatewayData(prevState => {return{...prevState,total_firewall_log_admin_activities_count: response.data[0].adminactivitylogcount}})

            //calculate new date range based on current date range difference.
            //const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)

            //get previous month log count
            axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/firewall/getFirewallAdminActivitiesLogCount', {
              params: {
                firewallId: firewallList,
                startDate: previousReportStartDate,
                endDate: previousReportEndDate
              }
            })
              .then(prevResponse => {
                getPercentageDifference(response.data[0].adminactivitylogcount,prevResponse.data[0].adminactivitylogcount).then(result=>{
                  setAnalyzingGatewayData(prevState => {return{...prevState,total_firewall_log_admin_activities_count_diff_percentage: result}})
                })
              })
              .catch((error) => {
                console.log(error)
              })
          })
          .catch((error) => {
            console.log(error)
          })
      })
  }

  const getFirewallActiveBlades = () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getClientFirewallList", {
      params: {
        customerId: customerId,
      }
    })
      .then((response) => {
        let firewallList = new Set()
        if (response.data) {
          response.data.map((firewall) => {
            firewallList.add(firewall.id);
          })
        }
        firewallList = [...firewallList].join(",")
        axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/firewall/getFirewallActiveBladeCount", {
          params: {
            firewallId: firewallList,
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
            setAnalyzingGatewayData(prevState => {return{...prevState,total_firewall_active_blade_count: response.data}})
          })
          .catch((error) => {
            console.log(error)
          })
      })
  }

  const getTopExternalThreat = () => {

    //get data from postgressql
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/firewall/getTopExternalThreat",{params:{
        customerId:customerId,
        startDate:reportStartDate,
        endDate:reportEndDate
      }})
      .then(response=>{
        if(response.data.length>0){
          data.top_external_threats = []
          data.top_external_threats_count= []

          response.data.map(threat=>{
            data.top_external_threats.push(threat.ip)
            data.top_external_threats_count.push(threat.hitscount)
          })

          setPieExternalThreats(data.top_external_threats)
          setPieExternalThreatsCount(data.top_external_threats_count)
          setAnalyzingGatewayData(prevState => {return{...prevState,total_firewall_external_threat_data:response.data}})
        }
      })
      .catch(errors=>{
        console.log(errors)
      })

    // await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/threats/external/", {
    //   "index": ".siem-signals*",
    //   "gte":reportStartDate+"T00:01:00",
    //   "lt":reportEndDate+"T00:00:00"
    // }).then(async response => {
    //   const result = response.data.data.data.buckets.splice(0, 5)
    //
    //   //prepare data to external threats chart
    //   data.top_external_threats = []
    //   data.top_external_threats_count = []
    //
    //   result.map(threat => {
    //     data.top_external_threats.push(threat.key)
    //     data.top_external_threats_count.push(threat.doc_count)
    //   })
    //
    //   setPieExternalThreats(data.top_external_threats)
    //   setPieExternalThreatsCount(data.top_external_threats_count)
    //   setAnalyzingGatewayData(prevState => {return{...prevState,total_firewall_external_threat_data:result}})
    //
    // }).catch(error => {
    //   console.log(error)
    // })
  }

  const getIPSHitsAnalysis = () => {

    //get Firewall list
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/firewall/getClientFirewallList',{
      params:{
        customerId:customerId
      }
    })
      .then(response=>{
        if (response.data.length > 0){
          let firewallList = new Set()
          if (response.data) {
            response.data.map(async (firewall) => {
              firewallList.add(firewall.id);
            })
          }
          firewallList = [...firewallList].join(",")

          //get attack types based on firewall
          axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/firewall/getFirewallIPSHitsAnalysis',{params:{
              firewallList:firewallList,
              startDate: reportStartDate,
              endDate: reportEndDate
            }})
            .then(response =>{
              if(response.data.length > 0){
                setIPsHitsAnalysis(response.data)
              }
            })
            .catch(error=>{
              console.log(error)
            })
        }
    })
      .catch(error=>{

      })

    // await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/firewall/attack/list", {
    //   "index": "firewall-checkpoint-tarion*",
    //   "gte":reportStartDate+"T00:01:00",
    //   "lt":reportEndDate+"T00:00:00"
    // })
    //   .then(response => {
    //     let top_ips_hits_analysis = []
    //     const attackTypes = response.data.data.data.buckets.splice(0, 5)
    //     attackTypes.map(attack => {
    //       top_ips_hits_analysis.push({
    //         source: attack.key[0],
    //         destination: attack.key[1],
    //         attackType: attack.key[2]
    //       })
    //     })
    //     setIPsHitsAnalysis(top_ips_hits_analysis)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
  }

  useEffect(() => {

      getFirewallSubscriptionCount()
      getFirewallTotalLogIngestion()
      getFirewallTotalAllowedLogIngestion()
      getFirewallTotalDeniedLogIngestion()
      getFirewallTotalIPSTrafficLogIngestion()
      getFirewallAdminActivitiesLogIngestion()
      getFirewallActiveBlades()
      getTopExternalThreat()
      getIPSHitsAnalysis()
      getGatewayRecommendation()

  }, [reportContextData]);

  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full grid grid-cols-12 grid-rows-16 gap-2">
        <div className="col-span-12 row-span-2 flex px-5">
          <div className="h-full w-2/12">
            <div className="w-full h-full bg-logo bg-contain bg-center bg-no-repeat">
            </div>
          </div>
          <div className="h-full w-10/12">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-2/3 flex-col">
                <h1 className="w-full text-4xl text-white text-right pr-5 border-b-gray-400 uppercase border-b">
                  Analyzing Gateways
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
                <h1 className="text-4xl text-yellow-500 font-bold">{analyzingGatewayData.total_firewall_subscription_count ? analyzingGatewayData.total_firewall_subscription_count : 0}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Firewall</b> Subscriptions</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center pr-1">
                      <div className="h-full w-full flex items-center justify-center px-2 bg-white/10">
                        <h1
                          className="text-lg text-white">{formatNumber(analyzingGatewayData.total_firewall_log_ingestion_count_per_day)} <span className="text-sm"> logs/d</span></h1>
                      </div>
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center pl-1">
                      {/*<div className="h-full w-full flex items-center justify-center px-2 bg-white/10">*/}
                      {/*  <h1*/}
                      {/*    className="text-lg text-white">{formatNumber(analyzingGatewayData.total_firewall_log_ingestion_count_per_minute)} <span className="text-sm"> logs/m</span></h1>*/}
                      {/*</div>*/}
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
                    className="text-4xl text-yellow-500 font-bold">{formatNumber(analyzingGatewayData.total_firewall_log_ingestion_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Total</b> Logs</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">

                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {analyzingGatewayData.total_firewall_log_ingestion_count_diff_percentage === 0 ?
                        <>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretUp}/>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        </>
                        :
                        analyzingGatewayData.total_firewall_log_ingestion_count_diff_percentage > 0 ?
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                      }
                      <h1
                        className="text-lg text-white">{analyzingGatewayData.total_firewall_log_ingestion_count_diff_percentage ? analyzingGatewayData.total_firewall_log_ingestion_count_diff_percentage : 0} %</h1>
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
                    className="text-4xl text-yellow-500 font-bold">{formatNumber(analyzingGatewayData.total_firewall_log_allowed_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Allowed</b> Traffic</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {analyzingGatewayData.total_firewall_log_allowed_count_dff_percentage === 0 ?
                        <>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretUp}/>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        </>
                        :
                        analyzingGatewayData.total_firewall_log_allowed_count_dff_percentage > 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                      }
                      <h1
                        className="text-lg text-white">{analyzingGatewayData.total_firewall_log_allowed_count_dff_percentage ? analyzingGatewayData.total_firewall_log_allowed_count_dff_percentage : 0} %</h1>
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
                    className="text-4xl text-yellow-500 font-bold">{formatNumber(analyzingGatewayData.total_firewall_log_denied_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Denied</b> Traffic</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {analyzingGatewayData.total_firewall_log_denied_count_diff_percentage === 0 ?
                        <>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretUp}/>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        </>
                        :
                        analyzingGatewayData.total_firewall_log_denied_count_diff_percentage > 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                      }
                      <h1
                        className="text-lg text-white">{analyzingGatewayData.total_firewall_log_denied_count_diff_percentage ? analyzingGatewayData.total_firewall_log_denied_count_diff_percentage : 0} %</h1>
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
                    className="text-4xl text-yellow-500 font-bold">{formatNumber(analyzingGatewayData.total_firewall_log_IPS_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>IPS</b> Hits</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {analyzingGatewayData.total_firewall_log_IPS_count_diff_percentage === 0 ?
                        <>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretUp}/>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        </>
                        :
                        analyzingGatewayData.total_firewall_log_IPS_count_diff_percentage > 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                      }
                      <h1
                        className="text-lg text-white">{analyzingGatewayData.total_firewall_log_IPS_count_diff_percentage ? analyzingGatewayData.total_firewall_log_IPS_count_diff_percentage : 0} %</h1>
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
                    className="text-4xl text-yellow-500 font-bold">{formatNumber(analyzingGatewayData.total_firewall_log_admin_activities_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl text-white"><b>Admin</b> Activities</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {analyzingGatewayData.total_firewall_log_admin_activities_count_diff_percentage === 0 ?
                        <>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretUp}/>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        </>
                        :
                        analyzingGatewayData.total_firewall_log_admin_activities_count_diff_percentage > 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                      }
                      <h1
                        className="text-lg text-white">{analyzingGatewayData.total_firewall_log_admin_activities_count_diff_percentage ? analyzingGatewayData.total_firewall_log_admin_activities_count_diff_percentage : 0} %</h1>
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
                      {analyzingGatewayData.total_firewall_active_blade_count ?
                        analyzingGatewayData.total_firewall_active_blade_count.map((blade,index)=>{
                          return (
                            <div key={index} className="w-full h-8 flex my-2 rounded-lg" style={{backgroundColor:chartBackgroundColorsListOpacity60[index]}}>
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
                      {analyzingGatewayData.total_firewall_external_threat_data ?
                        analyzingGatewayData.total_firewall_external_threat_data.map((threat,index)=> {
                          return (
                            <div key={index} className="w-full h-8 flex my-2 rounded-lg" style={{backgroundColor:chartBackgroundColorsListOpacity60[index]}}>
                              <div
                                className="w-2/3 h-full flex items-center justify-center text-sm text-white">{threat.ip}</div>
                              <div
                                className="w-1/3 h-full flex items-center justify-center text-sm text-white">{formatNumber(threat.hitscount)}</div>
                            </div>
                          )
                        })
                        : ''}
                      {/*{analyzingGatewayData.total_firewall_external_threat_data ?*/}
                      {/*  analyzingGatewayData.total_firewall_external_threat_data.map((threat,index)=> {*/}
                      {/*    return (*/}
                      {/*      <div key={index} className="w-full h-8 flex my-2 rounded-lg" style={{backgroundColor:chartBackgroundColorsListOpacity40[index]}}>*/}
                      {/*        <div*/}
                      {/*          className="w-2/3 h-full flex items-center justify-center text-sm text-white">{threat.key}</div>*/}
                      {/*        <div*/}
                      {/*          className="w-1/3 h-full flex items-center justify-center text-sm text-white">{formatNumber(threat.doc_count)}</div>*/}
                      {/*      </div>*/}
                      {/*    )*/}
                      {/*  })*/}
                      {/*  : ''}*/}
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
                  <div className="h-12 w-full  border-b-gray-400 border-b-2">
                    <h1 className="text-white text-2xl flex items-center justify-center">
                      IPS Hits Analysis <small className="text-sm">(By Severity)</small>
                    </h1>
                  </div>
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="h-full w-full">
                      <div className="h-10 flex text-white">
                        <div
                          className="h-full w-1/3 flex items-center justify-center font-semibold uppercase border-b-gray-400">Source
                        </div>
                        <div
                          className="h-full w-1/3 flex items-center justify-center font-semibold uppercase border-b-gray-400">Destination
                        </div>
                        <div
                          className="h-full w-1/3 flex items-center justify-center font-semibold uppercase border-b-gray-400 ">Type
                          of Attack
                        </div>
                      </div>
                      {ipsHitsAnalysis ?
                        ipsHitsAnalysis.slice(0,6).map((attack,index) => {
                          return (
                            <div key={index} className="h-12 flex text-white border-t-2">
                              <div
                                className="h-12 w-1/3 flex items-center justify-center mr-1">{attack.src}</div>
                              <div
                                className="h-12 w-1/3 flex items-center justify-center mr-1">{attack.dest}</div>
                              <div className="h-12 w-1/3 text-center">{attack.attack}</div>
                            </div>
                          )
                        })
                        : 'No Data'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-4 row-span-6 text-white">
                <div
                  className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                  <div className="h-1/12 w-full border-b-gray-400 border-b-2 flex">
                    {isEditable ?
                      <>
                        <div className="w-11/12 h-full flex items-center justify-center">
                          <h1 className="text-2xl flex items-center justify-center text-white">
                            A2N Recommendations
                          </h1>
                        </div>
                        <div className="w-1/12 h-full flex items-center justify-center p-2">
                          <button className="bg-green-700 px-2 py-1 rounded-lg"
                                  onClick={handleSaveGatewayRecommendation}>Save
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
                        {(sessionData.user.role === 'admin' && (reportContextData.reportPending || reportContextData.reportReadyReview)) || (sessionData.user.role === 'user' && (reportContextData.reportPending)) ?
                          <div className="w-1/12 h-full flex items-center justify-center p-2">
                            <button className="bg-green-700 px-2 py-1 rounded-lg"
                                    onClick={handleEditGatewayRecommendation}>Edit
                            </button>
                          </div>
                          :
                          <></>
                        }
                      </>
                    }
                  </div>
                  <div className="h-5/6 w-full">
                    <div className="w-full h-full">
                      {isEditable ?
                        <div className="w-full h-1/6 flex items-center justify-center">
                          <div className="w-9/12 h-12 px-4 flex items-center justify-center">
                            <input type="text"
                                   value={gatewayRecommendation}
                                   className="w-full px-2 text-gray-800 rounded-lg"
                                   name="endpointProtectionRecommendation"
                                   onChange={handleGatewayRecommendation}/>
                          </div>
                          <div className="w-3/12 h-12 flex items-center justify-center px-5">
                            <input value="Add" type="button"
                                   className="bg-green-700 rounded-lg w-10/12 py-1 shadow-lg"
                                   onClick={addGatewayRecommendation}/>
                          </div>
                        </div>
                        :
                        ''
                      }
                      <div className="w-full h-5/6 flex items-center justify-center">
                        <div className="w-11/12 h-5/6">
                          <ul className="list-disc">
                            {
                              gatewayRecommendationList.length > 0 ?
                                gatewayRecommendationList.map((recommendation, index) => {
                                  return <div className="flex py-1" key={index}>
                                    <li className="w-11/12">{recommendation.comment}</li>
                                    {isEditable ?
                                      <div className="w-1/12 flex items-center justify-center">
                                        <button onClick={() => handleGatewayRecommendationRemove(index)}
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

export default ComponentAnalyzingGateway