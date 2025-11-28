import React, { useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import webLogo from"../../../public/webLogo.png"
import { useLocation } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { Link } from 'react-router-dom'
import loginImage from "../../assets/images/landingpage/hero2.png"
import { api } from '../../utils/axios'
const Signup = () => {
  const navigate=useNavigate()
  const [otpsent,setotpsent]=useState(false)
  const [formdata,setformdata]=useState()
  const email=useRef(null)
  const otp=useRef(null)
  const location=useLocation()
  const getotp=async(e)=>{
    e.preventDefault()
    const curremail=email.current.value
    setformdata({email:curremail})
    const res=await api.post("/v1/email-verification",{email:curremail})
    if(res.data.success){setotpsent(true)}else{
      setotpsent("failed")
    }
  }

  const handleonSignup=async(e)=>{
    if(!otpsent){
      setotpsent("notsent")
      return }
    e.preventDefault()
    const currotp=otp.current.value
    const res= await api.post("/v1/verifyotp",{email:formdata.email,otp:currotp})
    if(res.data.success){

    }
    else{
      setotpsent("wrong")
    }
    console.log(res.data)
  }

  if(location.pathname==="/signup/")return<div className="flex flex-col overflow-hidden h-screen md:flex-row-reverse w-full min-h-screen">
             {/* Logo */}
              <Link to={"/"}>
             <img
               alt="logo"
               src={webLogo}
               className="absolute top-4 left-4 md:top-4 md:left-6 md:h-10  h-8 drop-shadow-lg z-10"
               />
               </Link>
       
             {/* Left Side (Branding Section) */}
             <div className="flex flex-col justify-center items-center w-full md:w-2/3 bg-[#005188] text-white px-6 py-8 pb-0 md:py-0 min-h-[50vh] md:min-h-screen">
               <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center leading-snug max-w-lg">
                 Revolutionize Learning  with{" "}
                 <span className="text-yellow-300">StudySync</span>
               </h1>
               <p className="mt-3 text-sm sm:text-base text-gray-200 text-center max-w-md">
                 Learn or Teach online for kids & adults from the comfort of
                 your home.
               </p>
               <img
                 src={loginImage}
                 alt="Sign Up Illustration"
                 className="max-w-[180px] sm:max-w-[240px] md:max-w-[300px]  drop-shadow-2xl  w-full"
               />
             </div>
       
             {/* Right Side (Sign Up Form Section) */}
             <div className="flex justify-center items-center w-full md:w-1/3 bg-white p-6 sm:p-8 shadow-lg min-h-[50vh] md:min-h-screen mt-5 overflow-hidden">
               <div className="flex flex-col items-start gap-4 w-full max-w-sm">
                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                   Welcome 
                 </h1>
                 <p className="text-sm text-gray-500">Please register  your account</p>
                  <div className='flex flex-row w-full items-center gap-2'>

                 <input
                   type="email"
                   ref={email}
                   placeholder="Email"
                   className="w-full  bg-gray-50 rounded-lg h-11 pl-4 border border-gray-300 focus:ring-2 focus:ring-[#005188] focus:outline-none text-sm sm:text-base"
                   />
                   <button onClick={getotp} className="w-[100px] cursor-pointer h-12 rounded-lg bg-[#005188] hover:bg-[#005188] transition text-white font-semibold text-sm sm:text-base">Get otp</button>
                  {otpsent===true&&<button onClick={getotp} className="w-[100px] cursor-pointer h-12 rounded-lg border border-[#005188]  transition text-[#005188] font-semibold text-sm sm:text-base">resend otp</button>} 
                   </div>
                   {otpsent===true&&<p className='text-green-600 text-sm'>otp sent to your email</p>}
                   {otpsent==="failed"&&<p className='text-red-600 text-sm'>something went wrong,make sure your email is correct </p>}
                   {otpsent==="notsent"&&<p className='text-red-600 text-sm'>make sure get otp first </p>}
                   {otpsent==="wrong"&&<p className='text-red-600 text-sm'>otp doesn't match </p>}
                 <input
                 ref={otp}
                   type="OTP"
                   placeholder="OTP"
                   className="w-full bg-gray-50 rounded-lg h-11 pl-4 border border-gray-300 focus:ring-2 focus:ring-[#005188] focus:outline-none text-sm sm:text-base"
                 />
       
                
       
                 <button onClick={handleonSignup} className="w-full py-3 rounded-lg bg-[#005188] hover:bg-[#005188] transition text-white font-semibold text-sm sm:text-base">
                   Sign Up
                 </button>
       
                 <button
                   
                   className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
                 >
                   <FcGoogle size={20} />
                   <span className="text-sm font-medium text-gray-700">
                     Sign Up with Google
                   </span>
                 </button>
       
                 <p className="text-xs sm:text-sm mt-4 text-gray-500 text-center w-full">
                   already have an account?
                   <Link
                     to="/login"
                     className="pl-1 text-[#005188] hover:underline cursor-pointer"
                   >
                     Login
                   </Link>
                 </p>
               </div>
             </div>
           </div>

   return ( <div className="relative">
    
       <img alt="logo" src={webLogo} onClick={()=>{navigate('/')}} className="absolute cursor-pointer z-50 left-14 md:h-10 h-8 top-14" />
    <Outlet/>
    </div>
  )
}

export default Signup
