 import React, { useState, useEffect, useRef } from "react";
 import verifyOtp from "../../services/verifyOtp";
    import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader";
import { toast } from "react-toastify";
import sendOtp from "../../services/sendOtp";
 const OtpVerfiy=({onSubmit,formData})=>{
  const [loading, setLoading] = useState(false); // 2 minutes = 120 sec
  const [resend, setResend] = useState(false); // 2 minutes = 120 sec
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes = 120 sec
  const otp=useRef(null)
  const navigate=useNavigate()
  // Countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);
 
const otpResend=async()=>{
  try{
    setResend(true)
const res=await sendOtp(formData.email)
if(res.success){
 setResend(false)
 setTimeLeft(120)
  toast("otp sent successfully")
}
  }
  catch(e){
    setResend(false)
toast(e?.response?.data?.message)
  }
}

const otpHandler=async(e)=>{
  try{
e.preventDefault()
    setLoading(true)
    const {email}=formData
    const otpValue=otp.current.value
    const data=await verifyOtp({otp:otpValue,email:formData.email,fullName:formData.fullName,password:formData.password,gender:formData.gender})
    setLoading(false)
    toast("student register successfully")
    if(data.success){
      navigate("/login")
    }
  }catch(e){
    toast("something went wrong")
  }
    finally{
      setLoading(false)
    }
  }
  
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-white">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-[350px] flex flex-col gap-4 text-[#005188]">
        <h2 className="text-2xl font-bold text-center">Verify OTP</h2>

        <input
          type="text"
          minLength={6}
          maxLength={6}
          ref={otp}
          className="w-full px-4 py-2 border-2 border-[#005188] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] text-center tracking-widest text-xl"
          placeholder="Enter 6-digit OTP"
        />
        {timeLeft <= 0 && (
          <p className="text-red-600 text-sm text-center">
            OTP expired! Please request a new one.
          </p>
        )}
        <button
          onClick={otpHandler}
          disabled={timeLeft <= 0||loading} // disable after timer ends
          className={`w-full py-2 rounded-lg font-semibold transition-all duration-200 ${
            timeLeft <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#005188] text-white hover:bg-[#005188]"
          }`}
        >{loading ? "Verifying..." : "Verify OTP"}
        </button>
          {timeLeft <= 0 && <button onClick={()=>{otpResend()}} className="px-5 py-2 bg-green-500 text-white font-semibold">{!resend?"Resend otp":<Loader variant="button"/>}</button>}
        <p className="text-center text-gray-600">OTP sent to your email</p>
        <p className="text-center font-medium text-[#005188]">
          {timeLeft > 0 ? `Time left: ${formatTime(timeLeft)}` : "OTP expired"}
        </p>
      </div>
    </div>
  );
};
export default OtpVerfiy;