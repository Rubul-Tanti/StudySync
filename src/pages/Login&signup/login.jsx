import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import loginImage from "../../assets/images/landingpage/login.png";
import { loginSuccess } from "../../Redux/slices/authSlice";
import webLogo from "../../../public/webLogo.png";
import login from "../../services/login";
import Loader from "../../components/loader";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleonSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
      }

      setLoading(true);
      const data = await login(email, password);

      if (data?.success) {
        toast.success("Login Successful");
        dispatch(loginSuccess(data));
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
      const data = e?.response?.data || null;

      if (data && !data.success) {
        toast.error(data.message);
      } else {
        toast.error("An error occurred during login. Please try again.");
      }

      console.error("Login error:", e);
    }
  };

  return (
    <div className="flex flex-col md:flex-row-reverse min-h-screen w-full bg-blue-50 overflow-hidden">
      {/* Logo */}
      <Link to={"/"}>
        <img
          alt="StudySync Logo"
          src={webLogo}
          className="absolute top-4 left-4 md:top-6 md:left-8 h-10 z-20 drop-shadow-lg"
        />
      </Link>

      {/* Left Side (Branding Section) */}
      <div className="flex flex-col justify-center items-center md:items-start w-full md:w-2/3 bg-zinc-100 text-black px-8 md:px-16 lg:px-24 py-12 md:py-0 min-h-[60vh] md:min-h-screen">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-lg text-center md:text-left">
          Learn, Collaborate, and Grow with{" "}
          <span className="  text-[#005188] px-2 rounded">StudySync</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-800 text-center md:text-left max-w-md">
          Connect with teachers and peers, access interactive lessons, track
          your progress, and make learning engaging and effective—anytime, anywhere.
        </p>
        <img
          src={loginImage}
          alt="Learning Illustration"
          className="mt-8 max-w-[220px] sm:max-w-[280px] md:max-w-[340px] drop-shadow-2xl w-full"
        />
      </div>

      {/* Right Side (Login Form) */}
      <div className="flex justify-center items-center w-full md:w-1/3 bg-white p-8 sm:p-12 shadow-xl min-h-[60vh] md:min-h-screen mt-8 md:mt-0">
        <div className="flex flex-col items-start gap-5 w-full max-w-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Please login to your StudySync account
          </p>

          <form onSubmit={handleonSubmit} className="w-full flex flex-col gap-4">
            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#005188] text-sm sm:text-base shadow-sm"
            />
            <input
              ref={passwordRef}
              type="password"
              placeholder="Password"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleonSubmit(e);
              }}
              className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#005188] text-sm sm:text-base shadow-sm"
            />

            <div className="flex justify-end w-full">
              <button
                type="button"
                className="text-xs sm:text-sm text-[#005188] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-[#005188] hover:bg-[#005188] transition text-white font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? <Loader variant="button" size="small" /> : "Login"}
            </button>
          </form>

          <p className="text-xs sm:text-sm mt-4 text-gray-500 text-center w-full">
            Don't have an account?
            <Link
              to="/signup/role-selection"
              className="pl-1 text-[#005188] hover:underline cursor-pointer"
            >
              Get started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
