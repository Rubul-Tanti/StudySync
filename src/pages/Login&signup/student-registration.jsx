import { useEffect, useState } from "react";
import { GiBoltEye } from "react-icons/gi";
import { LuEyeClosed } from "react-icons/lu";
import { toast } from 'react-toastify';
import OtpVerfiy from "./otpVerify";
import Login from "../../services/login";
import Loader from "../../components/loader";
import sendOtp from "../../services/sendOtp";

const StudentRegistration = () => {
  const [passNotMatch, setPassNotMatch] = useState(false);
  const [otpsent, setotpsent] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    resend: false,
    otploading: false,
    time: 120
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      
      if (formData.password !== formData.confirmPassword) {
        setPassNotMatch(true);
        setLoading(false);
        return;
      }
      
      setPassNotMatch(false);
      const data = await sendOtp(formData.email);
      
      if (data?.success) {
        setotpsent(true);
        toast("OTP sent to your email successfully");
      }
    } catch (e) {
      setLoading(false);
      const data = e?.response?.data;
      if (data?.success === false) {
        toast(data?.message);
      } else {
        toast("Something went wrong, please try again later");
      }
    }
  };

  if (otpsent) {
    return <OtpVerfiy onSubmit={handleSubmit} formData={formData} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-8">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-zinc-200 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-zinc-800">Create Student Account</h2>
          <p className="text-sm text-zinc-500 mt-2">Join our platform and start learning</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              required
              className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                maxLength={20}
                minLength={8}
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 transition-colors p-1"
              >
                {!showPassword ? <LuEyeClosed size={20} /> : <GiBoltEye size={20} />}
              </button>
            </div>
            <p className="text-xs text-zinc-500">Must be 8-20 characters</p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                maxLength={20}
                minLength={8}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all pr-11 ${
                  passNotMatch 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-zinc-300 focus:ring-[#005188] focus:border-transparent"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 transition-colors p-1"
              >
                {!showConfirmPassword ? <LuEyeClosed size={20} /> : <GiBoltEye size={20} />}
              </button>
            </div>
            {passNotMatch && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Passwords do not match
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {["Male", "Female", "Other"].map((g) => (
                <label 
                  key={g} 
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                    required
                    className="w-4 h-4 text-[#005188] border-zinc-300 focus:ring-2 focus:ring-[#005188] cursor-pointer"
                  />
                  <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">
                    {g}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-zinc-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-zinc-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-[#005188] hover:text-[#005188] font-medium">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistration;