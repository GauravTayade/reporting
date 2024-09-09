import {useContext} from "react";
import ReportContext from "@/context/ReportContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faDatabase} from "@fortawesome/free-solid-svg-icons";
import {faSearchengin} from "@fortawesome/free-brands-svg-icons";

const ComponentDateReservoir = () => {

  //get ReportContext Data
  const {reportContextData, setReportContextData} = useContext(ReportContext)
  //get userContext data to get customerId
  const customerId = reportContextData.selectedCustomer.length > 0 ? reportContextData.selectedCustomer[0].customerId : null
  const reportStartDate = reportContextData.reportStartDate ? reportContextData.reportStartDate : null
  const reportEndDate = reportContextData.reportEndDate ? reportContextData.reportEndDate : null
  const previousReportStartDate = reportContextData.previousReportStartDate ? reportContextData.previousReportStartDate : null
  const previousReportEndDate = reportContextData.previousReportEndDate ? reportContextData.previousReportEndDate : null

  return(
    <div className="w-screen h-screen">
      <div className="w-full h-full grid grid-cols-12 grid-rows-16 gap-2">
        <div className="col-span-12 row-span-2 flex px-5">
          <div className="h-full w-2/12">
            <div className="w-full h-full bg-logo bg-contain bg-center bg-no-repeat">
            </div>
          </div>
          <div className="h-full w-10/12">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-2/3 flex-col">
                <h1 className="w-full text-4xl text-white text-right pr-5 border-b-gray-400 uppercase border-b">
                  Data Reservoir And Advisory Watchdog
                </h1>
                <h2 className="w-full h-1/3 text-sm text-white text-right pr-5 border-b-gray-400">
                  {reportStartDate} - {reportEndDate}
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 row-span-14 grid grid-cols-12 grid-rows-13 gap-2">
          <div className="col-span-3 row-span-14 flex-col">
            <div className="w-full h-1/6 flex">
              <div className="w-1/2 h-full relative border-r-2 p-2">
                <div className="w-full h-full absolute">
                  <FontAwesomeIcon className="text-white text-8xl opacity-10" icon={faSearchengin}/>
                </div>
                <div className="w-full h-full relative">
                  <div className="w-full h-1/2">
                    <h1 className="text-white text-5xl text-right">11.5 <span
                      className="text-white text-sm">Minutes</span></h1>
                  </div>
                  <div className="w-full h-1/2">
                    <h1 className="w-full text-white text-4xl text-right">MTTD</h1>
                  </div>
                </div>
              </div>
              <div className="w-1/2 h-full relative p-2">
                <div className="w-full h-full absolute">
                  <FontAwesomeIcon className="text-white text-8xl opacity-10" icon={faClock}/>
                </div>
                <div className="w-full h-full relative">
                  <div className="w-full h-1/2">
                    <h1 className="text-white text-5xl text-right">200 <span
                      className="text-white text-sm">Milliseconds</span></h1>
                  </div>
                  <div className="w-full h-1/2">
                    <h1 className="w-full text-white text-4xl text-right">Query Wait</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-1/6 py-2">
              <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
                <div className="w-full h-full flex">
                  <div className="w-1/3 h-full flex items-center justify-center">
                    <h1 className="text-4xl text-yellow-500 font-bold">000</h1>
                  </div>
                  <div className="w-2/3 h-full flex-col">
                    <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                      <h2 className="text-xl text-white"><b>Advisory</b> Actioned</h2>
                    </div>
                    <div className="w-full h-1/2 flex-col items-center">
                      <div className="w-full h-1/2 flex items-center">
                      </div>
                      <div className="w-full h-1/2 flex items-center">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-12 py-1">
              <div
                className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black flex items-center justify-center">
                <h1 className="text-xl text-yellow-500 font-bold">Advisory Highlights</h1>
              </div>
            </div>
            <div className="w-full h-1/6 py-1">
              <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
                <div className="w-full h-full flex">
                  <div className="w-1/6 h-full flex items-center justify-center">
                    <h1 className="text-4xl text-yellow-500 font-bold">7</h1>
                  </div>
                  <div className="w-5/6 h-full flex-col">
                    <div className="w-full h-1/3 flex items-center border-b border-b-gray-300">
                      <h2 className="text-xl text-white"><b>Total</b> Advisories (Y2D)</h2>
                    </div>
                    <div className="w-full h-2/3 flex">
                      <div className="w-1/4 h-full p-1">
                        <div className="w-full h-full flex-col">
                          <div className="w-full h-1/3 bg-white bg-opacity-10 shadow">
                            <h1 className="font-semibold text-center text-white">Critical</h1>
                          </div>
                          <div className="w-full h-2/3 flex items-center justify-center bg-white bg-opacity-5 shadow">
                            <h1 className="font-bold text-white text-3xl">7</h1></div>
                        </div>
                      </div>
                      <div className="w-1/4 h-full p-1">
                        <div className="w-full h-full flex-col">
                          <div className="w-full h-1/3 bg-white bg-opacity-10 shadow">
                            <h1 className="font-semibold text-center text-white">High</h1>
                          </div>
                          <div className="w-full h-2/3 flex items-center justify-center bg-white bg-opacity-5 shadow">
                            <h1 className="font-bold text-white text-3xl">0</h1></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-1/6 py-1">
              <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
                <div className="w-full h-full flex">
                  <div className="w-1/6 h-full flex items-center justify-center">
                    <h1 className="text-4xl text-yellow-500 font-bold">7</h1>
                  </div>
                  <div className="w-5/6 h-full flex-col">
                    <div className="w-full h-1/3 flex items-center border-b border-b-gray-300">
                      <h2 className="text-xl text-white"><b>Total</b> Advisories (Y2D)</h2>
                    </div>
                    <div className="w-full h-2/3 flex">
                      <div className="w-1/4 h-full p-1">
                        <div className="w-full h-full flex-col">
                          <div className="w-full h-1/3 bg-white bg-opacity-10 shadow">
                            <h1 className="font-semibold text-center text-white">IP&apos;s</h1>
                          </div>
                          <div className="w-full h-2/3 flex items-center justify-center bg-white bg-opacity-5 shadow">
                            <h1 className="font-bold text-white text-3xl">18</h1></div>
                        </div>
                      </div>
                      <div className="w-1/4 h-full p-1">
                        <div className="w-full h-full flex-col">
                          <div className="w-full h-1/3 bg-white bg-opacity-10 shadow">
                            <h1 className="font-semibold text-center text-white">URL&apos;s</h1>
                          </div>
                          <div className="w-full h-2/3 flex items-center justify-center bg-white bg-opacity-5 shadow">
                            <h1 className="font-bold text-white text-3xl">30</h1></div>
                        </div>
                      </div>
                      <div className="w-1/4 h-full p-1">
                        <div className="w-full h-full flex-col">
                          <div className="w-full h-1/3 bg-white bg-opacity-10 shadow">
                            <h1 className="font-semibold text-center text-white">Hashes</h1>
                          </div>
                          <div className="w-full h-2/3 flex items-center justify-center bg-white bg-opacity-5 shadow">
                            <h1 className="font-bold text-white text-3xl">56</h1></div>
                        </div>
                      </div>
                      <div className="w-1/4 h-full p-1">
                        <div className="w-full h-full flex-col">
                          <div className="w-full h-1/3 bg-white bg-opacity-10 shadow">
                            <h1 className="font-semibold text-center text-white">Behavioral</h1>
                          </div>
                          <div className="w-full h-2/3 flex items-center justify-center bg-white bg-opacity-5 shadow">
                            <h1 className="font-bold text-white text-3xl">93</h1></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-1/6 py-1">
              <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
                <div className="w-full h-full flex">
                  <div className="w-1/6 h-full flex items-center justify-center">
                    <h1 className="text-4xl text-yellow-500 font-bold">7</h1>
                  </div>
                  <div className="w-5/6 h-full flex-col">
                    <div className="w-full h-1/3 flex items-center border-b border-b-gray-300">
                      <h2 className="text-xl text-white"><b>Total</b> Advisories (Y2D)</h2>
                    </div>
                    <div className="w-full h-2/3 flex">
                      <div className="w-1/4 h-full p-1">
                        <div className="w-full h-full flex-col">
                          <div className="w-full h-1/3 bg-white bg-opacity-10 shadow">
                            <h1 className="font-semibold text-center text-white">IP&apos;s</h1>
                          </div>
                          <div className="w-full h-2/3 flex items-center justify-center bg-white bg-opacity-5 shadow">
                            <h1 className="font-bold text-white text-3xl">18</h1></div>
                        </div>
                      </div>
                      <div className="w-1/4 h-full p-1">
                        <div className="w-full h-full flex-col">
                          <div className="w-full h-1/3 bg-white bg-opacity-10 shadow">
                            <h1 className="font-semibold text-center text-white">URL&apos;s</h1>
                          </div>
                          <div className="w-full h-2/3 flex items-center justify-center bg-white bg-opacity-5 shadow">
                            <h1 className="font-bold text-white text-3xl">30</h1></div>
                        </div>
                      </div>
                      <div className="w-1/4 h-full p-1">
                        <div className="w-full h-full flex-col">
                          <div className="w-full h-1/3 bg-white bg-opacity-10 shadow">
                            <h1 className="font-semibold text-center text-white">Hashes</h1>
                          </div>
                          <div className="w-full h-2/3 flex items-center justify-center bg-white bg-opacity-5 shadow">
                            <h1 className="font-bold text-white text-3xl">56</h1></div>
                        </div>
                      </div>
                      <div className="w-1/4 h-full p-1">
                        <div className="w-full h-full flex-col">
                          <div className="w-full h-1/3 bg-white bg-opacity-10 shadow">
                            <h1 className="font-semibold text-center text-white">Behavioral</h1>
                          </div>
                          <div className="w-full h-2/3 flex items-center justify-center bg-white bg-opacity-5 shadow">
                            <h1 className="font-bold text-white text-3xl">93</h1></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-9 row-span-14 flex flex-col px-5 items-center">
            <div className="w-full h-1/6 flex items-center justify-center border-b-2">
              <div className="w-2/6 h-full flex">
                <div className="w-1/2 h-full flex items-center justify-end p-2">
                  <FontAwesomeIcon className="text-8xl text-white" icon={faDatabase}/>
                </div>
                <div className="w-1/2 h-full">
                  <div className="w-full h-2/5">
                    <h1 className="text-4xl text-white">8.25 <span className="text-sm">TB</span></h1></div>
                  <div className="w-full h-2/5">
                    <h1 className="text-2xl text-white uppercase">Data Reservoir</h1>
                  </div>
                  <div className="w-full h-1/5"></div>
                </div>
              </div>
              <div className="w-2/6 h-full flex">
                <div className="w-1/2 h-full flex items-center justify-end p-2">
                  <FontAwesomeIcon className="text-8xl text-orange-500" icon={faDatabase}/>
                </div>
                <div className="w-1/2 h-full">
                  <div className="w-full h-2/6">
                    <h1 className="text-4xl text-white">3.65 <span className="text-sm">TB</span></h1></div>
                  <div className="w-full h-2/6">
                    <h1 className="text-xl text-white uppercase">Hot Node</h1>
                  </div>
                  <div className="w-full h-2/6">
                    <h1 className="text-xl text-white uppercase">8 Days</h1>
                  </div>
                </div>
              </div>
              <div className="w-2/6 h-full flex">
                <div className="w-1/2 h-full flex items-center justify-end p-2">
                  <FontAwesomeIcon className="text-8xl text-yellow-500" icon={faDatabase}/>
                </div>
                <div className="w-1/2 h-full">
                  <div className="w-full h-2/6">
                    <h1 className="text-4xl text-white">2.15 <span className="text-sm">TB</span></h1></div>
                  <div className="w-full h-2/6">
                    <h1 className="text-xl text-white uppercase">Warm Node</h1>
                  </div>
                  <div className="w-full h-2/6">
                    <h1 className="text-xl text-white uppercase">32 Days</h1>
                  </div>
                </div>
              </div>
              <div className="w-2/6 h-full flex">
                <div className="w-1/2 h-full flex items-center justify-end p-2">
                  <FontAwesomeIcon className="text-8xl text-blue-400" icon={faDatabase}/>
                </div>
                <div className="w-1/2 h-full">
                  <div className="w-full h-2/6">
                    <h1 className="text-4xl text-white">2.37 <span className="text-sm">TB</span></h1></div>
                  <div className="w-full h-2/6">
                    <h1 className="text-xl text-white uppercase">Frozen Node</h1>
                  </div>
                  <div className="w-full h-2/6">
                    <h1 className="text-xl text-white uppercase">21 Days</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-full flex">
              <div className="w-4/6 h-5/6 flex-col justify-center text-white">
                <div className="w-full h-32 p-1">
                  <div className="w-full h-full bg-white bg-opacity-5">
                    <div className="w-full h-2/6 flex gap-2">
                      <div className="w-2/5 h-full"></div>
                      <div className="w-1/5 h-full flex items-center justify-center">
                        <h1 className="font-semibold text-xl">IOC&apos;s</h1>
                      </div>
                      <div className="w-1/5 h-full flex items-center justify-center">
                        <h1 className="font-semibold text-xl">Rules</h1>
                      </div>
                      <div className="w-1/5 h-full flex items-center justify-center">
                        <h1 className="font-semibold text-xl">MTTR</h1>
                      </div>
                    </div>
                    <div className="w-full h-4/6 flex gap-2">
                      <div className="w-2/5 h-full bg-white bg-opacity-10 flex items-center justify-center">
                        <h1 className="font-semibold text-xl">NA</h1>
                      </div>
                      <div className="w-1/5 h-full bg-white bg-opacity-10 flex-col items-center justify-center">
                        <h1
                          className="w-full h-1/2 flex items-center justify-center font-semibold text-xl text-center">0</h1>
                        <h1
                          className="w-full h-1/2 flex items-center justify-center text-xl text-center">Identified</h1>
                      </div>
                      <div className="w-1/5 h-full bg-white bg-opacity-10 flex-col items-center justify-center">
                        <h1
                          className="w-full h-1/2 flex items-center justify-center font-semibold text-xl text-center">0</h1>
                        <h1 className="w-full h-1/2 flex items-center justify-center text-xl text-center">Added</h1>
                      </div>
                      <div className="w-1/5 h-full bg-white bg-opacity-10 flex-col items-center justify-center">
                        <h1
                          className="w-full h-1/2 flex items-center justify-center font-semibold text-xl text-center">0</h1>
                        <h1 className="w-full h-1/2 flex items-center justify-center text-xl text-center">Days to
                          React</h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-32 p-1">
                  <div className="w-full h-full bg-white bg-opacity-5">
                    <div className="w-full h-2/6 flex gap-2">
                      <div className="w-2/5 h-full"></div>
                      <div className="w-1/5 h-full flex items-center justify-center">
                        <h1 className="font-semibold text-xl">IOC&apos;s</h1>
                      </div>
                      <div className="w-1/5 h-full flex items-center justify-center">
                        <h1 className="font-semibold text-xl">Rules</h1>
                      </div>
                      <div className="w-1/5 h-full flex items-center justify-center">
                        <h1 className="font-semibold text-xl">MTTR</h1>
                      </div>
                    </div>
                    <div className="w-full h-4/6 flex gap-2">
                      <div className="w-2/5 h-full bg-white bg-opacity-10 flex items-center justify-center">
                        <h1 className="font-semibold text-xl">NA</h1>
                      </div>
                      <div className="w-1/5 h-full bg-white bg-opacity-10 flex-col items-center justify-center">
                        <h1
                          className="w-full h-1/2 flex items-center justify-center font-semibold text-xl text-center">0</h1>
                        <h1
                          className="w-full h-1/2 flex items-center justify-center text-xl text-center">Identified</h1>
                      </div>
                      <div className="w-1/5 h-full bg-white bg-opacity-10 flex-col items-center justify-center">
                        <h1
                          className="w-full h-1/2 flex items-center justify-center font-semibold text-xl text-center">0</h1>
                        <h1 className="w-full h-1/2 flex items-center justify-center text-xl text-center">Added</h1>
                      </div>
                      <div className="w-1/5 h-full bg-white bg-opacity-10 flex-col items-center justify-center">
                        <h1
                          className="w-full h-1/2 flex items-center justify-center font-semibold text-xl text-center">0</h1>
                        <h1 className="w-full h-1/2 flex items-center justify-center text-xl text-center">Days to
                          React</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-2/6 h-5/6 flex-col justify-center">
                <div className="h-12 w-full  border-b-gray-400 border-b-2">
                  <h1 className="text-2xl flex items-center justify-center text-white">
                    Advisories<small className="text-sm"></small>
                  </h1>
                </div>
                <div className="h-5/6 w-full flex items-center justify-center">
                  <div className="h-full w-full">

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default ComponentDateReservoir