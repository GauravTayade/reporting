import axios from "axios";
import React, {useEffect, useState} from "react";
import {Button, Input} from "@nextui-org/react";
import {signOut, useSession} from "next-auth/react";
import ComponentNavigation from "@/components/common/ComponentNavigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faSearch, faTrash} from "@fortawesome/free-solid-svg-icons";
import FortyTwo from "next-auth/providers/42-school";

const Users = () =>{

  const {data:sessionData,status} = useSession()

  const [employeeData, setEmployeeData] = useState({})
  const [employeeList,setEmployeeList] = useState([])
  const [employeeListSearch,setEmployeeListSearch] = useState([])

  const handleSearch = (e) =>{
    if(e.target.value){
      setEmployeeListSearch(
        employeeListSearch.filter(
          employee => employee.fname.toLowerCase().includes(e.target.value.toLowerCase()) ||
                      employee.lname.toLowerCase().includes(e.target.value.toLowerCase()) ||
                      employee.email.toLowerCase().includes(e.target.value.toLowerCase())))
    }else{
      setEmployeeListSearch(employeeList)
    }
  }

  const handleUserEdit=(id)=>{

  }

  //get users list
  const getUsers = () =>{
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/users/getUsers').then(response=>{
      if(response.data.rowCount > 0){
        setEmployeeList(response.data.rows)
        setEmployeeListSearch(response.data.rows)
      }
    }).catch(error=>{})
  }

  //get user
  const getUser = () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/getUsers/:id').then(response=>{}).catch(error=>{})
  }

  //edit user
  const updateUser = () =>{
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/saveUser').then(response=>{}).catch(error=>{})
  }

  //deactivate user account
  const deactivateUser = () =>{
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/deactivateUsers').then(response=>{}).catch(error=>{})
  }

  //activate user account
  const activateUser = () => {
    axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/activateUsers').then(response=>{}).catch(error=>{})
  }

  useEffect(() => {
    getUsers()
  }, []);

  return(
    <div class="w-screen h-screen bg-blue-900 overflow-hidden">
      <div className="w-full h-16">
        <ComponentNavigation/>
      </div>
      <div className="w-full h-full">
        <div className="w-full h-1/6 flex">
          <div className="w-2/6 h-full"></div>
          <div className="w-2/6 h-full">
            <div className="w-full h-full flex items-center justify-center">
              <Input className="text-xl" type="text" label="Search" onChange={handleSearch} name="search" isClearable startContent={<FontAwesomeIcon icon={faSearch} />} />
            </div>
          </div>
          <div className="w-2/6 h-full"></div>
        </div>
        <div className="w-full h-5/6">
          <div className="w-full h-full bg-white/10 flex items-center justify-center">
            <div className="w-4/6 h-full flex-col justify-center">
              <div className="w-full h-16 flex justify-evenly">
                <div className="w-1/5 h-16 flex items-center justify-center">
                  <h1 className="text-lg font-semibold text-white">#</h1>
                </div>
                <div className="w-1/5 h-16 flex items-center justify-center">
                  <h1 className="text-lg font-semibold text-white">Name</h1>
                </div>
                <div className="w-1/5 h-16 flex items-center justify-center">
                  <h1 className="text-lg font-semibold text-white">Email</h1>
                </div>
                <div className="w-1/5 h-16 flex items-center justify-center">
                  <h1 className="text-lg font-semibold text-white">Department</h1>
                </div>
                <div className="w-1/5 h-16 flex items-center justify-center">
                  <h1 className="text-lg font-semibold text-white">Actions</h1>
                </div>
              </div>
              {employeeListSearch ?
                employeeListSearch.map(employee =>{
                  return (
                    <div key={employee.id} className="w-full h-16 flex justify-evenly border-t-2">
                      <div className="w-1/5 h-16 flex items-center justify-center">
                        <h1 className="text-white">#</h1>
                      </div>
                      <div className="w-1/5 h-16 flex items-center justify-center">
                        <h1 className="text-white">{employee.fname + " " + employee.lname}</h1>
                      </div>
                      <div className="w-1/5 h-16 flex items-center justify-center">
                        <h1 className="text-white">{employee.email}</h1>
                      </div>
                      <div className="w-1/5 h-16 flex items-center justify-center">
                        <h1 className="text-white">{employee.department}</h1>
                      </div>
                      <div className="w-1/5 h-16 flex items-center justify-center">
                        <div className="w-1/2 h-full flex items-center">
                          <Button variant="shadow" color="warning">
                            <FontAwesomeIcon icon={faEdit}/>
                          </Button>
                        </div>
                        <div className="w-1/2 h-full flex items-center">
                          <Button variant="shadow" color="danger">
                            <FontAwesomeIcon icon={faTrash}/>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })
                : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default Users