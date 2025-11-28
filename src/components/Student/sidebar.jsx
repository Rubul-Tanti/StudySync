import React from 'react';
import { CiLogout } from "react-icons/ci";
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiSearch, FiMessageSquare, FiStar, FiCalendar, FiSettings } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../../utils/axios';
 export const logout = async () => {
    try {
      const logoutobj = await api.post("v1/logout");
      console.log(logoutobj);
      localStorage.removeItem("accessToken");
      localStorage.clear();
      sessionStorage.clear();
      
      toast.success("Logged out successfully!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong during logout!");
    } finally {
      window.location.reload(true);
      navigate("/login");
    }
  };
export default function Sidebar({ open }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const studentMenu = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
    { name: "Find Teachers", path: "/find-teachers", icon: <FiSearch /> },
    { name: "Messages", path: "/messages", icon: <FiMessageSquare /> },
    { name: "My Posts", path: "/jobpost", icon: <FiSettings /> },
  ];

  const teacherMenu = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
    { name: "Jobs", path: "/jobs", icon: <FiSearch /> },
    { name: "Messages", path: "/messages", icon: <FiMessageSquare /> },
  ];

  const menuItems = user?.role === "student" ? studentMenu : user?.role === "teacher" ? teacherMenu : [];



  return (
    <aside
      className={`border-r border-gray-200 w-64 bg-white max-h-screen  top-0 flex flex-col
        absolute sm:relative z-20 transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
    >
      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out
                ${isActive 
                  ? 'bg-[#005188]/80 text-white font-medium shadow-sm' 
                  : 'text-gray-700 hover:bg-[#005188]/20 hover:text-[#005188]'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout Button - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-[#005188] 
                     hover:bg-blue-50 transition-all duration-200 ease-in-out
                     font-medium text-sm group"
        >
          <CiLogout 
            size={20} 
            className="group-hover:translate-x-0.5 transition-transform duration-200" 
          />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}