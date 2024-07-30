import Image from "next/image";
import {Inter} from "next/font/google";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAnglesUp, faAnglesDown, faMinus} from "@fortawesome/free-solid-svg-icons";
import ComponentLineVerticleChart from "@/Components/charts/ComponentLineChart";
import ComponentPieChart from "@/Components/charts/ComponentPieChart";

const inter = Inter({subsets: ["latin"]});

export default function MonthlyReportV2() {
  return (
    <div className="w-screen overflow-hidden">
      <div className="w-screen bg-blue-900 text-white">
        <div className="h-14 flex justify-between items-center">
          <h1 className="text-3xl ml-2">THE TARION WARRANTY</h1>
          <h1
            className="text-3xl mr-2">{new Date().toLocaleDateString('default', {month: 'long'})} {new Date().getFullYear()}</h1>
        </div>
        <div className="h-48 flex">
          <div className="w-6/12 flex">
            <div className="w-full h-full flex-col p-2">
              <div className="h-20 mt-2 rounded shadow-lg bg-white text-black">
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
              <div className="h-20 mt-2 rounded shadow-lg bg-white text-black">
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
            </div>
            <div className="w-full h-full flex-col p-2">
              <div className="h-20 mt-2 rounded shadow-lg bg-white text-black">
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
              <div className="h-20 mt-2 rounded shadow-lg bg-white text-black">
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
            </div>
          </div>
          <div className="w-6/12 flex">
            <div className="w-full h-full flex-col p-2">
              <div className="h-20 mt-2 rounded shadow-lg bg-white text-black">
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
              <div className="h-20 mt-2 rounded shadow-lg bg-white text-black">
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
            </div>
            <div className="w-full h-full flex-col p-2">
              <div className="h-20 mt-2 rounded shadow-lg bg-white text-black">
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
              <div className="h-20 mt-2 rounded shadow-lg bg-white text-black">
                <div className="w-full h-full flex">
                  <div className="w-1/3 h-full flex items-center justify-center">
                    <h1 className="text-4xl text-yellow-700 font-bold">1</h1>
                  </div>
                  <div className="w-2/3 h-full flex-col">
                    <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                      <h2 className="text-xl"><b>NAC</b> Subscriptions</h2>
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
        </div>
        <div className="flex">
          <div className="w-6/12">

          </div>
          <div className="w-6/12 p-2">
            <div className="w-full flex">
              <div className="w-8/12 p-2 flex">
                <div className="w-36 h-36 ml-4 bg-white rounded-lg overflow-hidden">
                  <div className="w-full h-full">
                    <div className="h-12 w-full flex items-center justify-center border-2">
                      <h1 className="text-center text-black uppercase font-semibold">Data Reservoir</h1>
                    </div>
                    <div className="h-24 w-full flex items-center justify-center">
                      <h1 className="text-4xl text-yellow-600 font-bold">8.25</h1>
                      <small className="text-lg text-yellow-600">TB</small>
                    </div>
                  </div>
                </div>
                <div className="w-36 h-36 ml-4 bg-white rounded-lg overflow-hidden">
                  <div className="w-full h-full">
                    <div className="h-12 w-full flex items-center justify-center border-2">
                      <h1 className="text-center text-black uppercase">Hot Node</h1>
                    </div>
                    <div className="h-24 w-full flex items-center justify-center">
                      <h1 className="text-4xl text-red-600 font-bold">3.65</h1>
                      <small className="text-lg text-yellow-600">TB</small>
                    </div>
                  </div>
                </div>
                <div className="w-36 h-36 ml-4 bg-white rounded-lg overflow-hidden">
                  <div className="w-full h-full">
                    <div className="h-12 w-full flex items-center justify-center border-2">
                      <h1 className="text-center text-black uppercase">Warm Node</h1>
                    </div>
                    <div className="h-24 w-full flex items-center justify-center">
                      <h1 className="text-4xl text-orange-600 font-bold">2.15</h1>
                      <small className="text-lg text-yellow-600">TB</small>
                    </div>
                  </div>
                </div>
                <div className="w-36 h-36 ml-4 bg-white rounded-lg overflow-hidden">
                  <div className="w-full h-full">
                    <div className="h-12 w-full flex items-center justify-center border-2">
                      <h1 className="text-center text-black uppercase">Frozen Node</h1>
                    </div>
                    <div className="h-24 w-full flex items-center justify-center">
                      <h1 className="text-4xl text-sky-700 font-bold">2.37</h1>
                      <small className="text-lg text-yellow-600">TB</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-4/12 p-2 flex">
                <div className="w-full h-36 bg-white rounded-lg overflow-hidden">
                  <div className="h-12 flex items-center justify-center border-b">
                    <h1 className="text-black font-semibold text-lg uppercase">SIEM Performace Metrics</h1>
                  </div>
                  <div className="h-24 w-full text-black flex">
                    <div className="w-1/2 h-full p-2">
                      <div className="h-1/3">
                        <h1 className="font-semibold uppercase text-center">MTTD</h1>
                      </div>
                      <div
                        className="h-1/3 flex items-center justify-center font-bold text-yellow-600 text-3xl">11.5
                      </div>
                      <div className="h-1/3">
                        <h1 className="text-center">Minutes</h1>
                      </div>
                    </div>
                    <div className="w-1/2 h-full p-2 border-l">
                      <div className="h-1/3">
                        <h1 className="font-semibold uppercase text-center">Query Wait</h1>
                      </div>
                      <div
                        className="h-1/3 flex items-center justify-center font-bold text-yellow-600 text-3xl">&lt; 200
                      </div>
                      <div className="h-1/3">
                        <h1 className="text-center">Miliseconds</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex bg-white rounded-lg">
              <div className="w-6/12 h-72">
                <div className="p-5">
                  <ComponentLineVerticleChart/>
                </div>
              </div>
              <div className="w-6/12 h-72 border-l">
                <div className="p-5">
                  <ComponentLineVerticleChart/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex-col justify-evenly">
          <div className="w-full flex justify-center my-5">
            <div className="w-4/12 h-20 rounded shadow-lg bg-white text-black">
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-6xl text-yellow-700 font-bold">002</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-2xl"><b>Firewall</b> Subscriptions</h2>
                  </div>
                  <div className="w-full h-1/2 flex-col items-center">
                    <div className="w-full h-1/2 flex items-center">
                      <small className=""></small>
                    </div>
                    <div className="w-full h-1/2 flex items-center">
                      <small className=""></small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-evenly my-5">
            <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
              <div className="w-full h-24 flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-3xl text-yellow-700 font-bold">388.5</h1>
                  <h1 className="text-2xl text-yellow-700 font-bold">m</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl">Total Logs</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <h3 className="text-xl mr-2">12%</h3>
                    <FontAwesomeIcon className="text-green-700" icon={faAnglesUp}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
              <div className="w-full h-24 flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-3xl text-yellow-700 font-bold">100.4</h1>
                  <h1 className="text-2xl text-yellow-700 font-bold">m</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl">Allowed Traffic</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <h3 className="text-xl mr-2">21%</h3>
                    <FontAwesomeIcon className="text-green-700" icon={faAnglesUp}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
              <div className="w-full h-24 flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-3xl text-yellow-700 font-bold">12.1</h1>
                  <h1 className="text-2xl text-yellow-700 font-bold">m</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl">Denied Traffic</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <h3 className="text-xl mr-2">50%</h3>
                    <FontAwesomeIcon className="text-red-700" icon={faAnglesUp}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
              <div className="w-full h-24 flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-3xl text-yellow-700 font-bold">34.4</h1>
                  <h1 className="text-2xl text-yellow-700 font-bold">k</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl">IPS Hits</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <h3 className="text-xl mr-2">57%</h3>
                    <FontAwesomeIcon className="text-green-700" icon={faAnglesUp}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
              <div className="w-full h-24 flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-3xl text-yellow-700 font-bold">715</h1>
                  <h1 className="text-2xl text-yellow-700 font-bold"></h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl">Admin Activities</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <h3 className="text-xl mr-2">22.6%</h3>
                    <FontAwesomeIcon className="text-green-700" icon={faAnglesDown}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-evenly">
            <div className="w-4/12 h-96 bg-white">
              <div className="h-12 flex items-center justify-center border-b">
                <h1 className="text-xl text-black uppercase font-semibold">Most Active Blades</h1>
              </div>
              <div className="w-full h-80 flex items-center justify-center">
                <ComponentPieChart/>
              </div>
            </div>
            <div className="w-4/12 h-96 bg-white border-l">
              <div className="h-12 flex items-center justify-center border-b">
                <h1 className="text-xl text-black uppercase font-semibold">Top External Threats</h1>
              </div>
              <div className="w-full h-80 flex items-center justify-center">
                <ComponentPieChart/>
              </div>
            </div>
            <div className="w-4/12 h-96 bg-white border-l">
              <div className="w-full h-full p-2">
                <div className="w-full h-full text-black">
                  <div className="w-full h-11 flex border-b">
                    <div className="w-full text-center">
                      <h1 className="text-xl text-black uppercase font-semibold">IPS Hits Analysis</h1>
                    </div>
                  </div>
                  <div className="w-full h-12 flex border-b">
                    <div className="w-4/12 border-r flex justify-center items-center">
                      <h1 className="text-xl text-black uppercase font-semibold">Source</h1>
                    </div>
                    <div className="w-4/12 border-r flex justify-center items-center">
                      <h1 className="text-xl text-black uppercase font-semibold">Destination</h1>
                    </div>
                    <div className="w-4/12 flex justify-center items-center">
                      <h1 className="text-xl text-black uppercase font-semibold">Attack Type</h1>
                    </div>
                  </div>
                  <div className="w-full h-11 flex border-b">
                    <div className="w-4/12 border-r"></div>
                    <div className="w-4/12 border-r"></div>
                    <div className="w-4/12"></div>
                  </div>
                  <div className="w-full h-11 flex border-b">
                    <div className="w-4/12 border-r"></div>
                    <div className="w-4/12 border-r"></div>
                    <div className="w-4/12"></div>
                  </div>
                  <div className="w-full h-11 flex border-b">
                    <div className="w-4/12 border-r"></div>
                    <div className="w-4/12 border-r"></div>
                    <div className="w-4/12"></div>
                  </div>
                  <div className="w-full h-11 flex border-b">
                    <div className="w-4/12 border-r"></div>
                    <div className="w-4/12 border-r"></div>
                    <div className="w-4/12"></div>
                  </div>
                  <div className="w-full h-11 flex border-b">
                    <div className="w-4/12 border-r"></div>
                    <div className="w-4/12 border-r"></div>
                    <div className="w-4/12"></div>
                  </div>
                  <div className="w-full h-11 flex border-b">
                    <div className="w-4/12 border-r"></div>
                    <div className="w-4/12 border-r"></div>
                    <div className="w-4/12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-evenly">
            <div className="w-4/12 h-96 bg-white border-l">
              <div className="w-full h-full p-2">
                <div className="w-full h-full text-black">
                  <div className="w-full h-11 flex border-b">
                    <div className="w-full text-center">
                      <h1 className="text-xl text-black uppercase font-semibold">Most Active Blades</h1>
                    </div>
                  </div>
                  <div className="w-full h-12 flex border-b">
                    <div className="w-6/12 border-r flex justify-center items-center">
                      <h1 className="text-lg text-black uppercase font-semibold">Site Name</h1>
                    </div>
                    <div className="w-6/12 border-r flex justify-center items-center">
                      <h1 className="text-lg text-black uppercase font-semibold"># of Logs</h1>
                    </div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-6/12 border-r text-center">VPN-1 & Firewall-1</div>
                    <div className="w-6/12 border-r">383.4M</div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-6/12 border-r text-center">Smart Defence</div>
                    <div className="w-6/12 border-r">4M</div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-6/12 border-r text-center">Log Update</div>
                    <div className="w-6/12 border-r">223K</div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-6/12 border-r text-center">CloudGaurd IaaS</div>
                    <div className="w-6/12 border-r">178K</div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-6/12 border-r text-center">WEB_API</div>
                    <div className="w-6/12 border-r">49K</div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-6/12 border-r text-center">Connectra</div>
                    <div className="w-6/12 border-r">42K</div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-6/12 border-r text-center">Application Control</div>
                    <div className="w-6/12 border-r">45K</div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-6/12 border-r text-center">Compliance Blade</div>
                    <div className="w-6/12 border-r">30.4K</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-4/12 h-96 bg-white border-l">
              <div className="w-full h-full p-2">
                <div className="w-full h-full text-black">
                  <div className="w-full h-11 flex border-b">
                    <div className="w-full text-center">
                      <h1 className="text-xl text-black uppercase font-semibold">Top External Threat</h1>
                    </div>
                  </div>
                  <div className="w-full h-12 flex border-b">
                    <div className="w-full border-r flex justify-center items-center">
                      <h1 className="text-lg text-black uppercase font-semibold">Threat Intel Source IPs</h1>
                    </div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-full border-r text-center">104.156.155.22</div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-full border-r text-center">159.203.91.246</div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-full border-r text-center">185.189.182.234</div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-full border-r text-center">104.156.155.22</div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-full border-r text-center">159.203.91.246</div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-full border-r text-center">185.189.182.234</div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-full border-r text-center">104.156.155.22</div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-full border-r text-center">159.203.91.246</div>
                  </div>
                  <div className="w-full h-8 flex border-b">
                    <div className="w-full border-r text-center">185.189.182.234</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-4/12 h-96 bg-white border-l">
              <div className="w-full h-full p-2">
                <div className="w-full h-full text-black">
                  <div className="w-full h-11 flex border-b">
                    <div className="w-full text-center">
                      <h1 className="text-xl text-black uppercase font-semibold">Security Overview Remarks</h1>
                    </div>
                  </div>
                  <div className="w-full h-full flex border-b">
                    <ul className="list-disc p-5">
                      <li>We have observed an upward trend on the total log ingestion.</li>
                      <li>We observed the use of attack type "Apache OFBiz, Authentication Bypass (CVE-2023-51467)" is in a rise.</li>
                      <li>General  recommendation will be to upgrade Apache OfBiz software to version 18.12.11, if it exists on your network and if not done already.</li>
                      <li>We recommended blocking these exploits in IPSif it is not required for operational purpose.</li>
                      <li>A2N recommended to block all the malicious IP.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex border-t mt-5">
          <div className="w-5/12 h-96 bg-white">
            <div className="h-8 w-full text-center">
              <h1 className="text-xl text-black uppercase font-semibold">Top Network Stats</h1>
            </div>
            <div className="w-full h-full text-black flex">
              <div className="w-3/12 border-r">
                <div className="h-8 w-full">
                  <h1 className="text-black uppercase text-center font-semibold">Sources</h1>
                </div>
                <div className="h-8 w-full">192.168.0.78</div>
              </div>
              <div className="w-3/12 border-r">
                <div className="h-8 w-full">
                  <h1 className="text-black uppercase text-center font-semibold">Destinations</h1>
                </div>
                <div className="h-8 w-full"></div>
              </div>
              <div className="w-3/12 border-r">
                <div className="h-8 w-full">
                  <h1 className="text-black uppercase text-center font-semibold">N Protocols</h1>
                </div>
                <div className="h-8 w-full"></div>
              </div>
              <div className="w-3/12 border-r">
                <div className="h-8 w-full">
                  <h1 className="text-black uppercase text-center font-semibold">Rule Name</h1>
                </div>
                <div className="h-8 w-full border-b">Remote access Rule</div>
                <div className="h-8 w-full border-b">TWC-744</div>
                <div className="h-8 w-full border-b">Cleanup Rule</div>
                <div className="h-8 w-full border-b">Geo Blocking Outbound</div>
                <div className="h-8 w-full border-b">Geo Blocking Inbound</div>
              </div>
            </div>
          </div>
          <div className="w-7/12 h-96 bg-white">
          </div>
        </div>

        <div className="w-full flex justify-evenly">
          <div className="w-full flex justify-evenly my-5">
            <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
              <div className="w-full h-24 flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-3xl text-yellow-700 font-bold">34.3</h1>
                  <h1 className="text-2xl text-yellow-700 font-bold">K</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl">Total IPS Count</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <h3 className="text-xl mr-2">57%</h3>
                    <FontAwesomeIcon className="text-green-700" icon={faAnglesUp}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
              <div className="w-full h-24 flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-3xl text-yellow-700 font-bold">292.2</h1>
                  <h1 className="text-2xl text-yellow-700 font-bold">K</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl">Source IPs Detected</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <h3 className="text-xl mr-2">4%</h3>
                    <FontAwesomeIcon className="text-green-700" icon={faAnglesUp}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
              <div className="w-full h-24 flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-3xl text-yellow-700 font-bold">204</h1>
                  <h1 className="text-2xl text-yellow-700 font-bold"></h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl">Source Countries</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <h3 className="text-xl mr-2">2%</h3>
                    <FontAwesomeIcon className="text-green-700" icon={faAnglesUp}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
              <div className="w-full h-24 flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-3xl text-yellow-700 font-bold">675</h1>
                  <h1 className="text-2xl text-yellow-700 font-bold">K</h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl">Dest. IPs Detected</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <h3 className="text-xl mr-2">2.9%</h3>
                    <FontAwesomeIcon className="text-green-700" icon={faAnglesUp}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/12 h-full rounded shadow-lg bg-white text-black">
              <div className="w-full h-24 flex">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <h1 className="text-3xl text-yellow-700 font-bold">104</h1>
                  <h1 className="text-2xl text-yellow-700 font-bold"></h1>
                </div>
                <div className="w-2/3 h-full flex-col">
                  <div className="w-full h-1/2 flex items-center border-b border-b-gray-300">
                    <h2 className="text-xl">Dest. Countries</h2>
                  </div>
                  <div className="w-full h-1/2 flex items-center">
                    <h3 className="text-xl mr-2">5.5%</h3>
                    <FontAwesomeIcon className="text-green-700" icon={faAnglesDown}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
