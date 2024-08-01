import {useContext, useEffect} from "react";
import userContext from "@/context/userContext";
import dynamic from "next/dynamic";
const ComponentDataSource = dynamic(() => import("@/components/Tarion/ComponentDataSource"))
const ComponentDataManifest = dynamic(() => import("@/components/Tarion/ComponentDataManifest"))
const ComponentAnalyzingGateway = dynamic(() => import("@/components/Tarion/ComponentAnalyzingGateway"))
const ComponentGlobalTrafficAnalysis = dynamic(() => import("@/components/Tarion/ComponentGlobalTrafficAnalysis"))
const ComponentNetworkStats = dynamic(() => import("@/components/Tarion/ComponentNetworkStats"))
const ComponentAnalyzingServer = dynamic(() => import("@/components/Tarion/ComponentAnalyzingServer"))
const ComponentEndpointProtection = dynamic(() => import("@/components/Tarion/ComponentEndpointProtection"))
/*import ComponentDataSource from "@/Components/Tarion/ComponentDataSource";
import ComponentDataManifest from "@/Components/Tarion/ComponentDataManifest";
import ComponentAnalyzingGateway from "@/Components/Tarion/ComponentAnalyzingGateway";
import ComponentGlobalTrafficAnalysis from "@/Components/Tarion/ComponentGlobalTrafficAnalysis";
import ComponentNetworkStats from "@/Components/Tarion/ComponentNetworkStats";
import ComponentAnalyzingServer from "@/Components/Tarion/ComponentAnalyzingServer";
import ComponentEndpointProtection from "@/Components/Tarion/ComponentEndpointProtection";*/
import ComponentAdvisoryWatchDog from "@/components/Tarion/ComponentAdvisoryWatchDog";

const ComponentReport = ()=>{

  //get userContext data
  const userDataContext = useContext(userContext)

  return(
    <div className="w-screen h-screen bg-gradient-to-bl from-blue-900 to-teal-900">
      <div className=" w-full h-full grid grid-rows-12 grid-cols-12">
        <div className="row-span-11 col-span-12">
          <div className="w-full h-full overflow-y-scroll no-scrollbar">
            <userContext.Provider value={userDataContext}>
              <ComponentDataSource/>
              <ComponentDataManifest/>
              <ComponentAnalyzingGateway/>
              <ComponentGlobalTrafficAnalysis/>
              <ComponentNetworkStats/>
              <ComponentAnalyzingServer/>
              <ComponentEndpointProtection/>
              {/*<ComponentAdvisoryWatchDog/>*/}
            </userContext.Provider>
          </div>
        </div>
      </div>
    </div>
  )

}

export default ComponentReport