import ComponentPieChart from "@/components/charts/ComponentPieChart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp, faCaretUp} from "@fortawesome/free-solid-svg-icons";

const ComponentEndpointProtection = (props) => {

  return (
    <div className="w-full h-full">
      <div className="w-full h-full grid grid-cols-12 grid-rows-16 gap-2">
        <div className="col-span-12 row-span-2 flex">
          <div className="h-full w-2/12">
            <div className="w-full h-full bg-logo bg-contain bg-center bg-no-repeat">
            </div>
          </div>
          <div className="h-full w-10/12">
            <div className="w-full h-full flex items-center justify-center">
              <h1
                className="w-full text-4xl text-white text-right pr-5 border-b-gray-400 border-b-2 uppercase">Advisory
                Watchdog</h1>
            </div>
          </div>
        </div>
        <div className="col-span-4 row-span-14 grid grid-cols-12 grid-rows-15 gap-2">
          <div className="col-span-12 row-span-2 px-1">
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
                      <small className=""> {new Intl.NumberFormat('en', {
                        notation: 'compact',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }).format(12950739.3)} logs/d</small>
                    </div>
                    <div className="w-full h-1/2 flex items-center">
                      <small className="">{new Intl.NumberFormat('en', {
                        notation: 'compact',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }).format(8993.57)} logs/m</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 row-span-1 px-1">
            <div
              className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black flex items-center justify-center">
              <h1 className="text-xl text-yellow-500 font-bold">Advisory Highlights</h1>
            </div>
          </div>
          <div className="col-span-12 row-span-3 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">7</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
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
          <div className="col-span-12 row-span-3 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">7</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
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
          <div className="col-span-12 row-span-3 px-1">
            <div className="w-full h-full rounded shadow-lg bg-white bg-opacity-5 text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-4xl text-yellow-500 font-bold">7</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
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
        <div className="col-span-8 row-span-14 grid grid-cols-12 grid-rows-15">
          <div className="col-span-12 row-span-15 px-1">
            <div className="w-full h-full grid grid-rows-12 grid-cols-8 gap-1">
              <div className="col-span-5 row-span-12 text-white">
                <div
                  className="w-full h-full p-2 flex-col items-start justify-evenly bg-white bg-opacity-5 rounded-lg gap-4">
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
                          <h1 className="w-full h-1/2 flex items-center justify-center font-semibold text-xl text-center">0</h1>
                          <h1 className="w-full h-1/2 flex items-center justify-center text-xl text-center">Identified</h1>
                        </div>
                        <div className="w-1/5 h-full bg-white bg-opacity-10 flex-col items-center justify-center">
                          <h1 className="w-full h-1/2 flex items-center justify-center font-semibold text-xl text-center">0</h1>
                          <h1 className="w-full h-1/2 flex items-center justify-center text-xl text-center">Added</h1>
                        </div>
                        <div className="w-1/5 h-full bg-white bg-opacity-10 flex-col items-center justify-center">
                          <h1 className="w-full h-1/2 flex items-center justify-center font-semibold text-xl text-center">0</h1>
                          <h1 className="w-full h-1/2 flex items-center justify-center text-xl text-center">Days to React</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-3 row-span-6">
                <div
                  className="w-full h-full p-2 flex-col items-center justify-center bg-white bg-opacity-5 rounded-lg">
                  <div className="h-1/6 w-full  border-b-gray-400 border-b-2">
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
    </div>
  )

}

export default ComponentEndpointProtection;