import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAnglesDown, faAnglesUp, faMinus} from "@fortawesome/free-solid-svg-icons";

const MonthlyReport = (props) => {
  return (
    <>
      <div className="w-full h-24 flex">
        <div className="w-4/12 h-full flex items-center justify-center">
          <h1 className="text-3xl">TARION WARRENT COMPANY</h1>
        </div>
        <div className="w-4/12"></div>
        <div className="w-3/12 h-full flex items-center justify-center">
          <h1 className="text-2xl">
            {new Date().toLocaleDateString('default', {month: 'long'}) + " " + new Date().getFullYear().toString()}
          </h1>
        </div>
      </div>

      <div className="w-full h-12 my-5">
        <h1 className="text-2xl">DATA SOURCES</h1>
      </div>

      <div className="w-full h-32">
        <div className="w-full h-28 flex justify-evenly">
          <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
            <div className="w-full h-full flex">
              <div className="w-1/3 h-full flex items-center justify-center">
                <h1 className="text-4xl text-yellow-700 font-bold">775</h1>
              </div>
              <div className="w-2/3 h-full flex-col">
                <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                  <h2 className="text-xl">Data Sources</h2>
                </div>
                <div className="w-full h-1/2 flex items-center">
                  <h3 className="text-xl mr-2">1%</h3>
                  <FontAwesomeIcon className="text-red-700" icon={faAnglesDown}/>
                </div>
              </div>
            </div>
          </div>
          <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
            <div className="w-full h-full flex">
              <div className="w-1/3 h-full flex items-center justify-center">
                <h1 className="text-4xl text-yellow-700 font-bold">2.79</h1>
                <h1 className="text-2xl text-yellow-700 font-bold">B</h1>
              </div>
              <div className="w-2/3 h-full flex-col">
                <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                  <h2 className="text-xl">Total Logs Analyzed</h2>
                </div>
                <div className="w-full h-1/2 flex items-center">
                  <h3 className="text-xl mr-2">33%</h3>
                  <FontAwesomeIcon className="text-green-700" icon={faAnglesUp}/>
                </div>
              </div>
            </div>
          </div>
          <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
            <div className="w-full h-full flex">
              <div className="w-1/3 h-full flex items-center justify-center">
                <h1 className="text-4xl text-yellow-700 font-bold">48</h1>
                <h1 className="text-2xl text-yellow-700 font-bold">k</h1>
              </div>
              <div className="w-2/3 h-full flex-col">
                <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                  <h2 className="text-xl">Alerts Generated</h2>
                </div>
                <div className="w-full h-1/2 flex items-center">
                  <h3 className="text-xl mr-2">100%</h3>
                  <FontAwesomeIcon className="text-green-700" icon={faAnglesUp}/>
                </div>
              </div>
            </div>
          </div>
          <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
            <div className="w-full h-full flex">
              <div className="w-1/3 h-full flex items-center justify-center">
                <h1 className="text-4xl text-yellow-700 font-bold">0</h1>
                <h1 className="text-2xl text-yellow-700 font-bold"></h1>
              </div>
              <div className="w-2/3 h-full flex-col">
                <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                  <h2 className="text-xl">Critical Advisories</h2>
                </div>
                <div className="w-full h-1/2 flex items-center">
                  <h3 className="text-xl mr-2">33%</h3>
                  <FontAwesomeIcon className="text-green-700" icon={faMinus}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-6/12 h-full my-5">
        <div className="grid grid-cols-5 grid-rows-1">
          <div>
            <h1 className="font-semibold text-lg text-center border">Site Name</h1>
          </div>
          <div>
            <h1 className="font-semibold text-lg text-center border">Device Type</h1>
          </div>
          <div>
            <h1 className="font-semibold text-lg text-center border">Vendors</h1>
          </div>
          <div>
            <h1 className="font-semibold text-lg text-center border">Devices</h1>
          </div>
          <div>
            <h1 className="font-semibold text-lg text-center border"># of Logs</h1>
          </div>
        </div>
        <div className="grid grid-cols-5 grid-rows-3">
          <div className="row-span-3 flex items-center justify-center border font-semibold">Main Site</div>
          <div className="border font-thin text-center">Firewall</div>
          <div className="border font-thin text-center">Checkpoint</div>
          <div className="border font-thin text-center">2</div>
          <div className="border font-thin text-center">342.8M</div>

          <div className="border font-thin text-center">Servers</div>
          <div className="border font-thin text-center">Windows</div>
          <div className="border font-thin text-center">162</div>
          <div className="border font-thin text-center">2.75B</div>

          <div className="border font-thin text-center">NAC</div>
          <div className="border font-thin text-center">Aruba ClearPass</div>
          <div className="border font-thin text-center">1</div>
          <div className="border font-thin text-center">74.4K</div>
        </div>

        <div className="grid grid-cols-5 grid-rows-3">
          <div className="row-span-3 flex items-center justify-center border font-semibold">Cloud</div>
          <div className="border font-thin text-center">Firewall</div>
          <div className="border font-thin text-center">Checkpoint</div>
          <div className="border font-thin text-center">2</div>
          <div className="border font-thin text-center">342.8M</div>

          <div className="border font-thin text-center">Servers</div>
          <div className="border font-thin text-center">Windows</div>
          <div className="border font-thin text-center">162</div>
          <div className="border font-thin text-center">2.75B</div>

          <div className="border font-thin text-center">NAC</div>
          <div className="border font-thin text-center">Aruba ClearPass</div>
          <div className="border font-thin text-center">1</div>
          <div className="border font-thin text-center">74.4K</div>
        </div>
        <div className="grid grid-cols-5 grid-rows-1">
          <div className="col-span-3 flex items-center justify-center font-bold border">TOTAL</div>
          <div className="border font-semibold text-center">775</div>
          <div className="border font-semibold text-center">2.79B</div>
        </div>
      </div>

      <div className="w-full h-32">
        <div className="w-full h-28 flex justify-evenly">
          <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
            <div className="w-full h-full flex">
              <div className="w-1/3 h-full flex items-center justify-center">
                <h1 className="text-4xl text-yellow-700 font-bold">4</h1>
              </div>
              <div className="w-2/3 h-full flex-col">
                <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                  <h2 className="text-xl"><b>Firewall</b> Subscriptions</h2>
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
          <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
            <div className="w-full h-full flex">
              <div className="w-1/3 h-full flex items-center justify-center">
                <h1 className="text-4xl text-yellow-700 font-bold">162</h1>
              </div>
              <div className="w-2/3 h-full flex-col">
                <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                  <h2 className="text-xl"><b>Servers</b> Subscriptions</h2>
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
          <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
            <div className="w-full h-full flex">
              <div className="w-1/3 h-full flex items-center justify-center">
                <h1 className="text-4xl text-yellow-700 font-bold">609</h1>
              </div>
              <div className="w-2/3 h-full flex-col">
                <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                  <h2 className="text-xl"><b>EDR</b> Subscriptions</h2>
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
          <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
            <div className="w-full h-full flex">
              <div className="w-1/3 h-full flex items-center justify-center">
                <h1 className="text-4xl text-yellow-700 font-bold">1</h1>
              </div>
              <div className="w-2/3 h-full flex-col">
                <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                  <h2 className="text-xl"><b>Network Access Control</b> Subscriptions</h2>
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
      </div>

      <div className="w-full">
        <div className="w-full flex justify-evenly">
          <div className="w-4/12 border">
            <div className="w-full flex p-2 text-blue-950">
              <div className="w-1/3 bg-white rounded-l-lg overflow-hidden">
                <div className="w-full h-8 bg-white text-blue-950">
                  <h1 className="text-lg font-semibold uppercase text-center">Hot Node</h1>
                </div>
                <div className="h-20">
                  <h1 className="text-lg uppercase text-center">8 Days</h1>
                  <div className="flex items-end justify-center">
                    <h1 className="text-3xl font-bold">8.25</h1>
                    <small>TB</small>
                  </div>
                </div>
              </div>
              <div className="w-1/3 bg-white border-l border-r">
                <div className="w-full h-8 bg-white text-blue-950">
                  <h1 className="text-lg font-semibold uppercase text-center">Warm Node</h1>
                </div>
                <div className="h-20">
                  <h1 className="text-lg uppercase text-center">32 Days</h1>
                  <div className="flex items-end justify-center">
                    <h1 className="text-3xl font-bold">2.15</h1>
                    <small>TB</small>
                  </div>
                </div>
              </div>
              <div className="w-1/3 bg-white rounded-r-lg overflow-hidden">
                <div className="w-full h-8 bg-white text-blue-950">
                  <h1 className="text-lg font-semibold uppercase text-center">Frozen Node</h1>
                </div>
                <div className="h-20">
                  <h1 className="text-lg uppercase text-center">21 Days</h1>
                  <div className="flex items-end justify-center">
                    <h1 className="text-3xl font-bold">2.37</h1>
                    <small>TB</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full p-2">
              <div className="bg-white rounded-lg">
                <div className="h-12 flex items-center justify-center">
                  <h1 className="text-xl text-center text-blue-950 font-semibold uppercase">Data Reservoir</h1>
                </div>
                <div className="h-24 flex items-center justify-center">
                  <h1 className="text-3xl text-center text-blue-950 font-semibold uppercase">8.25 TB</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="w-4/12 border"></div>
          <div className="w-4/12 border"></div>
        </div>
      </div>
    </>
  )
}

export default MonthlyReport;