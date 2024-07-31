import ComponentPieChart from "@/Components/charts/ComponentPieChart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";

const ComponentTopNetworkStats = (props) =>{

  return (
    <div className="w-full h-full">
      <div className="w-full h-full grid grid-cols-12 grid-rows-15 gap-2">
        <div className="col-span-3 row-span-2 px-1">
          <div className="w-full h-full rounded shadow-lg bg-white text-black">
            <div className="w-full h-full flex">
              <div className="w-1/3 h-full flex items-center justify-center">
                <h1 className="text-4xl text-yellow-700 font-bold">34.3k</h1>
              </div>
              <div className="w-2/3 h-full flex-col">
                <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                  <h2 className="text-xl"><b>Total IPS</b> Counts</h2>
                </div>
                <div className="w-full h-1/2 flex-col items-center">
                  <div className="w-full h-1/2 flex items-center">
                    <small>
                      <FontAwesomeIcon icon={faCaretUp} className="text-green-700"/>
                      57%
                    </small>
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
        <div className="col-span-9 row-span-15 px-1">
          <div className="w-full h-full bg-white rounded-lg grid grid-rows-12 grid-cols-8 gap-2">

          </div>
        </div>
        <div className="col-span-3 row-span-2 px-1">
          <div className="w-full h-full rounded shadow-lg bg-white text-black">
            <div className="w-full h-full flex">
              <div className="w-1/3 h-full flex items-center justify-center">
                <h1 className="text-4xl text-yellow-700 font-bold">292.1K</h1>
              </div>
              <div className="w-2/3 h-full flex-col">
                <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                  <h2 className="text-xl"><b>Source IP&apos;s</b> Detected</h2>
                </div>
                <div className="w-full h-1/2 flex-col items-center">
                  <div className="w-full h-1/2 flex items-center">
                    <FontAwesomeIcon className="text-red-700 text-2xl" icon={faCaretUp}/>
                    <small className="">19.4 %</small>
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
        <div className="col-span-3 row-span-2 px-1">
          <div className="w-full h-full rounded shadow-lg bg-white text-black">
            <div className="w-full h-full flex">
              <div className="w-1/3 h-full flex items-center justify-center">
                <h1 className="text-4xl text-yellow-700 font-bold">204</h1>
              </div>
              <div className="w-2/3 h-full flex-col">
                <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                  <h2 className="text-xl"><b>Source Countries</b></h2>
                </div>
                <div className="w-full h-1/2 flex-col items-center">
                  <div className="w-full h-1/2 flex items-center">
                    <FontAwesomeIcon className="text-red-700 text-2xl" icon={faCaretUp}/>
                    <small className="">19.4 %</small>
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
        <div className="col-span-3 row-span-2 px-1">
          <div className="w-full h-full rounded shadow-lg bg-white text-black">
            <div className="w-full h-full flex">
              <div className="w-1/3 h-full flex items-center justify-center">
                <h1 className="text-4xl text-yellow-700 font-bold">675K</h1>
              </div>
              <div className="w-2/3 h-full flex-col">
                <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                  <h2 className="text-xl"><b>Destination IP&apos;s</b> Detected</h2>
                </div>
                <div className="w-full h-1/2 flex-col items-center">
                  <div className="w-full h-1/2 flex items-center">
                    <FontAwesomeIcon className="text-red-700 text-2xl" icon={faCaretUp}/>
                    <small className="">19.4 %</small>
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
        <div className="col-span-3 row-span-2 px-1">
          <div className="w-full h-full rounded shadow-lg bg-white text-black">
            <div className="w-full h-full flex">
              <div className="w-1/3 h-full flex items-center justify-center">
                <h1 className="text-4xl text-yellow-700 font-bold">104</h1>
              </div>
              <div className="w-2/3 h-full flex-col">
                <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                  <h2 className="text-xl"><b>Destination Countries</b></h2>
                </div>
                <div className="w-full h-1/2 flex-col items-center">
                  <div className="w-full h-1/2 flex items-center">
                    <FontAwesomeIcon className="text-red-700 text-2xl" icon={faCaretUp}/>
                    <small className="">19.4 %</small>
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
      </div>
    </div>
  )

}

export default ComponentTopNetworkStats;