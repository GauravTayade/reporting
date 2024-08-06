import dynamic from "next/dynamic";
import {useContext} from "react";
import userContext from "@/context/userContext";

const ComponentReport =dynamic(()=>import("@/components/ComponentReport"),{
  ssr: false,
}) ;

const ReportPage = () =>{

  //get userContext data
  const userDataContext = useContext(userContext)
  //get userContext data to get customerId
  const customerId = userDataContext.selectedCustomer.length > 0 ? userDataContext.selectedCustomer[0].customerId : 0
  const reportStartDate = userDataContext.selectedCustomer.length > 0 ? userDataContext.selectedCustomer[0].reportStartDate : 0
  const reportEndDate = userDataContext.selectedCustomer.length > 0 ? userDataContext.selectedCustomer[0].reportEndDate : 0

  return (
    <>
      <ComponentReport/>
    </>
  )

}

export default ReportPage;