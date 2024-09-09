import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

export default async function middleware(req){

  const token = await getToken({req})
  const url = req.nextUrl.clone()
  const pathName = url.pathname

  if(!token){
    url.pathname = "/login"
    url.searchParams.set('callbackUrl',req.nextUrl.href)
    //return NextResponse.redirect(new URL("/login",req.url))
    return NextResponse.redirect(url)
  }
  return NextResponse.next();
}

export const config = {
  matcher:['/dashboard/:path*','/report/:path*','/users/:path*','/device/:path*','/profile/:path*']

}