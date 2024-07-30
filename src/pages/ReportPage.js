import {useContext, useEffect} from "react";
import userContext from "@/context/userContext";
import ComponentDataSource from "@/pages/Tarion/ComponentDataSource";
import ComponentDataManifest from "@/pages/Tarion/ComponentDataManifest";
import ComponentAnalyzingGateway from "@/pages/Tarion/ComponentAnalyzingGateway";
import ComponentGlobalTrafficAnalysis from "@/pages/Tarion/ComponentGlobalTrafficAnalysis";
import ComponentNetworkStats from "@/pages/Tarion/ComponentNetworkStats";
import ComponentAnalyzingServer from "@/pages/Tarion/ComponentAnalyzingServer";
import ComponentEndpointProtection from "@/pages/Tarion/ComponentEndpointProtection";
import ComponentAdvisoryWatchDog from "@/pages/Tarion/ComponentAdvisoryWatchDog";

const ReportPage = ()=>{

  //get userContext data
  const userDataContext = useContext(userContext)

  return(
    <div className="w-screen h-screen bg-gradient-to-bl from-blue-900 to-teal-900">
      <div className=" w-full h-full grid grid-rows-12 grid-cols-12">
        <div className="row-span-11 col-span-12">
          <div className="w-full h-full overflow-y-scroll no-scrollbar">
            <userContext.Provider value={userDataContext}>
              <ComponentDataSource/>
              {/*<ComponentDataManifest/>*/}
              {/*<ComponentAnalyzingGateway/>*/}
              {/*<ComponentGlobalTrafficAnalysis/>*/}
              {/*<ComponentNetworkStats/>*/}
              {/*<ComponentAnalyzingServer/>*/}
              {/*<ComponentEndpointProtection/>*/}
              {/*<ComponentAdvisoryWatchDog/>*/}
            </userContext.Provider>
          </div>
        </div>
      </div>
    </div>
  )

}

export default ReportPage