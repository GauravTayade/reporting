import "@/styles/globals.css";
import {SessionProvider} from "next-auth/react";
import ReportContext from "@/context/ReportContext";
import {useState} from "react";
import Head from "next/head";

export default function App({ Component, pageProps: {session , ...pageProps} }) {

  const contextObject = {
    reportStartDate:null,
    reportEndDate:null,
    previousReportStartDate:null,
    previousReportEndDate:null,
    employeeId:'report context data',
    reportId:null,
    selectedCustomer: [],
    selectedReports: []
  }

  const [reportContextData,setReportContextData] = useState({...contextObject});

  return (
    <SessionProvider session={session}>
      <ReportContext.Provider value={{reportContextData,setReportContextData}}>
        <Head>
          <title>A2N Reporting Tool</title>
        </Head>
        <Component {...pageProps} />
      </ReportContext.Provider>
    </SessionProvider>
  )
}
