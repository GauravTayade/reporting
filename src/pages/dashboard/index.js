import Image from "next/image";
import React, {useContext, useState} from "react";
import {useEffect} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem,
  Switch,
  Select,
  SelectItem,
  Dropdown,
  DropdownTrigger,
  Pagination,
  DropdownMenu,
  DropdownItem,
  User,
  Link
} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faEye,
  faHourglass,
  faMagnifyingGlassChart,
  faMagnifyingGlassArrowRight, faEnvelopeCircleCheck
} from "@fortawesome/free-solid-svg-icons";
import {signOut, useSession} from "next-auth/react";


const Index = () => {

  const router = useRouter();
  const {data,status} = useSession()

  const [customerList,setCustomerList] = useState([]);
  const [customerReportList, setCustomerReportList] = useState([]);
  const [customerReportFormat, setCustomerReportFormat] = useState([
    "pdf","csv","excel"
  ])
  const [customerReportOccurance,setCustomerReportOccurance] = useState([
    "monthly","biweekly","weekly","daily","custom"
  ])

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = process.env.NEXT_PUBLIC_PAGE_LIMIT
  const [totalPage,setTotalPage] = useState(0)
  const [initialStart,setInitialStart] = useState(0)

  const [isDelivered, setIsDelivered] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [searchByClientName, setSearchByClientName] = useState(null);
  const [searchByReportType, setSearchByReportType] = useState(null);
  const [searchByReportFormat, setSearchByReportFormat] = useState(null);
  const [searchByReportOccurrence, setSearchByReportOccurrence] = useState(null);
  const [limit,setLimit] = useState(10);
  const [offset,setOffset] = useState(0);

  const getReports = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + "/users/getCustomerReports", {
      params: {
        limit: 10,
        offset: 0
      }
    })
      .then(response => {
        if (response.data.length > 0) {
          setCustomerReportList(response.data)
          setTotalPage(Math.ceil(customerReportList.length / itemsPerPage))
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const getCustomers = async () => {
    await axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL + '/users/getCustomerList')
      .then(response => {
        if (response.data) {
          setCustomerList(response.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const handlePageChange = async(page) =>{
    setCurrentPage(page)
    setInitialStart((Number(page) * Number(process.env.NEXT_PUBLIC_PAGE_LIMIT)) - process.env.NEXT_PUBLIC_PAGE_LIMIT)
  }

  const handleViewButtonOnClick=(reportId)=>{
    router.push('/report/'+reportId)
  }

  const handleIsReviewed=(e)=>{

    setIsReviewed(e.target.checked)
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/users/getCustomerReports",{
      params:{
        is_reviewed: e.target.checked,
        is_delivered: isDelivered,
        is_pending:isPending,
        searchByClientName:searchByClientName,
        searchByReportFormat:searchByReportFormat,
        searchByReportOccurrence:searchByReportOccurrence,
        searchByReportType:searchByReportType,
        limit:limit,
        offset:offset
      }
    })
      .then(response =>{
        setCustomerReportList(response.data)
      })
      .catch(error =>{

      })

  }

  const handleIsDelivered=(e)=>{

    setIsDelivered(e.target.checked)
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/users/getCustomerReports",{
      params:{
        is_reviewed: isReviewed,
        is_delivered: e.target.checked,
        is_pending:isPending,
        searchByClientName:searchByClientName,
        searchByReportFormat:searchByReportFormat,
        searchByReportOccurrence:searchByReportOccurrence,
        searchByReportType:searchByReportType,
        limit:limit,
        offset:offset
      }
    })
      .then(response =>{
        setCustomerReportList(response.data)
      })
      .catch(error =>{

      })

  }

  const handleIsPending=(e)=>{

      axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/users/getCustomerReports",{
        params:{
          is_reviewed: isReviewed,
          is_delivered: isDelivered,
          is_pending:e.target.checked,
          searchByClientName:searchByClientName,
          searchByReportFormat:searchByReportFormat,
          searchByReportOccurrence:searchByReportOccurrence,
          searchByReportType:searchByReportType,
          limit:limit,
          offset:offset
        }
      })
        .then(response =>{
          setCustomerReportList(response.data)
        })
        .catch(error =>{

        })


  }

  const handleClientSelect=(e)=>{

    if(e.target.value){
      setSearchByClientName('\'' +e.target.value.split(',').join('\',\'')+ '\'')
    }else{
      setSearchByClientName(null)
    }

  }

  const handleReportFormatSelect=(e)=>{

    if(e.target.value){
      setSearchByReportFormat('\'' +e.target.value.split(',').join('\',\'')+ '\'')
    }else{
      setSearchByReportFormat(null)
    }

  }

  const handleReportOccuranceSelect=(e)=>{

    if(e.target.value){
      setSearchByReportOccurrence('\'' +e.target.value.split(',').join('\',\'')+ '\'')
    }else{
      setSearchByReportOccurrence(null)
    }

  }

  const handleFilter =() =>{
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/users/getCustomerReports",{
      params:{
        is_reviewed: isReviewed,
        is_delivered: isDelivered,
        is_pending:isPending,
        searchByClientName:searchByClientName,
        searchByReportFormat:searchByReportFormat,
        searchByReportOccurrence:searchByReportOccurrence,
        searchByReportType:searchByReportType,
        limit:limit,
        offset:offset
      }
    })
      .then(response =>{
        setCustomerReportList(response.data)
      })
      .catch(error =>{

      })
  }

  const handleLogout = () =>{
    signOut()
  }


  useEffect(() => {

    try{
      Promise.all([
        getCustomers(),
        getReports()
      ]).then(result => {

      })
    }
    catch(error){
      throw new Error(error)
    }

  }, []);

  return (
      <div className="w-screen h-screen p-2 bg-blue-900">
        <div className="w-full h-full grid grid-cols-12 grid-rows-12">
          <div className="row-span-1 col-span-12">
            <Navbar position="static" isBordered className="bg-white/10 text-white justify-evenly">
              <NavbarContent justify="left">
              <NavbarBrand>
                <Image
                  className="mx-auto h-10 w-auto"
                  src="/assets/images/logo_header_a2n.png"
                  alt="Access 2 Network INC"
                  width={270}
                  height={120}
                />
                {/*<p className="font-bold text-inherit">A2N</p>*/}
              </NavbarBrand>
              </NavbarContent>
              <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive>
                  <Link  className="text-white uppercase" href="/dashboard" aria-current="page">
                    Reports
                  </Link>
                </NavbarItem>
                {data && data.user.role === 'admin' ?
                  <>
                  <NavbarItem>
                    <Link  className="text-white uppercase" href="#" aria-current="page">
                    Customers
                    </Link>
                  </NavbarItem>
                  <NavbarItem>
                    <Link className="text-white uppercase" href="#">
                    Devices
                    </Link>
                  </NavbarItem>
                  </>
                  : ''}
              </NavbarContent>
              <NavbarContent justify="right">
                <NavbarItem className="hidden lg:flex">
                  <Dropdown>
                    <DropdownTrigger>
                      <User className="text-white" name={data?data.user.name.toUpperCase() : ''} description={data?data.user.role:''} avatarProps={{src:"https://i.pinimg.com/564x/4e/22/be/4e22beef6d94640c45a1b15f4a158b23.jpg"}}/>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="profile action">
                      <DropdownItem>Profile</DropdownItem>
                      <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </NavbarItem>
              </NavbarContent>
            </Navbar>
          </div>
          <div className="row-span-12 col-span-12">
            <div className="w-full h-1/6 bg-white/20 p-1">
              <div className="w-full h-full flex">
                <div className="w-1/12 h-full flex items-center justify-center">
                  <label htmlFor="isReviewed" className="text-white text-lg">Reviewed</label>
                  <Switch onChange={handleIsReviewed} id="isReviewed">
                  </Switch>
                </div>
                <div className="w-1/12 h-full flex items-center justify-center">
                  <label htmlFor="isDelivered" className="text-white text-lg">Delivered</label>
                  <Switch onChange={handleIsDelivered} id="isDelivered">
                  </Switch>
                </div>
                <div className="w-1/12 h-full flex items-center justify-center">
                  <label htmlFor="isPending" className="text-white text-lg">Pending</label>
                  <Switch onChange={handleIsPending} id="isPending">
                  </Switch>
                </div>
                <div className="w-3/12 h-full flex items-center justify-center">
                  <label className="text-lg text-white p-2">Client:</label>
                  <Select aria-label="Client" onChange={(e) => handleClientSelect(e)}
                          labelPlacement="outside-left" placeholder="All" selectionMode="multiple"
                          className="max-w-xs">
                    {customerList.map((customer) => (
                      <SelectItem key={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="w-3/12 h-full flex items-center justify-center">
                  <label className="text-lg text-white p-2">Format:</label>
                  <Select aria-label="Report Format" onChange={(e) => handleReportFormatSelect(e)}
                          labelPlacement="outside-left"
                          placeholder="All"
                          selectionMode="multiple" className="max-w-xs">
                    {customerReportFormat.map((format) => (
                      <SelectItem key={format}>
                      {format}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="w-2/12 h-full flex items-center justify-center">
                  <label className="text-lg text-white p-2">Type:</label>
                  <Select aria-label="report-type" onChange={(e) => handleReportOccuranceSelect(e)} labelPlacement="outside-left"
                          placeholder="All"
                          selectionMode="multiple" className="max-w-xs">
                    {customerReportOccurance.map((occurance) => (
                      <SelectItem key={occurance}>
                        {occurance}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="w-1/12 h-full flex items-center justify-center">
                  <button aria-label="filter" onClick={handleFilter}
                          className="bg-green-700 p-2 w-32 h-12 text-white text=lg shadow rounded-lg">Filter
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full h-5/6 p-1">
              <div className="w-full h-5/6">
                <div className="w-full h-full bg-white/10 p-2">
                  <div className="w-full h-12 border-b border-b-white flex text-white">
                    <div className="w-1/12 h-12 flex items-center justify-center text-lg font-semibold uppercase">
                      #
                    </div>
                    <div className="w-2/12 h-12 flex items-center justify-center text-lg font-semibold uppercase">
                      Customer Name
                    </div>
                    <div className="w-1/12 h-12 flex items-center justify-center text-lg font-semibold uppercase">
                      Date
                    </div>
                    <div className="w-1/12 h-12 flex items-center justify-center text-lg font-semibold uppercase">
                      Report Type
                    </div>
                    <div className="w-3/12 h-12 flex items-center justify-center text-lg font-semibold uppercase">
                      Report Desc
                    </div>
                    <div className="w-1/12 h-12 flex items-center justify-center text-lg font-semibold uppercase">
                      Status
                    </div>
                    <div className="w-1/12 h-12 flex items-center justify-center text-lg font-semibold uppercase">
                      Start Date
                    </div>
                    <div className="w-1/12 h-12 flex items-center justify-center text-lg font-semibold uppercase">
                      End Date
                    </div>
                    <div className="w-1/12 h-12 flex items-center justify-center text-lg font-semibold uppercase">
                      Actions
                    </div>
                  </div>
                  {customerReportList ? customerReportList.slice(initialStart,(currentPage * itemsPerPage)).map((report,index) =>{
                    return (
                        <div className="w-full h-12 border-b border-b-white flex text-white" key={report.id}>
                        <div className="w-1/12 h-12 flex items-center justify-center text-lg">
                          {index+1}
                        </div>
                        <div className="w-2/12 h-12 flex items-center justify-start text-lg">
                          {report.customer_name}
                        </div>
                        <div className="w-1/12 h-12 flex items-center justify-center text-lg">
                          {new Date(report.report_date).toLocaleDateString("en-CA")}
                        </div>
                        <div className="w-1/12 h-12 flex items-center justify-center text-lg">
                          {report.report_occurance}
                        </div>
                        <div className="w-3/12 h-12 flex items-center justify-start text-lg">
                          {report.report_description}
                        </div>
                        <div className="w-1/12 h-12 flex items-center justify-center text-lg">
                          {report.report_delivered ? <FontAwesomeIcon className="text-xl text-green-500" icon={faEnvelopeCircleCheck}/> : ''}
                          {report.report_review_requested ? <FontAwesomeIcon className="text-xl text-yellow-500" icon={faMagnifyingGlassArrowRight}/> : ''}
                          {report.report_reviewed ? <FontAwesomeIcon className="text-xl text-yellow-500" icon={faMagnifyingGlassChart}/> : ''}
                          {report.report_pending ? <FontAwesomeIcon className="text-xl text-red-500" icon={faHourglass}/> : ''}
                        </div>
                        <div className="w-1/12 h-12 flex items-center justify-center text-lg">
                          {new Date(report.start_date).toLocaleDateString("en-CA")}
                        </div>
                        <div className="w-1/12 h-12 flex items-center justify-center text-lg">
                          {new Date(new Date().setDate(new Date(report.end_date).getDate() - 1)).toLocaleDateString("en-CA")}
                        </div>
                        <div className="w-1/12 h-12 flex items-center justify-evenly text-lg">
                          {/*<button onClick={()=>handleViewButtonOnClick('/report/'+ new Date(report.report_date).getFullYear()+'/'+(new Date(report.report_date).getMonth()+1).toString().padStart(2, '0')+'/' + report.customer_code)}><FontAwesomeIcon className="text-white text-xl" icon={faEye}/></button>*/}
                          <button onClick={()=>handleViewButtonOnClick(report.report_id)}>
                            <FontAwesomeIcon className="text-white text-xl" icon={faEye}/>
                          </button>
                          {/*<Link href={"/report/"+report.report_id} target="_blank">*/}
                          {/*  <FontAwesomeIcon className="text-white text-xl" icon={faEye}/>*/}
                          {/*</Link>*/}
                          <FontAwesomeIcon title="Mark as reviewed" className="text-white text-xl" icon={faCheckCircle}/>
                        </div>
                      </div>
                      )
                    })
                    :
                    <div>
                      No Records Available to Display
                    </div>
                  }
                </div>
              </div>
              <div className="w-full h-1/6">
                <div className="w-full h-full bg-white/10 p-2 flex items-center justify-end gap-1">
                  <Pagination key="lg" total={totalPage} page={currentPage} initialPage={1} onChange={handlePageChange} size="lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Index