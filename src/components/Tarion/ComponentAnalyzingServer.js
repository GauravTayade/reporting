import ComponentPieChart from "@/components/charts/ComponentPieChart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import userContext from "@/context/userContext";
import {
  chartBackgroundColorsList,
  chartBackgroundColorsListOpacity40,
  chartBackgroundColorsListOpacity60,
  formatNumber, getAverageLogsPerDay, getAverageLogsPerMinuts, getNewDateRange, getPercentageDifference
} from "@/Utilities/Utilities"
import Swal from "sweetalert2";
import ReportContext from "@/context/ReportContext";
import {useSession} from "next-auth/react";

const ComponentAnalyzingServer = (props) => {

  //get user context data
  //const userDataContext = useContext(userContext)
  const {reportContextData, setReportContextData} = useContext(ReportContext)
  //get userContext data to get customerId
  const customerId = reportContextData.selectedCustomer.length > 0 ? reportContextData.selectedCustomer[0].customerId : null
  const reportStartDate = reportContextData.reportStartDate ? reportContextData.reportStartDate : null
  const reportEndDate = reportContextData.reportEndDate ? reportContextData.reportEndDate : null
  const previousReportStartDate = reportContextData.previousReportStartDate ? reportContextData.previousReportStartDate : null
  const previousReportEndDate = reportContextData.previousReportEndDate ? reportContextData.previousReportEndDate : null
  const employeeId = reportContextData.employeeId ? reportContextData.employeeId : 0
  const reportId = reportContextData.reportId ? reportContextData.reportId : 0

  const [analyzingServer, setAnalyzingServer] = useState({
    total_server_subscription_count:0,
    total_server_log_ingestion_count: 0,
    total_server_log_ingestion_count_per_day:0,
    total_server_log_ingestion_count_per_minute:0,
    total_server_authentication_count:0,
    total_server_authentication_count_diff_percentage:0,
    total_server_failed_authentication_count:0,
    total_server_failed_authentication_count_diff_percentage:0,
    total_server_registry_changes_count:0,
    total_server_registry_changes_count_diff_percentage:0,
    total_server_service_creation_count:0,
    total_server_service_creation_count_diff_percentage:0,
    total_server_process_creation_count:0,
    total_server_process_creation_count_diff_percentage:0,
    total_server_policy_changes_count:0,
    total_server_policy_changes_count_diff_percentage:0,
    total_server_file_creation_count:0,
    total_server_file_creation_count_diff_percentage:0,
    total_server_unique_hosts_count:0,
    total_server_unique_hosts_count_diff_percentage:0,
    total_server_unique_username_count:0,
    total_server_unique_username_count_diff_percentage:0
  })

  const [pieMostActiveServers, setPieMostActiveServers] = useState()
  const [pieMostActiveServersRecordCount, setPieMostActiveServersRecordCount] = useState()

  //get the top target hosts with failed auth
  const [pieTopTargetHosts, setPieTopTargetHosts] = useState()
  const [pieTopTargetHostsRecordCount, setPieTopTargetHostsRecordCount] = useState()

  const [serverRecommendation, setServerRecommendation] = useState()
  const [serverRecommendationList, setServerRecommendationList] = useState([])
  const [isEditable, setIsEditable] = useState(false)

  const {data:sessionData,status} = useSession()

  let data = {
    total_subscriptions_count: 0,   //find-endpoint-count-total
    total_endpoint_authentication_count: 0,  //find-total-endpoint-authentication-count
    total_failed_authentication_count: 0, //find-total-failed-authentication-count
    total_target_hosts: 0,  // find-total-target-hosts-count
    total_target_usernames: 0, //find-total-target-usernames-count
    total_registry_changes_count: 0, //find-total-registry-changes-count
    total_service_creations_count: 0, //find-total-service-creation-count
    total_process_creations_count: 0, //find-total-process-creation-count
    total_policy_changes_count: 0, //find-total-policy-change-count
    total_file_creation_count: 0, //find-total-file-creation-count
    most_active_servers: 0, //find-most-active-server
    top_target_hosts: 0, //find-top-failed-authentication-target-hosts
  }

  const getServerRecommendation =async ()=>{
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/edr/getEndpointRecommendation",{
      params:{
        crId:reportId,
        category:'server'
      }
    })
      .then(response=>{
        setServerRecommendationList([])
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
          setServerRecommendationList(temp)
        }
      })
      .catch(error=>{
        console.log(error)
      })
  }

  const handleSaveServerRecommendation = () => {
    if(serverRecommendationList.length > 0){
      axios.post(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/endpoint/saveRecommendation", {
        endpointRecommendations: serverRecommendationList
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

  const handleEditServerRecommendation = () => {
    setIsEditable(!isEditable)
  }

  const handleServerRecommendation = (e) => {
    setServerRecommendation(e.target.value)
  }

  const addServerRecommendation = () => {

    let temp = serverRecommendationList
    temp.push({
      'comment': serverRecommendation,
      'category': 'server',
      'crId': reportId,
      'employeeId': employeeId
    })
    setServerRecommendationList(temp)
    setServerRecommendation('')
  }

  const handleServerRecommendationRemove = (indexRemove) => {
    setServerRecommendationList(serverRecommendationList.filter((recommendation, index) => index !== indexRemove))
  }

  const getUniqueServerCount = async () => {

    //get ServerCount from ES

    await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/endpoint/metrics/count",{
      "index": "logs-*-tarion",
      "gte": reportStartDate+"T00:01:00",
      "lt": reportEndDate+"T23:59:00"
    }).then(async response => {
      if (response.data.data.count) {
        //set the endpoint count
        setAnalyzingServer(prevState => {return{...prevState,total_server_subscription_count:response.data.data.count}})
      }
    })

    // await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/endpoint/getEndpointCount', {
    //   params: {
    //     customerId: customerId,
    //     startDate: reportStartDate,
    //     endDate: reportEndDate
    //   }
    // })
    //   .then(response => {
    //     setAnalyzingServer(prevState => {return{...prevState,total_server_subscription_count:response.data[0].hostcount}})
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })
  }



  const getServerTotalLogIngestionCount = async () =>{
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/endpoint/getEndpointTotalLogCount",{
      params:{customerId: customerId,startDate:reportStartDate,endDate:reportEndDate}
    })
      .then(response=>{
        setAnalyzingServer(prevState => {return{...prevState,total_server_log_ingestion_count: response.data[0].logcount}})

        getAverageLogsPerDay(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          setAnalyzingServer(prevState => {return{...prevState,total_server_log_ingestion_count_per_day:result}})
        })

        getAverageLogsPerMinuts(reportStartDate,reportEndDate,response.data[0].logcount).then(result=>{
          setAnalyzingServer(prevState => {return{...prevState,total_server_log_ingestion_count_per_minute:result}})
        })

      })
      .catch(error=>{
        console.log(error)
      })
  }

  const getTotalAuthenticationCount = async () => {

    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/endpoint/getEndpointAuthenticationCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(async response => {
        setAnalyzingServer(prevState => {return{...prevState,total_server_authentication_count: response.data[0].totalauthenticationcount}})

        //calculate new date range based on current date range difference.
        //const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)
        //get previous month log count
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/endpoint/getEndpointAuthenticationCount",{
          params:{
            customerId: customerId,
            startDate:previousReportStartDate,
            endDate:previousReportEndDate
          }
        })
          .then(async prevResponse=>{
            await getPercentageDifference(response.data[0].totalauthenticationcount,prevResponse.data[0].totalauthenticationcount).then(result=>{
              setAnalyzingServer(prevState => {return{...prevState,total_server_authentication_count_diff_percentage: result}})
            })
          })
          .catch(error=>{
            console.log(error)
          })

      })
      .catch(error => {
        console.log(error)
      })

  }

  const getFailedAuthenticationCount = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/endpoint/getEndpointTotalFailedAuthenticationCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(async response => {
        setAnalyzingServer(prevState => {return{...prevState,total_server_failed_authentication_count: response.data[0].totalfailedauthentication}})

        //calculate new date range based on current date range difference.
        //const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)
        //get previous month log count
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/endpoint/getEndpointTotalFailedAuthenticationCount",{
          params:{
            customerId: customerId,
            startDate:previousReportStartDate,
            endDate:previousReportEndDate
          }
        })
          .then(async prevResponse=>{
            await getPercentageDifference(response.data[0].totalfailedauthentication,prevResponse.data[0].totalfailedauthentication).then(result=>{
              setAnalyzingServer(prevState => {return{...prevState,total_server_failed_authentication_count_diff_percentage: result}})
            })
          })
          .catch(error=>{
            console.log(error)
          })
      })
      .catch(error => {
        console.log(error)
      })
  }

  const getTotalRegistryChangesCount = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/endpoint/getEndpointRegistryChangesCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(async response => {
        setAnalyzingServer((prevState=>{return{...prevState,total_server_registry_changes_count:response.data[0].totalregistrychangecount}}))
        //calculate new date range based on current date range difference.
        //const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)
        //get previous month log count
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/endpoint/getEndpointRegistryChangesCount",{
          params:{
            customerId: customerId,
            startDate:previousReportStartDate,
            endDate:previousReportEndDate
          }
        })
          .then(async prevResponse=>{
            await getPercentageDifference(response.data[0].totalregistrychangecount,prevResponse.data[0].totalregistrychangecount).then(result=>{
              setAnalyzingServer(prevState => {return{...prevState,total_server_registry_changes_count_diff_percentage: result}})
            })
          })
          .catch(error=>{
            console.log(error)
          })
      })
      .catch(error => {
        console.log(error)
      })

  }

  const getTotalServiceCreationCount = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/endpoint/getEndpointServiceCreationCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(async response => {
       setAnalyzingServer(prevState => {return{...prevState,total_server_service_creation_count: response.data[0].totalservicecreationcount}})

        //calculate new date range based on current date range difference.
        //const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)
        //get previous month log count
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/endpoint/getEndpointServiceCreationCount', {
          params: {
            customerId: customerId,
            startDate: previousReportStartDate,
            endDate: previousReportEndDate
          }
        })
          .then(async prevResponse => {
            await getPercentageDifference(response.data[0].totalservicecreationcount,prevResponse.data[0].totalservicecreationcount).then(result=>{
              setAnalyzingServer(prevState => {return{...prevState,total_server_service_creation_count_diff_percentage: result}})
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

  const getTotalProcessCreationCount = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/endpoint/getEndpointProcessCreationCount", {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(async response => {
        setAnalyzingServer(prevState => {return{...prevState,total_server_process_creation_count:response.data[0].totalprocesscreationcount}})

        //calculate new date range based on current date range difference.
        //const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)
        //get previous month log count
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/endpoint/getEndpointProcessCreationCount', {
          params: {
            customerId: customerId,
            startDate: previousReportStartDate,
            endDate: previousReportEndDate
          }
        })
          .then(async prevResponse => {
            await getPercentageDifference(response.data[0].totalprocesscreationcount,prevResponse.data[0].totalprocesscreationcount).then(result=>{
              setAnalyzingServer(prevState => {return{...prevState,total_server_process_creation_count_diff_percentage: result}})
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

  const getTotalPolicyChangesCount = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/endpoint/getEndpointPolicyChangesCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(async response => {
        setAnalyzingServer(prevState => {return{...prevState,total_server_policy_changes_count: response.data[0].totalpolicychangescount}})

        //calculate new date range based on current date range difference.
        //const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)
        //get previous month log count
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/endpoint/getEndpointPolicyChangesCount', {
          params: {
            customerId: customerId,
            startDate: previousReportStartDate,
            endDate: previousReportEndDate
          }
        })
          .then(async prevResponse => {
            await getPercentageDifference(response.data[0].totalpolicychangescount,prevResponse.data[0].totalpolicychangescount).then(result=>{
              setAnalyzingServer(prevState => {return{...prevState,total_server_policy_changes_count_diff_percentage: result}})
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

  const getTotalFileCreationCount = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/endpoint/getEndpointFileCreationCount', {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    })
      .then(async response => {
        setAnalyzingServer(prevState => {return{...prevState,total_server_file_creation_count:response.data[0].totalfilecreationcount}})

        //calculate new date range based on current date range difference.
        //const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)
        //get previous month log count
        await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/endpoint/getEndpointFileCreationCount', {
          params: {
            customerId: customerId,
            startDate: previousReportStartDate,
            endDate: previousReportEndDate
          }
        })
          .then(async prevResponse => {
            getPercentageDifference(response.data[0].totalfilecreationcount,prevResponse.data[0].totalfilecreationcount).then(result=>{
              setAnalyzingServer(prevState => {return{...prevState,total_server_file_creation_count_diff_percentage: result}})
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

  const getMostActiveServers = async () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/endpoint/getMostEndpointMostActiveServerList", {
      params: {
        customerId: customerId,
        startDate: reportStartDate,
        endDate: reportEndDate
      }
    }).then(response => {
      if (response.data.length > 0) {
        let activeServers = []
        let activeServersCount = []
        response.data.map(server => {
          activeServers.push(server.active_server)
          activeServersCount.push(server.totalcount)
        })
        setPieMostActiveServers(activeServers)
        setPieMostActiveServersRecordCount(activeServersCount)
      }
    })
      .catch(error => {
        console.log(error)
      })

  }

  const getTopTargetHosts = async () => {
    await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/endpoint/auth/count/failed-host", {
      "index": "logs-*-tarion*,winlogbeat-tarion",
      "gte": reportStartDate+"T00:01:00",
      "lt": reportEndDate+"T23:59:00"
    })
      .then(async response => {
        let target_host_name = []
        let target_host_record_count = []
        const hostsList = response.data.data.data.table
        hostsList.splice(0, 5).map(host => {
          target_host_name.push(host.key)
          target_host_record_count.push(host.doc_count)
        })

        setPieTopTargetHosts(target_host_name)
        setPieTopTargetHostsRecordCount(target_host_record_count)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const getUniqueTotalTargetHosts = async () => {
    await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/endpoint/auth/count/host", {
      "index": "logs-*-tarion*",
      "gte": reportStartDate+"T00:01:00",
      "lt": reportEndDate+"T23:59:00"
    })
      .then(async response => {
        setAnalyzingServer(prevState => {return{...prevState,total_server_unique_hosts_count: response.data.data.count}})

        //calculate new date range based on current date range difference.
        //const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)
        //get previous month log count
        await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/endpoint/auth/count/host",{
          "index": "logs-*-tarion*",
          "gte": previousReportStartDate+"T00:01:00",
          "lt": previousReportEndDate+"T23:59:00"
        })
          .then(async prevResponse=>{
            await getPercentageDifference(response.data.data.count,prevResponse.data.data.count).then(result=>{
              setAnalyzingServer(prevState => {return{...prevState,total_server_unique_hosts_count_diff_percentage: result}})
            })
          })
          .catch(error=>{
            console.log(error)
          })
      })
      .catch(error => {
        console.log(error)
      })
  }

  const getUniqueTotalTargetUsernames = async () => {
    await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/endpoint/auth/count/username", {
      "index": "logs-*-tarion*",
      "gte": reportStartDate+"T00:01:00",
      "lt": reportEndDate+"T23:59:00"
    })
      .then(async response => {
        setAnalyzingServer(prevState => {return{...prevState,total_server_unique_username_count: response.data.data.count}})
        //calculate new date range based on current date range difference.
        //const prevDateRange = getNewDateRange(reportStartDate,reportEndDate)
        //get previous month log count
        await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+"/endpoint/auth/count/username", {
          "index": "logs-*-tarion*",
          "gte": previousReportStartDate+"T00:01:00",
          "lt": previousReportEndDate+"T23:59:00"
        })
          .then(async prevResponse => {
            await getPercentageDifference(response.data.data.count,prevResponse.data.data.count).then(result=>{
              setAnalyzingServer(prevState => {return{...prevState,total_server_unique_username_count_diff_percentage:result}})
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

  useEffect(() => {
    Promise.all([
      getUniqueServerCount(),
      getServerTotalLogIngestionCount(),
      getTotalAuthenticationCount(),
      getFailedAuthenticationCount(),
      getTotalRegistryChangesCount(),
      getTotalServiceCreationCount(),
      getTotalProcessCreationCount(),
      getTotalPolicyChangesCount(),
      getTotalFileCreationCount(),
      getMostActiveServers(),
      getTopTargetHosts(),
      getUniqueTotalTargetHosts(),
      getUniqueTotalTargetUsernames(),
      getServerRecommendation()
    ]).then(() => {

    })
  }, [reportContextData])

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
                  Analyzing Servers
                </h1>
                <h2 className="w-full h-1/3 text-sm text-white text-right pr-5 border-b-gray-400">
                  {reportStartDate} - {reportEndDate}
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3 row-span-14 grid grid-cols-12 grid-rows-15 gap-2">
          <div className="col-span-12 row-span-2 text-white px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">
                    {formatNumber(analyzingServer.total_server_subscription_count)}
                  </h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-white">
                    <h2 className="text-xl text-white"><b>SERVER</b> Subscriptions</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center pr-1">
                      <div className="h-full w-full flex items-center justify-center px-2 bg-white/10">
                        <h1
                          className="text-lg text-white">{formatNumber(analyzingServer.total_server_log_ingestion_count_per_day)} <span className="text-sm">logs/d</span></h1>
                      </div>
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center pl-1">
                      {/*<div className="h-full w-full flex items-center justify-center p-2 bg-white/10">*/}
                      {/*  <h1*/}
                      {/*    className="text-lg text-white">{formatNumber(analyzingServer.total_server_log_ingestion_count_per_minute)} <span className="text-sm">logs/m</span></h1>*/}
                      {/*</div>*/}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 row-span-1 text-white px-1">
            <div
              className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black flex items-center justify-center">
              <h1 className="text-xl text-yellow-500 font-bold">Server Highlights</h1>
            </div>
          </div>
          <div className="col-span-12 row-span-2 text-white px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">
                    {formatNumber(analyzingServer.total_server_authentication_count)}
                  </h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-white">
                    <h2 className="text-xl text-white"><b>Authentications</b></h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {analyzingServer.total_server_authentication_count_diff_percentage === 0 ?
                        <>
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        </>
                        :
                        analyzingServer.total_server_authentication_count_diff_percentage >0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                      }
                      <h1
                        className="text-lg text-white">{analyzingServer.total_server_authentication_count_diff_percentage ? analyzingServer.total_server_authentication_count_diff_percentage : 0} %</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 row-span-2 text-white px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">
                    {formatNumber(analyzingServer.total_server_registry_changes_count)}
                  </h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-white">
                    <h2 className="text-xl text-white"><b>Registery</b> Changes</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {analyzingServer.total_server_registry_changes_count_diff_percentage === 0 ?
                          <>
                            <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                            <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                          </>
                        :
                        analyzingServer.total_server_registry_changes_count_diff_percentage > 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                      }
                      <h1 className="text-lg text-white">
                        {analyzingServer.total_server_registry_changes_count_diff_percentage?
                          analyzingServer.total_server_registry_changes_count_diff_percentage
                          :
                          0
                        } %
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 row-span-2 text-white px-1 flex gap-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">
                    {formatNumber(analyzingServer.total_server_service_creation_count)}
                  </h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-white">
                    <h2 className="text-xl text-white"><b>Service</b> Creation</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {analyzingServer.total_server_service_creation_count_diff_percentage === 0?
                        <>
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        </>
                        :
                        analyzingServer.total_server_service_creation_count_diff_percentage > 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                      }
                      <h1
                        className="text-lg text-white">{analyzingServer.total_server_service_creation_count_diff_percentage ? analyzingServer.total_server_service_creation_count_diff_percentage : 0} %</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 row-span-2 text-white px-1 flex gap-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1
                    className="text-3xl text-yellow-500 font-bold">{formatNumber(analyzingServer.total_server_process_creation_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-white">
                    <h2 className="text-xl text-white"><b>Process</b> Creation</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {analyzingServer.total_server_process_creation_count_diff_percentage === 0 ?
                        <>
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        </>
                        :
                        analyzingServer.total_server_process_creation_count_diff_percentage > 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                      }
                      <h1 className="text-lg text-white">
                        {
                          analyzingServer.total_server_process_creation_count_diff_percentage ?
                            analyzingServer.total_server_process_creation_count_diff_percentage
                            :
                            0
                        } %</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 row-span-2 text-white px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">
                    {formatNumber(analyzingServer.total_server_policy_changes_count)}
                  </h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-white">
                    <h2 className="text-xl text-white"><b>Policy</b> Changes</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {parseFloat(analyzingServer.total_server_policy_changes_count_diff_percentage)  === 0.00  ?
                          <>
                            <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                            <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                          </>
                          :
                          analyzingServer.total_server_policy_changes_count_diff_percentage > 0 ?
                            <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                            :
                            <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                      }
                      <h1
                        className="text-lg text-white">{analyzingServer.total_server_policy_changes_count_diff_percentage ? analyzingServer.total_server_policy_changes_count_diff_percentage : 0} %</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 row-span-2 text-white px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1
                    className="text-4xl text-yellow-500 font-bold">{formatNumber(analyzingServer.total_server_file_creation_count)}</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-white">
                    <h2 className="text-xl text-white"><b>File</b> Creation</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      {analyzingServer.total_server_file_creation_count_diff_percentage === 0 ?
                        <>
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                        </>
                        :
                        analyzingServer.total_server_file_creation_count_diff_percentage > 0 ?
                          <FontAwesomeIcon className="text-green-700 text-4xl" icon={faCaretUp}/>
                          :
                          <FontAwesomeIcon className="text-red-700 text-4xl" icon={faCaretDown}/>
                      }
                      <h1
                        className="text-lg text-white">{analyzingServer.total_server_file_creation_count_diff_percentage ? analyzingServer.total_server_file_creation_count_diff_percentage : 0} %</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-9 row-span-14 grid grid-cols-12 grid-rows-15">
          <div className="col-span-12 row-span-15 text-white px-1">
            <div className="w-full h-full grid grid-rows-12 grid-cols-8 gap-2">
              <div className="col-span-4 row-span-6">
                <div
                  className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                  <div className="h-1/6 w-full">
                    <h1 className="text-white text-3xl flex items-center justify-center border-b">
                      Most Active Servers
                    </h1>
                  </div>
                  <div className="h-5/6 w-full flex items-center justify-center">
                    <div className="w-2/6 h-full">
                      {pieMostActiveServers ?
                        pieMostActiveServers.map((server, index) => {
                          return (
                            <div key={index} className="w-full h-10 p-1">
                              <div
                                className="w-full h-full flex items-center justify-center rounded-lg"
                                style={{backgroundColor: chartBackgroundColorsListOpacity60[index]}}>
                                <h1 className="text-white text-center font-semibold text-lg">{server}</h1>
                                &nbsp;
                                <span>({formatNumber(pieMostActiveServersRecordCount[index])})</span>
                              </div>
                            </div>
                          )
                        })
                        :
                        'NO data'
                      }
                    </div>
                    <div className="w-4/6 h-full flex items-center justify-center">
                      <ComponentPieChart backGroundColors={chartBackgroundColorsList}
                                         logdata={pieMostActiveServersRecordCount} labels={pieMostActiveServers}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-4 row-span-6">
                <div
                  className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                  <div className="h-1/6 w-full">
                    <h1 className="text-white text-3xl flex items-center justify-center border-b">
                      Top Target Hosts
                    </h1>
                    <p className="w-full text-right"><small className="test-xs">(Failed authentications)</small></p>
                  </div>
                  <div className="h-5/6 w-full flex items-center justify-center">
                    <div className="w-2/6 h-full">
                      {pieTopTargetHosts ?
                        pieTopTargetHosts.map((server, index) => {
                          return (
                            <div key={index} className="w-full h-10 p-1">
                              <div
                                className="w-full h-full  flex items-center justify-center rounded-lg"
                                style={{backgroundColor: chartBackgroundColorsListOpacity60[index]}}>
                                <h1 className="text-white text-center font-semibold text-lg">{server}</h1>
                                &nbsp;
                                <span> ({formatNumber(pieTopTargetHostsRecordCount[index])})</span>
                              </div>
                            </div>
                          )
                        })
                        :
                        'NO data'
                      }
                    </div>
                    <div className="w-4/6 h-full flex items-center justify-center">
                      <ComponentPieChart backGroundColors={chartBackgroundColorsList}
                                         logdata={pieTopTargetHostsRecordCount} labels={pieTopTargetHosts}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-4 row-span-6">
                <div
                  className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                  <div className="h-1/6 w-full">
                    <h1 className="text-white text-2xl flex items-center justify-center border-b">
                      Authentication Analysis <small className="text-sm"></small>
                    </h1>
                  </div>
                  <div className="h-5/6 w-full flex items-center justify-center">
                    <div className="w-full h-full grid grid-rows-5 grid-cols-10 items-center justify-center gap-1">
                      <div
                        className="col-span-6 bg-opacity-65 w-full h-full flex items-center justify-center rounded-lg bg-white/10">
                        Total Authentications
                      </div>
                      <div
                        className="col-span-2 bg-opacity-65 w-full h-full flex items-center justify-center rounded-lg bg-white/10">
                        {formatNumber(analyzingServer.total_server_authentication_count)}
                      </div>
                      <div
                        className="col-span-2 bg-opacity-65 w-full h-full flex items-center justify-center rounded-lg bg-white/10">
                        {analyzingServer.total_server_authentication_count_diff_percentage === 0 ?
                          <>
                            <FontAwesomeIcon className="text-green-700 text-2xl" icon={faCaretUp}/>
                            <FontAwesomeIcon className="text-red-700 text-2xl" icon={faCaretDown}/>
                          </>
                          :
                          analyzingServer.total_server_authentication_count_diff_percentage > 0 ?
                            <FontAwesomeIcon className="text-green-700 text-2xl" icon={faCaretUp}/>
                            :
                            <FontAwesomeIcon className="text-red-700 text-2xl" icon={faCaretDown}/>
                        }
                        <h1
                          className="text-white">{analyzingServer.total_server_authentication_count_diff_percentage ? analyzingServer.total_server_authentication_count_diff_percentage : 0} %</h1>
                      </div>

                      <div
                        className="col-span-6 bg-opacity-65 w-full h-full flex items-center justify-center rounded-lg bg-white/10">
                        Total Failed Authentication
                      </div>
                      <div
                        className="col-span-2 bg-opacity-65 w-full h-full flex items-center justify-center rounded-lg bg-white/10">
                        {
                          formatNumber(analyzingServer.total_server_failed_authentication_count)
                        }
                      </div>
                      <div
                        className="col-span-2 bg-opacity-65 w-full h-full flex items-center justify-center rounded-lg bg-white/10">
                        {analyzingServer.total_server_failed_authentication_count_diff_percentage === 0 ?
                          <>
                            <FontAwesomeIcon className="text-green-700 text-2xl" icon={faCaretUp}/>
                            <FontAwesomeIcon className="text-red-700 text-2xl" icon={faCaretDown}/>
                          </>
                          :
                          analyzingServer.total_server_failed_authentication_count_diff_percentage >0 ?
                            <FontAwesomeIcon className="text-2xl text-green-700" icon={faCaretUp}/>
                            :
                            <FontAwesomeIcon className="text-2xl text-red-700" icon={faCaretDown}/>
                        }
                        {analyzingServer.total_server_failed_authentication_count_diff_percentage ?  analyzingServer.total_server_failed_authentication_count_diff_percentage: 0} %
                      </div>

                      <div
                        className="col-span-6 bg-opacity-65 w-full h-full flex items-center justify-center rounded-lg bg-white/10">
                        Failure Percentage
                      </div>
                      <div
                        className="col-span-2 bg-opacity-65 w-full h-full flex items-center justify-center rounded-lg bg-white/10">
                        {formatNumber((analyzingServer.total_server_failed_authentication_count * 100) / analyzingServer.total_server_authentication_count)} %
                      </div>
                      <div
                        className="col-span-2 bg-opacity-65 w-full h-full flex items-center justify-center rounded-lg bg-white/10">
                        {analyzingServer.total_server_failed_authentication_count_diff_percentage === 0 ?
                          <>
                            <FontAwesomeIcon className="text-green-700 text-2xl" icon={faCaretUp}/>
                            <FontAwesomeIcon className="text-red-700 text-2xl" icon={faCaretDown}/>
                          </>
                          :
                          analyzingServer.total_server_failed_authentication_count_diff_percentage >0 ?
                            <FontAwesomeIcon className="text-2xl text-green-700" icon={faCaretUp}/>
                            :
                            <FontAwesomeIcon className="text-2xl text-red-700" icon={faCaretDown}/>
                        }
                        {analyzingServer.total_server_failed_authentication_count_diff_percentage ?  analyzingServer.total_server_failed_authentication_count_diff_percentage: 0} %
                      </div>

                      <div
                        className="col-span-6 bg-opacity-65 w-full h-full flex items-center justify-center rounded-lg bg-white/10">
                        # of Total Hosts
                      </div>
                      <div
                        className="col-span-2 bg-opacity-65 w-full h-full flex items-center justify-center rounded-lg bg-white/10">{analyzingServer.total_server_unique_hosts_count}
                      </div>
                      <div
                        className="col-span-2 bg-opacity-65 w-full h-full flex items-center justify-center rounded-lg bg-white/10">
                        {analyzingServer.total_server_unique_hosts_count_diff_percentage === 0 ?
                          <>
                            <FontAwesomeIcon className="text-green-700 text-2xl" icon={faCaretUp}/>
                            <FontAwesomeIcon className="text-red-700 text-2xl" icon={faCaretDown}/>
                          </>
                          :
                          analyzingServer.total_server_unique_hosts_count_diff_percentage > 0 ?
                            <FontAwesomeIcon className="text-green-700 text-2xl" icon={faCaretUp}/>
                            :
                            <FontAwesomeIcon className="text-red-700 text-2xl" icon={faCaretDown}/>

                        }
                        <h1
                          className="text-white">{analyzingServer.total_server_unique_hosts_count_diff_percentage ? analyzingServer.total_server_unique_hosts_count_diff_percentage : 0} %</h1>
                      </div>

                      <div
                        className="col-span-6 bg-opacity-65 w-full h-full flex items-center justify-center rounded-lg bg-white/10">
                        # of Total Usernames
                      </div>
                      <div
                        className="col-span-2 bg-opacity-65 w-full h-full flex items-center justify-center rounded-lg bg-white/10">{analyzingServer.total_server_unique_username_count}
                      </div>
                      <div
                        className="col-span-2 bg-opacity-65 w-full h-full flex items-center justify-center rounded-lg bg-white/10">
                        {analyzingServer.total_server_unique_username_count_diff_percentage === 0 ?
                          <>
                            <FontAwesomeIcon className="text-green-700 text-2xl" icon={faCaretUp}/>
                            <FontAwesomeIcon className="text-red-700 text-2xl" icon={faCaretDown}/>
                          </>
                          :
                          analyzingServer.total_server_unique_username_count_diff_percentage > 0 ?
                            <FontAwesomeIcon className="text-green-700 text-2xl" icon={faCaretUp}/>
                            :
                            <FontAwesomeIcon className="text-red-700 text-2xl" icon={faCaretDown}/>
                        }
                        <h1
                          className="text-white">{analyzingServer.total_server_unique_username_count_diff_percentage ? analyzingServer.total_server_unique_username_count_diff_percentage : 0} %</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-4 row-span-6">
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
                                  onClick={handleSaveServerRecommendation}>Save
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
                                  onClick={handleEditServerRecommendation}>Edit
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
                                   value={serverRecommendation}
                                   className="w-full px-2 text-gray-800 rounded-lg"
                                   name="endpointProtectionRecommendation"
                                   onChange={handleServerRecommendation}/>
                          </div>
                          <div className="w-3/12 h-12 flex items-center justify-center px-5">
                            <input value="Add" type="button"
                                   className="bg-green-700 rounded-lg w-10/12 py-1 shadow-lg"
                                   onClick={addServerRecommendation}/>
                          </div>
                        </div>
                        :
                        ''
                      }
                      <div className="w-full h-5/6 flex items-center justify-center">
                        <div className="w-11/12 h-5/6">
                          <ul className="list-disc">
                            {
                              serverRecommendationList.length > 0 ?
                                serverRecommendationList.map((recommendation, index) => {
                                  return <div className="flex py-1" key={index}>
                                    <li className="w-11/12">{recommendation.comment}</li>
                                    {isEditable ?
                                      <div className="w-1/12 flex items-center justify-center">
                                        <button onClick={() => handleServerRecommendationRemove(index)}
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

export default ComponentAnalyzingServer