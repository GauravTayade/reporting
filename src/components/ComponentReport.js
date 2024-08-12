import {useContext, useEffect} from "react";
import userContext from "@/context/userContext";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
const ComponentDataSource = dynamic(() => import("@/components/Tarion/ComponentDataSource"))
const ComponentDataManifest = dynamic(() => import("@/components/Tarion/ComponentDataManifest"))
const ComponentAnalyzingGateway = dynamic(() => import("@/components/Tarion/ComponentAnalyzingGateway"))
const ComponentGlobalTrafficAnalysis = dynamic(() => import("@/components/Tarion/ComponentGlobalTrafficAnalysis"))
const ComponentNetworkStats = dynamic(() => import("@/components/Tarion/ComponentNetworkStats"))
const ComponentAnalyzingServer = dynamic(() => import("@/components/Tarion/ComponentAnalyzingServer"))
const ComponentEndpointProtection = dynamic(() => import("@/components/Tarion/ComponentEndpointProtection"))


const ComponentReport = ()=>{

  const router = useRouter();
  //get userContext data
  const userDataContext = useContext(userContext)

  if(userDataContext.selectedCustomer.length <= 0){
    router.push("/Dashboard")
  }

  return(
    <div className="w-screen h-screen bg-blue-900">
      <div className=" w-full h-full grid grid-rows-12 grid-cols-12">
        <div className="row-span-11 col-span-12">
          <div className="w-full h-full overflow-y-scroll no-scrollbar">
            <userContext.Provider value={userDataContext}>
                {/*<ComponentDataSource/>*/}
                {/*<ComponentDataManifest/>*/}
                <ComponentAnalyzingGateway/>
                {/*<ComponentGlobalTrafficAnalysis/>*/}
                {/*<ComponentNetworkStats/>*/}
                <ComponentAnalyzingServer/>
                <ComponentEndpointProtection/>
              {/*<ComponentAdvisoryWatchDog/>*/}
            </userContext.Provider>
          </div>
        </div>
        <div className="row-span-1 col-span-12">
          <div className="w-full h-full flex-col justify-center items-center">
            <div className="w-full h-2/3 text-center">
              <h1 className="text-white text-3xl pr-2 uppercase">
                {userDataContext.selectedCustomer[0].customerName}
              </h1>
            </div>
            <div className="w-full h-1/3 text-center">
              <h3 className="text-sm w-full h-full text-white">
                {userDataContext.reportStartDate} - {userDataContext.reportEndDate}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default ComponentReport