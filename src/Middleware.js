import {NextResponse} from "next/server";
import {useContext, useEffect} from "react";
import userContext from "@/context/userContext";

const Middleware=(request)=> {

  const userDataContext = useContext(userContext)

  return NextResponse.json({
    hello:"Gaurav"
  })
}

export default Middleware;