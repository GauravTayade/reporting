import {useContext, useEffect, useState} from "react";
import userContext from "@/context/userContext";
import ReportContext from "@/context/ReportContext";
import reportContext from "@/context/ReportContext";

const ComponentCustomerProfile = (props) =>{

  const {reportContextData, setReportContextData} = useContext(ReportContext)

  const [customerData,setCustomerData] = useState(null)

  useEffect(() => {
    if(userContext){
      setCustomerData(reportContextData)
    }
  }, [customerData,reportContextData]);

  return(
    <div className="w-screen h-screen p-5 page-break">
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
                  Profile
                </h1>
                <h2 className="w-full h-1/3 text-sm text-white text-right pr-5 border-b-gray-400">

                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 row-span-16 flex items-center justify-center">
          <div className="w-4/6 h-4/6 text-white">
            <h1 className="text-6xl text-center uppercase">
              {customerData && customerData.selectedCustomer.length >0 ? customerData.selectedCustomer[0].customerName : ''}
            </h1>
            <h1 className="text-4xl text-center my-5">Report Period</h1>
            <h1 className="text-4xl text-center">
              {customerData ? customerData.reportStartDate : ''} - {customerData? customerData.reportEndDate : ''}
            </h1>
            <h1 className="text-center"><small>All percentage calculations in this report are based on a comparison of the current month&apos;s values to those recorded in the preceding month. <br/> {customerData ? customerData.previousReportStartDate: ''} - {customerData ? customerData.previousReportEndDate : ''}</small></h1>
            <div className="h-full w-full flex items-center justify-center">
              <div className="w-2/6 h-2/6 bg-logo bg-contain bg-center bg-no-repeat"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComponentCustomerProfile;