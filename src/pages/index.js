import ComponentDataSource from "@/Components/Tarion/ComponentDataSource";
import ComponentDataManifest from "@/Components/Tarion/ComponentDataManifest";
import ComponentAnalyzingGateway from "@/Components/Tarion/ComponentAnalyzingGateway";
import ComponentAnalyzingServer from "@/Components/Tarion/ComponentAnalyzingServer";
import ComponentEndpointProtection from "@/Components/Tarion/ComponentEndpointProtection";
import ComponentAdvisoryWatchDog from "@/Components/Tarion/ComponentAdvisoryWatchDog";
import ComponentGlobalTrafficAnalysis from "@/Components/Tarion/ComponentGlobalTrafficAnalysis";
import ComponentTopNetworkStats from "@/Components/Tarion/ComponentTopNetworkStats";
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
              {/*<ComponentTopNetworkStats/>*/}
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