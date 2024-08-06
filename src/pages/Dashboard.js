import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faDashboard,
  faDatabase,
  faDesktop,
  faGlobe,
  faNetworkWired,
  faServer, faShieldDog,
  faShieldHalved,
  faUserNinja
} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useState} from "react";
import userContext from "@/context/userContext";
import axios from "axios";
import {useRouter} from "next/router";
import Image from "next/image";
import Swal from "sweetalert2";

const Dashboard = (props) => {

  const router = useRouter()

  const endDate = new Date().toLocaleDateString("en-CA")
  const tempDate = new Date()
  const startDate = new Date(tempDate.setDate(tempDate.getDate() - 7)).toLocaleDateString("en-CA")

  const userDataContext = useContext(userContext)
  const [selectedCustomers, setSelectedCustomer] = useState([])
  const [selectedReports, setSelectedReports] = useState([])
  const [customerList, setCustomerList] = useState([])
  const [selectedStartDate,setSelectedStartDate] = useState()
  const [selectedEndDate,setSelectedEndDate] = useState()

  const [reportsList, setReportsList] = useState([
    {reportId: 1, reportName: "Data Source Report", reportIcon: faShieldHalved},
    {reportId: 2, reportName: "Data Manifest Report", reportIcon: faDashboard},
    {reportId: 3, reportName: "Analyzing Gateway Report", reportIcon: faDatabase},
    {reportId: 4, reportName: "Top Network State Report", reportIcon: faNetworkWired},
    {reportId: 5, reportName: "Global Traffic Analysis Report", reportIcon: faGlobe},
    {reportId: 6, reportName: "Analyzing Server Report", reportIcon: faDesktop},
    {reportId: 7, reportName: "Endpoint Protection Report", reportIcon: faNetworkWired},
    {reportId: 8, reportName: "Advisory Watchdog Report", reportIcon: faShieldDog},
    {reportId: 9, reportName: "VPN Report", reportIcon: faUserNinja},
    {reportId: 6, reportName: "Analyzing Server Report", reportIcon: faDesktop},
    {reportId: 7, reportName: "Endpoint Protection Report", reportIcon: faNetworkWired},
    {reportId: 8, reportName: "Advisory Watchdog Report", reportIcon: faShieldDog},
    {reportId: 9, reportName: "VPN Report", reportIcon: faUserNinja}
  ])

  const changeSelectedCustomer = (customer) => {
    if (selectedCustomers.filter(ct => ct.customerName === customer.customerName).length > 0) {
      const cpSelectedCustomers = selectedCustomers.filter(ct => ct.customerName !== customer.customerName)
      setSelectedCustomer(cpSelectedCustomers)
      userDataContext.selectedReports = cpSelectedCustomers
    } else {
      const cpSelectedCustomers = Array.from(selectedCustomers)
      cpSelectedCustomers.push(customer)
      setSelectedCustomer(cpSelectedCustomers)
      userDataContext.selectedCustomer = cpSelectedCustomers
    }
  }

  const changeSelectedReports = (report) => {
    if (selectedReports.filter(rt => rt.reportName === report.reportName).length > 0) {
      const cpSelectedReports = selectedReports.filter(rt => rt.reportName !== report.reportName)
      setSelectedReports(cpSelectedReports)
      userDataContext.selectedReports = cpSelectedReports
    } else {
      const cpSelectedReports = Array.from(selectedReports)
      cpSelectedReports.push(report)
      setSelectedReports(cpSelectedReports)
      userDataContext.selectedReports = cpSelectedReports
    }
  }

  const handleReportStartDate = (e) =>{
    let currentDate = new Date().toLocaleDateString("en-CA")
    let tempStartDate = e.target.value

    if(tempStartDate >= currentDate){
      Swal.fire({
        title:"Start Date",
        text:"Cant't be in future",
        icon:'error',
        showConfirmButton:true,
        timer:5000
      })
    }else{
      userDataContext.reportStartDate = e.target.value
      setSelectedStartDate(e.target.value)
    }
  }

  const handleReportEndDate = (e) =>{
    let currentDate = new Date().toLocaleDateString("en-CA")
    let tempEndDate = e.target.value

    if(tempEndDate > currentDate || tempEndDate < selectedStartDate){
      Swal.fire({
        title:"End Date",
        text:"Cant't be in future or less then start date",
        icon:'error',
        showConfirmButton:true,
        timer:5000
      })
    }else{
      userDataContext.reportEndDate = e.target.value
      console.log(userDataContext)
      setSelectedEndDate(e.target.value)
    }
  }

  const getCustomerList = () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/users/getCustomerList')
      .then(response => {
        if (response.data) {
          setCustomerList(response.data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    getCustomerList()
  }, []);

  const handleGenerateReport = () =>{

    if(selectedStartDate == null || selectedEndDate == null){
      Swal.fire({
        title:"Date Error",
        text:"Please select report start date and end date",
        icon:"error",
        showConfirmButton:true,
        timer:5000
      })
    }else{
      router.push("/ReportPage")
    }

    // console.log(userDataContext)
  }

  return (
    <userContext.Provider value={{selectedCustomer: [], selectedReports: []}}>
      <div className="w-screen h-screen p-2 bg-gradient-to-bl from-blue-900 to-teal-900">
        <div className="w-full h-full grid grid-cols-12 grid-rows-12">
          <div
            className="row-span-1 col-span-4 bg-white/10 flex items-center justify-between pl-5">
            <div className="">
              <Image
                className="mx-auto h-10 w-auto"
                src="/assets/images/logo_header_a2n.png"
                alt="Access 2 Network INC"
                width={270}
                height={120}
              />
            </div>

          </div>
          <div
            className="row-span-1 col-span-4 bg-white/10 flex items-center justify-center text-white">
            <div className="w-1/4 h-full flex justify-end items-center">Start Date:</div>
            <div className="w-1/4 h-full flex items-center justify-center">
              <input name="ctrlStartDate" className="text-gray-800 rounded-2xl px-2" type="date" onChange={handleReportStartDate} required/>
            </div>
            <div className="w-1/4 h-full flex justify-end items-center">End Date:</div>
            <div className="w-1/4 h-full flex items-center justify-center">
              <input name="ctrlEndDate" className="text-gray-800 rounded-2xl px-2" type="date" onChange={handleReportEndDate} required/>
            </div>
          </div>
          <div
            className="row-span-1 col-span-4 bg-white/10 flex items-center justify-end pr-5">
            <button
              className="bg-green-700 hover:bg-green-800 delay-75 duration-200 text-white font-bold py-2 px-4 rounded"
              onClick={handleGenerateReport}
            >Generate
              Report
            </button>
          </div>
          {/*<div className="row-span-12 col-span-2 overflow-y-scroll no-scrollbar">*/}
          {/*  {customerList.length !== 0 ?*/}
          {/*    customerList.map((customer,index) => {*/}
          {/*      if (selectedCustomers.length !== 0 && selectedCustomers.filter(ct => ct.customerName === customer.name).length > 0) {*/}
          {/*        return (*/}
          {/*          <div key={index} className="h-16 w-full p-1">*/}
          {/*            <div className="w-full h-full bg-white bg-opacity-5 shadow-lg flex rounded-lg">*/}
          {/*              <div className="h-full w-1/6 pr-1">*/}
          {/*                <div className="w-full h-full flex justify-center items-center">*/}
          {/*                  <FontAwesomeIcon icon={faCircleCheck} className="text-2xl text-green-400"*/}
          {/*                                   onClick={() => changeSelectedCustomer({*/}
          {/*                                     customerName: customer.name,*/}
          {/*                                     customerId: customer.id,*/}
          {/*                                     customerCode: customer.code,*/}
          {/*                                     reportStartDate: startDate,*/}
          {/*                                     reportEndDate: endDate*/}
          {/*                                   })}/>*/}
          {/*                </div>*/}
          {/*              </div>*/}
          {/*              <div className="h-full w-5/6 flex items-center justify-left">*/}
          {/*                <h1 className="font-semibold text-white">{customer.name}</h1>*/}
          {/*              </div>*/}
          {/*            </div>*/}
          {/*          </div>*/}
          {/*        )*/}
          {/*      } else {*/}
          {/*        return (*/}
          {/*          <div key={index} className="h-16 w-full p-1">*/}
          {/*            <div className="w-full h-full bg-white bg-opacity-5 shadow-lg flex rounded-lg">*/}
          {/*              <div className="h-full w-1/6 pr-1">*/}
          {/*                <div className="w-full h-full flex justify-center items-center">*/}
          {/*                  <FontAwesomeIcon icon={faCircleCheck} className="text-2xl text-gray-400"*/}
          {/*                                   onClick={() => changeSelectedCustomer({*/}
          {/*                                     customerName: customer.name,*/}
          {/*                                     customerId: customer.id,*/}
          {/*                                     customerCode: customer.code,*/}
          {/*                                     reportStartDate: startDate,*/}
          {/*                                     reportEndDate: endDate*/}
          {/*                                   })}/>*/}
          {/*                </div>*/}
          {/*              </div>*/}
          {/*              <div className="h-full w-5/6 flex items-center justify-left">*/}
          {/*                <h1 className="font-semibold text-white">{customer.name}</h1>*/}
          {/*              </div>*/}
          {/*            </div>*/}
          {/*          </div>*/}
          {/*        )*/}
          {/*      }*/}
          {/*    })*/}
          {/*    :*/}
          {/*    "No Data Available"*/}
          {/*  }*/}
          {/*</div>*/}
          <div className="row-span-12 col-span-10">
            <div className="w-full h-full flex flex-wrap overflow-y-scroll no-scrollbar">
              {customerList.length !== 0 ?
                customerList.map((customer,index) => {
                  if (selectedCustomers.length !== 0 && selectedCustomers.filter(ct => ct.customerName === customer.name).length > 0) {
                    return (
                      <div key={index} className="w-3/12 h-2/6 p-1">
                        <div className="w-full h-full bg-white bg-opacity-5 shadow-lg flex-col rounded-lg">
                          <div className="w-full h-5/6 flex-col items-center">
                            <div className="w-full h-1/6 px-2 rounded-lg">
                              <h1 className="font-semibold text-white text-left uppercase text-lg">{customer.name}</h1>
                            </div>
                            <div className="w-full h-4/6 flex items-center justify-center p-2">
                              <Image alt="company logo" src="/assets/images/logo_header_a2n.png" width={380} height={120}/>
                            </div>
                          </div>
                          <div className="w-full h-1/6 flex">
                            <div className="h-full w-1/6 flex justify-center items-center">
                              <FontAwesomeIcon icon={faCircleCheck} className="text-2xl text-green-400"
                                               onClick={() => changeSelectedCustomer({
                                                 customerName: customer.name,
                                                 customerId: customer.id,
                                                 customerCode: customer.code,
                                                 reportStartDate: startDate,
                                                 reportEndDate: endDate
                                               })}/>
                            </div>
                            <div className="h-full w-5/6 flex items-center justify-left">
                              <h1 className="font-semibold text-white">{customer.name}</h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div key={index} className="w-3/12 h-2/6 p-1">
                        <div className="w-full h-full bg-white/10 shadow flex-col rounded-lg hover:shadow-lg duration-500 ease-in hover:bg-white/5">
                          <div className="w-full h-5/6 flex-col items-center">
                            <div className="w-full h-1/6 px-2 rounded-lg">
                              <h1 className="font-semibold text-white text-left uppercase text-lg">{customer.name}</h1>
                            </div>
                            <div className="w-full h-4/6 flex items-center justify-center p-2">
                              <Image alt="company logo" src="/assets/images/logo_header_a2n.png" width={380} height={120}/>
                            </div>
                          </div>
                          <div className="w-full h-1/6 flex">
                            <div className="h-full w-1/6 flex justify-center items-center">
                              <FontAwesomeIcon icon={faCircleCheck} className="text-2xl text-gray-400"
                                               onClick={() => changeSelectedCustomer({
                                                 customerName: customer.name,
                                                 customerId: customer.id,
                                                 customerCode: customer.code,
                                                 reportStartDate: startDate,
                                                 reportEndDate: endDate
                                               })}/>
                            </div>
                            <div className="h-full w-5/6 flex items-center justify-left">
                              <h1 className="font-semibold text-white">{customer.name}</h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                })
                :
                "No Data Available"
              }

              {/*{reportsList ?*/}
              {/*  reportsList.map(report => {*/}
              {/*    if (selectedReports.length !== 0 && selectedReports.filter(rt => rt.reportName === report.reportName).length>0) {*/}
              {/*      return (*/}
              {/*        <div className="w-3/12 h-2/6 p-1">*/}
              {/*          <div className="w-full h-full rounded-lg bg-white bg-opacity-5 shadow-xl flex-col">*/}
              {/*            <div className="w-full h-4/6 flex items-center pl-2 border-b">*/}
              {/*              <FontAwesomeIcon icon={report.reportIcon} className='text-8xl text-gray-300'/>*/}
              {/*            </div>*/}
              {/*            <div className="w-full h-2/6 flex">*/}
              {/*              <div className="w-1/6 h-full flex items-center justify-center">*/}
              {/*                <FontAwesomeIcon icon={faCircleCheck} className="text-4xl text-green-400 transition-all transition-700" onClick={() => changeSelectedReports({reportId:report.reportId, reportName:report.reportName})}/>*/}
              {/*              </div>*/}
              {/*              <div className="w-5/6 h-full flex items-center justify-evenly">*/}
              {/*                <h1 className="text-xl text-white uppercase">{report.reportName}</h1>*/}
              {/*              </div>*/}
              {/*            </div>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*      )*/}
              {/*    }else{*/}
              {/*      return (*/}
              {/*        <div className="w-3/12 h-2/6 p-1">*/}
              {/*          <div className="w-full h-full rounded-lg bg-white bg-opacity-5 shadow-xl flex-col">*/}
              {/*            <div className="w-full h-4/6 flex items-center pl-2 border-b">*/}
              {/*              <FontAwesomeIcon icon={report.reportIcon} className='text-8xl text-gray-300'/>*/}
              {/*            </div>*/}
              {/*            <div className="w-full h-2/6 flex">*/}
              {/*              <div className="w-1/6 h-full flex items-center justify-center">*/}
              {/*                <FontAwesomeIcon icon={faCircleCheck} className="text-4xl text-gray-400 transition-all transition-700" onClick={() => changeSelectedReports({reportId:report.reportId, reportName:report.reportName})}/>*/}
              {/*              </div>*/}
              {/*              <div className="w-5/6 h-full flex items-center justify-evenly">*/}
              {/*                <h1 className="text-xl text-white uppercase">{report.reportName}</h1>*/}
              {/*              </div>*/}
              {/*            </div>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*      )*/}
              {/*    }*/}
              {/*  })*/}
              {/*  :*/}
              {/*  'No data'*/}
              {/*}*/}
            </div>
          </div>
        </div>
      </div>
    </userContext.Provider>
  )
}

export default Dashboard