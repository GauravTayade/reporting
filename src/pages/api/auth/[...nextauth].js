import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios";
import bcrypt from "bcrypt";

// const admin = {id:'17538717-6818-4769-b518-4b38cfd42de4',name:'admin',email:'admin@mail.com',password:'123', role:'admin'};
// const user = {id:'17538717-6818-4769-b518-4b38cfd42de4',name:'randomuser',email:'user@mail.com',password:'123', role:'user'};

export default NextAuth({
  session:{
    strategy:'jwt',
    maxAge: 60*60*24,
  },
  jwt:{
    maxAge: 60*60*24,
    // decode:async(),
    // encode:async()

  },
  secret:process.env.NEXTAUTH_SECRET,
  site:process.env.NEXTAUTH_URL,
  providers:[
    CredentialsProvider({
      name:"credentials",
      async authorize(credentials,req){

        const user = await axios.post(process.env.NEXT_PUBLIC_ENDPOINT_URL+"/users/validate",{
          username:credentials.username,
        })

        const passwordCheck = await bcrypt.compare(credentials.password,user.data.rows[0].password)

        if(user.data.rows && passwordCheck){
          return {id:user.data.rows[0].id,name:user.data.rows[0].fname+' '+user.data.rows[0].lname,email:user.data.rows[0].email,password:user.data.rows[0].password, role:user.data.rows[0].role.toLowerCase()}
        }else{
          return null
        }

        // if(credentials.username === 'admin' && credentials.password === 'superuser'){
        //   return  {id:'17538717-6818-4769-b518-4b38cfd42de4',name:'admin',email:'admin@mail.com',password:'123', role:'admin'}
        // }else if(credentials.username === "randomuser" && credentials.password === "generaluser"){
        //   return {id:'17538717-6818-4769-b518-4b38cfd42de4',name:'randomuser',email:'user@mail.com',password:'123', role:'user'}
        // }else{
        //   return null
        // }
      }
    })
  ],
  callbacks: {
    async jwt({token, account, user}) {
      if (account) {
        token.accessToken = account.access_token
        token.id = user?.id
        token.role = user?.role
      }
      return token
    },
    async session({session, token}) {
      // session.accessToken = token.accessToken;
      session.user.id = token.sub;
      session.user.role = token.role

      return session;
    },
    async redirect({url, baseUrl}) {
      if (url.startsWith(baseUrl)) {
        return url;
      } else if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      return baseUrl;
    }
  },
  pages:{
    signIn:'/login'
  },
  debug:process.env.NODE_ENV === 'development'
})
