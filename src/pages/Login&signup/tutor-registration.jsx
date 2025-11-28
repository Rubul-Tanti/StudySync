import React, { useEffect, useRef, useState } from "react";
import countryCodes from "../../../constant/countryCode";
import { toast } from "react-toastify";
import sendOtp from "../../services/sendOtp";

import { useNavigate } from "react-router-dom";
import registerTeacher from "../../services/teacherStudent";

const TutorRegisterForm = () => {
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingOtp, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [formData, setFormData] = useState({
    dob: "",
    profesnalEmail: "",
    name: "",
    email: "",
    gender: "",
    country: "",
    languageInput: "",
    courseInput: "",
    education: "",
    certificateName: "",
    certificateFile: null,
    profilePicture: null,
    bio: "",
    phoneNumber: "",
    countryCode: "92",
    rate: "",
    otp: ""
  });
const [error,setError]=useState('')
  const [timeLeft, setTimeLeft] = useState(120);
  const otpRef = useRef("enter otp");
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "dob") {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      // Adjust if birthday hasn’t occurred yet this year
      const actualAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

      if (actualAge < 18) {
        setError("You must be at least 18 years old.");
      } else {
        setError("");
        setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
      }
      return
    }
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const addLanguage = () => {
    if (formData.languageInput.trim() && !languages.includes(formData.languageInput)) {
      setLanguages([...languages, formData.languageInput.trim()]);
      setFormData((prev) => ({ ...prev, languageInput: "" }));
    }
  };

  const addCourse = () => {
    if (formData.courseInput && !courses.includes(formData.courseInput)) {
      setCourses([...courses, formData.courseInput]);
      setFormData((prev) => ({ ...prev, courseInput: "" }));
    }
  };

  const addCertificate = () => {
    if (certificates.length >= 10) {
      return toast("Cannot upload more than 10 certificates");
    }
    if (formData.certificateName.trim() && formData.certificateFile) {
      const newCertificate = {
        name: formData.certificateName.trim(),
        file: formData.certificateFile
      };
      setCertificates([...certificates, newCertificate]);
      setFormData((prev) => ({
        ...prev,
        certificateName: "",
        certificateFile: null
      }));
      const fileInput = document.querySelector('input[name="certificateFile"]');
      if (fileInput) fileInput.value = "";
    }
  };

  const removeCertificate = (index) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const removeCourse = (index) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setResendLoading(true);
    setFormData((prev) => ({ ...prev, otp: "" }));
    
    try {
      if (!formData.email || !formData.name) {
        toast("Please fill in all required fields");
        setLoading(false);
        return;
      }
      
      const res = await sendOtp(formData.email);
      if (res.success) {
        setOtpLoading(false);
        setTimeLeft(120);
        otpRef.current = "";
        setOtpSent(true);
        setResendLoading(false);
        toast("OTP sent to your email");
      }
    } catch (e) {
      setResendLoading(false);
      setLoading(false);
      if (e?.response?.data?.message === "User already exists") {
        toast("User already exists");
      } else {
        toast(e?.response?.data?.message);
      }
      if (!e.response) {
        toast("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const otpHandler = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("email", formData.email);
    submissionData.append("profesnalEmail", formData.profesnalEmail);
    submissionData.append("gender", formData.gender);
    submissionData.append("country", formData.country);
    submissionData.append("educationDetails", formData.education);
    submissionData.append("bio", formData.bio);
    submissionData.append("phone", `${formData.countryCode}${formData.phoneNumber}`);
    submissionData.append("countryCode", formData.countryCode);
    submissionData.append("rate", formData.rate);
    submissionData.append("dob", formData.dob);

    if (formData.profilePicture) {
      submissionData.append("profilePicture", formData.profilePicture);
    }

    certificates.forEach((cert) => {
      submissionData.append(`${cert.name}`, cert.file);
    });

    languages.forEach((lang, index) => {
      submissionData.append(`languages[${index}]`, lang);
    });

    courses.forEach((course, index) => {
      submissionData.append(`specializations[${index}]`, course);
    });

    setOtpLoading(true);
    const otpValue = formData.otp;
    submissionData.append("otp", otpValue);
    
    try {
      const data = await registerTeacher(submissionData);
      if (data.success) {
        setOtpLoading(false);
        toast("Tutor registered successfully");
        toast.info("Password has been sent to your email");
        navigate("/login");
      } else {
        setOtpLoading(false);
        toast("OTP not matched");
      }
    } catch (error) {
      setOtpLoading(false);
      toast("Verification failed");
    }
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (otpSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-zinc-800">Verify OTP</h2>
            <p className="text-sm text-zinc-500 mt-2">Enter the 6-digit code sent to your email</p>
          </div>

          <form onSubmit={otpHandler} className="space-y-4">
            <input
              type="text"
              minLength={6}
              maxLength={6}
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="w-full text-center text-2xl tracking-widest px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent"
              placeholder="000000"
            />

            {timeLeft <= 0 && (
              <p className="text-center text-sm font-medium text-red-600">
                OTP expired! Please request a new one.
              </p>
            )}

            <button
              type="submit"
              disabled={timeLeft <= 0 || loadingOtp}
              className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors"
            >
              {loadingOtp ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="space-y-3 pt-4">
              {timeLeft <= 0 && (
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                  className="w-full bg-white border border-zinc-300 text-zinc-700 py-2.5 rounded-lg font-medium hover:bg-zinc-50 transition-colors"
                  disabled={resendLoading}
                >
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </button>
              )}

              <p className="text-center text-sm text-zinc-600">
                {timeLeft > 0 ? `⏳ Time remaining: ${formatTime(timeLeft)}` : "OTP expired"}
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
          {/* Header */}
          <div className="bg-zinc-900 text-white px-8 py-6">
            <h2 className="text-3xl font-bold">Tutor Registration</h2>
            <p className="text-zinc-300 mt-1">Join our platform and start teaching</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full overflow-hidden bg-zinc-100 border-4 border-zinc-200">
                    {formData.profilePicture ? (
                      <img
                        src={URL.createObjectURL(formData.profilePicture)}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-zinc-400">
                        {formData.name.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                  </div>
                </div>
                <label className="cursor-pointer">
                  <span className="inline-block px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium">
                    Upload Photo
                  </span>
                  <input
                    type="file"
                    name="profilePicture"
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-800 border-b border-zinc-200 pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all bg-white"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    {error&&<p className="text-red-600 text-sm">you atleast need to be 18 year old</p>}
                    <input
                      type="date"
                      
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="w-32 px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all bg-white"
                        required
                      >
                        {countryCodes.map((c) => (
                          <option  key={c.code} value={c.dial_code}>
                           {c.code} {c.dial_code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="1234567890"
                        maxLength={10}
                        minLength={10}
                        className="flex-1 px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all bg-white"
                      required
                    >
                      <option value="">Select country</option>
                      {countryCodes.map((nation) => (
                        <option key={nation.code} value={nation.name}>
                          {nation.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Teaching Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-800 border-b border-zinc-200 pb-2">
                  Teaching Information
                </h3>

                {/* Languages */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700">Languages Spoken</label>
                  <div className="flex gap-2">
                    <input
                      name="languageInput"
                      value={formData.languageInput}
                      onChange={handleChange}
                      placeholder="Add a language"
                      className="flex-1 px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={addLanguage}
                      className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-full text-sm font-medium"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() => removeLanguage(i)}
                          className="text-zinc-500 hover:text-red-600 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Courses */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700">Courses Offered</label>
                  <div className="flex gap-2">
                    <input
                      name="courseInput"
                      placeholder="what are you going to teach ?"
                      value={formData.courseInput}
                      onChange={handleChange}
                      className="flex-1 px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all bg-white"
                    />
          
                    <button
                      type="button"
                      onClick={addCourse}
                      className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {courses.map((course, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-full text-sm font-medium"
                      >
                        {course}
                        <button
                          type="button"
                          onClick={() => removeCourse(i)}
                          className="text-zinc-500 hover:text-red-600 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hourly Rate */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    Monthly Rate (USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="rate"
                    type="number"
                    value={formData.rate}
                    onChange={handleChange}
                    placeholder="15"
                    className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Education */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    Education Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="Describe your educational background..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-800 border-b border-zinc-200 pb-2">
                  Additional Information
                </h3>

                {/* Certificates */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    Certificates <span className="text-zinc-500 text-xs">(Optional, max 10)</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      name="certificateName"
                      value={formData.certificateName}
                      onChange={handleChange}
                      placeholder="Certificate name"
                      className="px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all"
                    />
                    <input
                      type="file"
                      name="certificateFile"
                      onChange={handleChange}
                      accept=".pdf,.jpg,.png"
                      className="px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={addCertificate}
                      className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors font-medium"
                    >
                      Add Certificate
                    </button>
                  </div>
                  <div className="space-y-2">
                    {certificates.map((cert, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-zinc-50 border border-zinc-200 p-3 rounded-lg"
                      >
                        <div className="text-sm flex-1 min-w-0">
                          <span className="font-medium text-zinc-800">{cert.name}</span>
                          <span className="text-zinc-500 ml-2 truncate">({cert.file.name})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCertificate(i)}
                          className="ml-3 text-red-600 hover:text-red-700 text-sm font-medium whitespace-nowrap"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself and your teaching experience..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188] focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 text-white py-3.5 rounded-lg font-semibold text-lg hover:bg-zinc-800 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Processing..." : "Register as Tutor"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorRegisterForm;