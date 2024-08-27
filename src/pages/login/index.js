import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import UserContext from "@/context/userContext";
import {useContext} from "react";
import {signIn, useSession} from "next-auth/react";
import Swal from "sweetalert2";
import {NextRequest} from "next/server";
import {Spinner} from "@nextui-org/react";

export default function Login(){

  const router = useRouter();
  const {data, status} = useSession()
  const { callbackUrl } = router.query;
  const [isLoading, setIsLoading] = useState(false);

  // if(status === 'authenticated' && data.user){
  //   router.push('/dashboard')
  // }

  const [userObject,setUserObject] = useState({
    username:null,
    password:null
  })

  const userDataContext = useContext(UserContext);

  const [errorMessage,setErrorMessage] = useState({message:''})

  const handleInputChange = (e) =>{
    setUserObject({...userObject, [e.target.name]: e.target.value})
  }

  const userLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        username: userObject.username,
        password: userObject.password,
        redirect: false,
        //callbackUrl: callbackUrl ? callbackUrl : '/dashboard'
        callbackUrl: '/dashboard'
      })

      if (result?.error) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Invalid Credentials",
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        // Redirect to the callback URL or handle success
        setIsLoading(false)
        await router.push(callbackUrl ? callbackUrl : '/dashboard')
      }

    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: error,
        showConfirmButton: false,
        timer: 2000
      });
    }
    setIsLoading(false)
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
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="username"
                  autoComplete="username"
                  required
                  onChange={handleInputChange}
                  className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-red-500 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={handleInputChange}
                  className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
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
                  onClick={userLogin}
                >
                  Sign in
                </button>
              }
            </div>
            <div>
              {errorMessage ? errorMessage.message : ''}
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-white">
            Not a member?{' '}
            <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Please reach out to A2N support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}