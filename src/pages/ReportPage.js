import dynamic from "next/dynamic";

const ComponentReport =dynamic(()=>import("@/components/ComponentReport"),{
  ssr: true,
}) ;

const ReportPage = () =>{

  return (
    <ComponentReport/>
  )

}

export default ReportPage;