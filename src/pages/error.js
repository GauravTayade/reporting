'use client'
import {Link} from '@nextui-org/react'

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleExclamation, faWrench} from "@fortawesome/free-solid-svg-icons";
import {useEffect} from "react";

export default function Error({error,reset}){

  useEffect(() => {
    console.error(error)
  }, [error]);

  return (
    <div className="w-screen h-screen bg-blue-900">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex-col">
            <div className="w-full h-16 flex">
              <div className="w-full p-5 flex items-center justify-center">
                <h1 className="text-4xl font-bold text-white">Error | <span className="font-semibold uppercase text-2xl"><FontAwesomeIcon icon={faCircleExclamation}/> Something went wrong</span>
                </h1>
              </div>
            </div>
            <div className="w-full h-16 flex">
              <div className="w-full p-5 flex items-center justify-center">
                <Link href="/dashboard" color="warning">Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}