import ComponentDataSource from "@/pages/Tarion/ComponentDataSource";
import ComponentDataManifest from "@/pages/Tarion/ComponentDataManifest";
import ComponentAnalyzingGateway from "@/pages/Tarion/ComponentAnalyzingGateway";
import ComponentAnalyzingServer from "@/pages/Tarion/ComponentAnalyzingServer";
import ComponentEndpointProtection from "@/pages/Tarion/ComponentEndpointProtection";
import ComponentAdvisoryWatchDog from "@/pages/Tarion/ComponentAdvisoryWatchDog";
import ComponentGlobalTrafficAnalysis from "@/pages/Tarion/ComponentGlobalTrafficAnalysis";
import ComponentTopNetworkStats from "@/pages/Tarion/ComponentTopNetworkStats";
import Dashboard from "@/pages/Dashboard";
import userContext from "@/context/userContext";
import Login from "@/pages/Login";
import {useContext,} from "react";

const Home= ()=>{

   //get userContext data
  const userDataContext = useContext(userContext)

  return(
    <div className="w-screen h-screen bg-gradient-to-bl from-blue-900 to-teal-900">
      <div className=" w-full h-full grid grid-rows-12 grid-cols-12">
        <div className="row-span-11 col-span-12">
          <div className="w-full h-full overflow-y-scroll no-scrollbar">
            <userContext.Provider value={userDataContext}>
              {/*<ComponentDataSource/>*/}
              {/*<ComponentDataManifest/>*/}
              {/*<ComponentAnalyzingGateway/>*/}
              {/*<ComponentGlobalTrafficAnalysis/>*/}
              {/*<ComponentNetworkStats/>*/}
              {/*<ComponentAnalyzingServer/>*/}
              {/*<ComponentEndpointProtection/>*/}
              {/*<ComponentAdvisoryWatchDog/>*/}
              <Login/>
            </userContext.Provider>
          </div>
        </div>
        {/*<div className="row-span-1 col-span-12">*/}
        {/*  <div className="w-full h-full flex justify-center items-center">*/}
        {/*    <h1 className="text-right text-white text-3xl pr-2 uppercase">Tarion Warrent Company</h1>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  )
}

export default Home