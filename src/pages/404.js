'use client'
import {Link} from "@nextui-org/react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlugCircleXmark, } from "@fortawesome/free-solid-svg-icons";

export default function Custom404() {
  return (
    <div className="w-screen h-screen bg-blue-900">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex-col">
            <div className="w-full h-16 flex">
              <div className="w-full p-5 flex items-center justify-center">
                <h1 className="text-4xl font-bold text-white">404 | <span className="font-semibold uppercase text-2xl">
                  <FontAwesomeIcon icon={faPlugCircleXmark}/> Resource Does Not Exists</span>
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