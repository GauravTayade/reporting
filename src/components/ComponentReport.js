import React, {useContext, useRef} from "react";
import dynamic from "next/dynamic";
import {signOut, useSession} from "next-auth/react";
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
  const componentRef = useRef(null)

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
            <ComponentNavigation printRef={componentRef}/>
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