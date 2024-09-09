import ComponentNavigation from "@/components/common/ComponentNavigation";
import React from "react";

const Layout = ({children}) =>{
  return(
    <div className="w-screen h-screen bg-blue-900">
      <div className=" w-full h-full grid grid-rows-12 grid-cols-12">
        <div className="row-span-12 col-span-12 overflow-hidden">
          <div className="row-span-1 col-span-12">
            <ComponentNavigation/>
          </div>
          <div className="row-span-11 col-span-12">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout