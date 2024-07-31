import dynamic from "next/dynamic";

const ComponentReport =dynamic(()=>import("@/Components/ComponentReport"),{
  ssr: false,
}) ;

const ReportPage = () =>{

  return (
    <ComponentReport/>
  )

}

export default ReportPage;