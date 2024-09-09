import React, {useContext, useRef} from "react";
import dynamic from "next/dynamic";
import ReportContext from "@/context/ReportContext";
import {
  Button,
  Dropdown, DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  User
} from "@nextui-org/react";
import Image from "next/image";
import {signOut, useSession} from "next-auth/react";
import axios from "axios";
import Swal from "sweetalert2";
import {useReactToPrint} from "react-to-print";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faDatabase, faUser} from "@fortawesome/free-solid-svg-icons";
import ComponentNavigation from "@/components/common/ComponentNavigation";
//import jsPDF from "jspdf";
// import html2PDF from 'jspdf-html2canvas';

const ComponentDataSource = dynamic(() => import("@/components/Tarion/ComponentDataSource"))
const ComponentDataManifest = dynamic(() => import("@/components/Tarion/ComponentDataManifest"))
const ComponentAnalyzingGateway = dynamic(() => import("@/components/Tarion/ComponentAnalyzingGateway"))
const ComponentGlobalTrafficAnalysis = dynamic(() => import("@/components/Tarion/ComponentGlobalTrafficAnalysis"))
const ComponentNetworkStats = dynamic(() => import("@/components/Tarion/ComponentNetworkStats"))
const ComponentAnalyzingServer = dynamic(() => import("@/components/Tarion/ComponentAnalyzingServer"))
const ComponentEndpointProtection = dynamic(() => import("@/components/Tarion/ComponentEndpointProtection"))
const ComponentCustomerProfile = dynamic(()=>import("@/components/common/ComponentCustomerProfile"))
const ComponentDateReservoir = dynamic(()=>import("@/components/Tarion/ComponentDateReservoir"))


const ComponentReport = ()=>{

  const {data:sessionData,status} = useSession()
  const {reportContextData, setReportContextData} = useContext(ReportContext)
  const componentRef = useRef(null)

  const handleLogout = () =>{
    signOut()
  }

  const handleGetReportStatus = async() =>{
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/users/reportStatus',{params:{
        reportId : reportContextData.reportId
      }})
      .then(response => {
        if(response.data){
          setReportContextData(prevData => {return{...prevData,
            reportPending: response.data[0].report_pending ? response.data[0].report_pending : null,
            reportReadyReview: response.data[0].report_review_requested ? response.data[0].report_review_requested : null,
            reportReviewed: response.data[0].report_reviewed ? response.data[0].report_reviewed : null,
            reportDelivered: response.data[0].report_delivered ? response.data[0].report_delivered : null}})
        }

      })
      .catch(error=>{

      })
  }

  //user and admin both can mark report for review
  const handleMarkForReview = async() =>{

    await handleSendNotificationMail(process.env.NEXT_PUBLIC_REPORT_STATUS_READY_FOR_REVIEW)

    await axios.post(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/users/reportReadyReview',{
      report_id:reportContextData.reportId,
      employee_id:reportContextData.employeeId
    })
      .then(async response=>{
        if(response.data && response.data.rowCount===1){
          await handleGetReportStatus()
          await handleSendNotificationMail(process.env.NEXT_PUBLIC_REPORT_STATUS_READY_FOR_REVIEW)
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Report is Under Review",
            showConfirmButton: false,
            timer: 2000
          });
        }
      })
      .catch(error=>{})
  }

  //only admin has access to this method
  const handleReviewed = async() =>{
    await axios.post(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/users/reportReviewed',{
      report_id:reportContextData.reportId,
      employee_id:reportContextData.employeeId
    })
      .then(async response=>{
        if(response.data && response.data.rowCount===1){

          await handleGetReportStatus()
          await handleSendNotificationMail(process.env.NEXT_PUBLIC_REPORT_STATUS_REVIEWED)

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Report Ready for Delivery",
            showConfirmButton: false,
            timer: 2000
          });
        }
      })
      .catch(error=>{})
  }

  //user and admin both can mark report delivered
  const handleMarkDelivered = async() => {
    await axios.post(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/users/reportDelivered',{
      report_id:reportContextData.reportId,
      employee_id:reportContextData.employeeId
    })
      .then(async response=>{

         await handleGetReportStatus()
         await handleSendNotificationMail(process.env.NEXT_PUBLIC_REPORT_STATUS_DELIVERED)

        if(response.data && response.data.rowCount===1){
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Report status udpated to Delivered",
            showConfirmButton: false,
            timer: 2000
          });
        }
      })
      .catch(error=>{})
  }

  const reportName = reportContextData.selectedCustomer.length > 0? reportContextData.selectedCustomer[0].customerName+ " "+reportContextData.reportStartDate+" "+reportContextData.reportEndDate: ''

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: reportName,
    copyStyles: true,
  })

  const handleSendNotificationMail =async(reportStatus)=>{

    const reportId = reportContextData.reportId

    await axios.post(process.env.NEXT_PUBLIC_ES_ENDPOINT_URL+'/mail',{
      subject:'Report '+reportName+' status has changed to '+reportStatus,
      to:['siem@a2n.net'],
      html:`<html>
                <head>
                    <title></title>
                </head>
                <body>
                    <p><b>Hi Team</b></p>
                    <p>Status for report ${reportName} has been changes to ${reportStatus}</p>
                    <p>Please visit report : <a href="${process.env.NEXT_PUBLIC_REPORT_URL}/${reportId}">Here</a></p>
                    <p>Thank you, <br/> SIEM Team</p>
                </body>
           </html>`
    }).then(response=>{
      console.log(response)
    }).catch(error=>{
      console.log(error)
    })
  }

  // const handlePrint = async() =>{
  //   // const pdf = new jsPDF()
  //   // pdf.html(componentRef.current,{autoPaging:true,image: { quality: 10, type: "jpeg", multiplier: .5 }}).save(reportName+".pdf");
  //   const result = await html2PDF(componentRef.current, {
  //     jsPDF: {
  //       format: 'a4',
  //     },
  //     imageType: 'image/jpeg',
  //     output: './pdf/generate.pdf'
  //   });
  // }


  // const handlePrint = () => {
  //   const opt = {
  //     margin: 1,
  //     filename: reportContextData.selectedCustomer[0].customerName + " " + reportContextData.reportStartDate + " " + reportContextData.reportEndDate,
  //     image: {type: "jpeg", quality: 0.98},
  //     // html2canvas: {scale:1},
  //     html2canvas: {dpi: 300, letterRendering: false},
  //     jsPDF: {unit: "pt", format: 'a4', orientation: 'landscape'},
  //   }

  //   html2pdf().from(componentRef.current).set(opt).save()
  // }

  return(
    <div className="w-screen h-screen bg-blue-900">
      <div className=" w-full h-full grid grid-rows-12 grid-cols-12">
        <div className="row-span-12 col-span-12 overflow-hidden">
          <div className="row-span-1 col-span-12">
            <ComponentNavigation/>
          </div>
          <div ref={componentRef}
               className="w-full h-full overflow-y-scroll no-scrollbar row-span-11 col-span-12 bg-blue-900">
            <ComponentCustomerProfile/>
            <ComponentDataSource/>
            {/*<ComponentDataManifest/> this component is no longer required*/}
            <ComponentAnalyzingGateway/>
            <ComponentGlobalTrafficAnalysis/>
            <ComponentNetworkStats/>
            <ComponentAnalyzingServer/>
            <ComponentEndpointProtection/>
            <ComponentDateReservoir/>
            {/*<ComponentAdvisoryWatchDog/> this component is no longer required*/}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComponentReport