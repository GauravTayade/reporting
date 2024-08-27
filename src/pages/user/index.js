import axios from "axios";

const User = () =>{

  //get users list
  axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/getUsers').then(response=>{}).catch(error=>{})

  //get user
  axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/getUsers/:id').then(response=>{}).catch(error=>{})

  //edit user
  axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/saveUser').then(response=>{}).catch(error=>{})

  //deactivate user account
  axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/deactivateUsers').then(response=>{}).catch(error=>{})

  //activate user account
  axios.get(process.env.NEXT_PUBLIC_ENDPOINT_URL+'/activateUsers').then(response=>{}).catch(error=>{})

  return(
    <div class="w-scree h-screen">

    </div>
  )

}

export default User