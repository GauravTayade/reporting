import {useState} from "react";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import Link from 'next/link';
import {Input, Select, SelectItem, Spinner} from "@nextui-org/react";
import axios from "axios";

export default function Login(){

  const router = useRouter();
  const {data, status} = useSession()
  const { callbackUrl } = router.query;
  const [isLoading, setIsLoading] = useState(false);

  const [userObject,setUserObject] = useState({
    fname:'',
    lname:'',
    email:'',
    dept:'',
    password:'',
    rePassword:''
  })

  const handleFnameChange = (e) =>{
    setUserObject(prevState => {return{...prevState,fname :e.target.value}})
  }
  const handleLnameChange = (e) =>{
    setUserObject(prevState => {return{...prevState,lname :e.target.value}})
  }
  const handleEmailChange = (e) =>{
    setUserObject(prevState => {return{...prevState,email :e.target.value}})
  }
  const handleDeptChange = (e) =>{
    setUserObject(prevState => {return{...prevState,dept:e.target.value}})
  }
  const handlePasswordChange = (e) =>{
    setUserObject(prevState => {return{...prevState, password :e.target.value}})
  }
  const handleRePasswordChange = (e) =>{
    setUserObject(prevState => {return{...prevState, rePassword :e.target.value}})
  }

  const [errorMessage,setErrorMessage] = useState({message:''})


  const handleUserRegistration = async (e) =>{
    e.preventDefault()

    try{
      const result = await axios.post(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/users/saveUser",{
        user:userObject
      })

      console.log(result)
    }
    catch(error){

    }

  }

  return(
    <div className="w-screen h-screen bg-indigo-800">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="/assets/images/logo_header_a2n.png"
            alt="Access 2 Network INC"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Register Your Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <div className="flex gap-2">
              <div className="mt-2 w-1/2">
                <Input onChange={handleFnameChange} value={userObject.fname} name="fname" type="text" placeholder="FirstName" label="FirstName" required/>
              </div>
              <div className="mt-2 w-1/2">
                <Input onChange={handleLnameChange} value={userObject.lname} name="lname" type="text" placeholder="LastName" label="LastName" required/>
              </div>
            </div>

            <div>
              <div className="mt-2">
                <Input onChange={handleEmailChange} value={userObject.email} name="email" type="email" placeholder="example@mail.com" label="Email" required/>
              </div>
            </div>

            <div>
              <div className="mt-2">
                <Select onChange={(e)=>handleDeptChange(e)} name="employeeDept" label="Select Department" required>
                  <SelectItem key="SIEM">SIEM</SelectItem>
                  <SelectItem key="SOC">SOC</SelectItem>
                  <SelectItem key="Sales">Sales</SelectItem>
                </Select>
              </div>
            </div>

            <div>
              <div className="mt-2">
                <Input onChange={handlePasswordChange} value={userObject.password} name="password" type="password" placeholder="******" label="Password" required/>
              </div>
            </div>

            <div>
              <div className="mt-2">
                <Input onChange={handleRePasswordChange} value={userObject.rePassword} name="rePassword" type="password" placeholder="******" label="Re-Password" required/>
              </div>
            </div>

            <div>
              {isLoading ?
                <div className="lex w-full justify-center">
                  <Spinner label="Primary" color="primary" labelColor="primary"/>
                </div>
                :
                <button
                  type="submit"
                  id="login"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={handleUserRegistration}
                >
                  Sign up
                </button>
              }
            </div>
            <div>
              {errorMessage ? errorMessage.message : ''}
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-white">
            Already a member?{' '}
            <Link href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sing In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}