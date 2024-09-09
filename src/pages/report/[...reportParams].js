'use client'

import {useRouter} from "next/router";
import {useContext, useEffect, useState} from "react";
import userContext from "@/context/userContext";
import ComponentReport from "@/components/ComponentReport";
import axios from "axios";
import ReportContext from "@/context/ReportContext";
import {useSession} from "next-auth/react";
import {notFound, usePathname} from "next/navigation";
import ComponentReportDelivered from "@/components/common/ComponentReportDelivered";

export default function Report() {

  //tarion customer id : 43c1fb4c-47c5-48b8-9699-caf7c920e596
  const {reportContextData, setReportContextData} = useContext(ReportContext)
  const router = useRouter()
  const params = router.query.reportParams

  //get session
  const {data,status} = useSession()

  // const [customerData,setCustomerData] = useState({
  //   reportStartDate:null,
  //   reportEndDate:null,
  //   previousReportStartDate:null,
  //   previousReportEndDate:null,
  //   employeeId:'17538717-6818-4769-b518-4b38cfd42de4',
  //   reportId:null,
  //   selectedCustomer: [],
  //   selectedReports: []
  // })


  const getCustomer = () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/users/getCustomerReportDetails", {
      params: {
        reportId: params[0]
      }
    })
      .then(response => {
        if (response.data.length > 0) {
          let customer = []
          customer.push({
            customerName: response.data[0].customer_name,
            customerId: response.data[0].customer_id,
            customerCode: response.data[0].customer_code
          })

          setReportContextData({
            ...reportContextData,
            reportId: response.data[0].report_id ? response.data[0].report_id : null,
            employeeId: data && data.user ? data.user.id : '',
            reportPending: response.data[0].report_pending ? response.data[0].report_pending : false,
            reportReadyReview: response.data[0].report_review_requested ? response.data[0].report_review_requested : false,
            reportReviewed: response.data[0].report_reviewed ? response.data[0].report_reviewed : false,
            reportDelivered: response.data[0].report_delivered ? response.data[0].report_delivered : false,
            reportDate: response.data[0].report_date ? new Date(response.data[0].report_date).toLocaleDateString("en-CA") : null,
            reportStartDate: response.data[0].report_start_date ? new Date(response.data[0].report_start_date).toLocaleDateString("en-CA") : null,
            reportEndDate: response.data[0].report_end_date ? new Date( new Date().setDate(new Date(response.data[0].report_end_date).getDate() - 1)).toLocaleDateString("en-CA") : null,
            previousReportStartDate: response.data[0].report_start_date ? new Date(new Date(response.data[0].report_start_date).setMonth(new Date(response.data[0].report_start_date).getMonth() - 1)).toLocaleDateString("en-CA") : null,
            previousReportEndDate: response.data[0].report_start_date ? new Date(new Date(new Date(response.data[0].report_start_date).setMonth(new Date(response.data[0].report_start_date).getMonth())).setDate(0)).toLocaleDateString("en-CA") : null,
            selectedCustomer: customer
          })

          //add other report related data to context api
          // userDataContext.reportId = response.data[0].report_id
          // userDataContext.reportStartDate = new Date(response.data[0].report_date).toLocaleDateString("en-CA")
          // userDataContext.reportStartDate = new Date(response.data[0].report_start_date).toLocaleDateString("en-CA")
          // userDataContext.reportEndDate = new Date(response.data[0].report_end_date).toLocaleDateString("en-CA")
          // userDataContext.previousReportStartDate = new Date(new Date(response.data[0].report_start_date).setMonth(new Date(response.data[0].report_start_date).getMonth() - 1)).toLocaleDateString("en-CA")
          // userDataContext.previousReportEndDate = new Date(new Date(new Date(response.data[0].report_start_date).setMonth(new Date(response.data[0].report_start_date).getMonth())).setDate(0)).toLocaleDateString("en-CA")
          //
          // //add selected customer to api context selected customer array
          // userDataContext.selectedCustomer.push({
          //   customerName:response.data[0].customer_name,
          //   customerId: response.data[0].customer_id,
          //   customerCode: response.data[0].customer_code
          // })

        }else{
          router.push('/404')
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    if(params){
      getCustomer()
    }

  }, [params,data]);

  return (
    <>
      {reportContextData.selectedCustomer.length > 0 && data && data.user ?
       // <userContext.Provider value={userDataContext}>
        reportContextData.reportDelivered === true ?
          <ComponentReportDelivered/>
          :
          <ComponentReport/>
        //</userContext.Provider>
        :
        ''
      }
    </>
  )

}