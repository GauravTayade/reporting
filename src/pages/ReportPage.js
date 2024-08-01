import dynamic from "next/dynamic";

const ComponentReport =dynamic(()=>import("@/components/ComponentReport"),{
  ssr: false,
}) ;

const ReportPage = () =>{

  return (
    <ComponentReport/>
  )

}

export default ReportPage;