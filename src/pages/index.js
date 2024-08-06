import ComponentDataSource from "@/components/Tarion/ComponentDataSource";
import ComponentDataManifest from "@/components/Tarion/ComponentDataManifest";
import ComponentAnalyzingGateway from "@/components/Tarion/ComponentAnalyzingGateway";
import ComponentAnalyzingServer from "@/components/Tarion/ComponentAnalyzingServer";
import ComponentEndpointProtection from "@/components/Tarion/ComponentEndpointProtection";
import ComponentAdvisoryWatchDog from "@/components/Tarion/ComponentAdvisoryWatchDog";
import ComponentGlobalTrafficAnalysis from "@/components/Tarion/ComponentGlobalTrafficAnalysis";
import ComponentTopNetworkStats from "@/components/Tarion/ComponentTopNetworkStats";
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