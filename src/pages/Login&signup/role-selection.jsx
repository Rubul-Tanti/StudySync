import React, { useState } from "react";
import { FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState(null);
const navigate=useNavigate()
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = () => {
    if (selectedRole) {
  if(selectedRole==="tutor"){
    navigate("/signup/tutor-registration")
  }else{
    navigate("/signup/student-registration")
  }

    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center  px-4 text-center">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-[#005188]">
        Join as a tutor or student
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Tutor Card */}
        <div
          onClick={() => handleRoleSelect("tutor")}
          className={`border rounded-lg p-6 w-72 cursor-pointer transition-all ${
            selectedRole === "tutor"
              ? "border-[#005188] shadow-lg"
              : "border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <FaChalkboardTeacher size={28} className="text-[#005188] mb-2" />
              <h2 className="text-lg font-semibold text-[#005188]">
                I'm a tutor, ready to teach 
              </h2>
            </div>
            <input
              type="radio"
              checked={selectedRole === "tutor"}
              onChange={() => handleRoleSelect("tutor")}
            />
          </div>
        </div>

        {/* Student Card */}
        <div
          onClick={() => handleRoleSelect("student")}
          className={`border rounded-lg p-6 w-72 cursor-pointer transition-all ${
            selectedRole === "student"
              ? "border-[#005188] shadow-lg"
              : "border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <FaBookOpen size={28} className="text-[#005188] mb-2" />
              <h2 className="text-lg font-semibold text-[#005188]">
                I'm a student, eager to learn 
              </h2>
            </div>
            <input
              type="radio"
              checked={selectedRole === "student"}
              onChange={() => handleRoleSelect("student")}
            />
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedRole}
        className={`px-6 py-2 rounded-md font-medium text-white ${
          selectedRole
            ? "bg-[#005188] hover:bg-[#005188]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Continue
      </button>

      <p className="text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-[#005188] font-medium underline">
          Log In
        </a>
      </p>
    </div>
  );
};

export default RoleSelection;
