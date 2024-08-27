import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

// const admin = {id:'17538717-6818-4769-b518-4b38cfd42de4',name:'admin',email:'admin@mail.com',password:'123', role:'admin'};
// const user = {id:'17538717-6818-4769-b518-4b38cfd42de4',name:'randomuser',email:'user@mail.com',password:'123', role:'user'};

export default NextAuth({
  session:{
    strategy:'jwt'
  },
  jwt:{
    maxAge: 60*60*24,
    // decode:async(),
    // encode:async()

  },
  secret:process.env.NEXTAUTH_SECRET,
  providers:[
    CredentialsProvider({
      name:"credentials",
      async authorize(credentials,req){
        if(credentials.username === 'admin' && credentials.password === 'superuser'){
          return  {id:'17538717-6818-4769-b518-4b38cfd42de4',name:'admin',email:'admin@mail.com',password:'123', role:'admin'}
        }else if(credentials.username === "randomuser" && credentials.password === "generaluser"){
          return {id:'17538717-6818-4769-b518-4b38cfd42de4',name:'randomuser',email:'user@mail.com',password:'123', role:'user'}
        }else{
          return null
        }
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
