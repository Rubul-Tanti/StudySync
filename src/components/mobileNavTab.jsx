import React from 'react'
import { CiLogout } from "react-icons/ci";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiSearch, FiMessageSquare, FiStar, FiCalendar, FiSettings } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { CgProfile } from "react-icons/cg";
const Mobilenav = () => {
     const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
const {pathname}=useLocation()
if(pathname.includes('chat'))return null
  const studentMenu = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
    { name: "Find Teachers", path: "/find-teachers", icon: <FiSearch /> },
    { name: "Messages", path: "/messages", icon: <FiMessageSquare /> },
    { name: "My Posts", path: "/jobpost", icon: <CgProfile /> },
  ];

  const teacherMenu = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
    { name: "Jobs", path: "/jobs", icon: <FiSearch /> },
    { name: "Messages", path: "/messages", icon: <FiMessageSquare /> },
  ];

  const menuItems = user?.role === "student" ? studentMenu : user?.role === "teacher" ? teacherMenu : [];

  return (
    <div
      className={`border-t  border-gray-300 shadow-xl sm:hidden  w-full bg-white h-16  bottom-0 sticky flex flex-col
         sm:relative z-20 transition-transform duration-300 ease-in-out
    `}
    >
      {/* Navigation Menu */}
      <nav className="flex-1 p-1 overflow-y-auto">
        <div className="flex flex-row justify-between gap-1">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2   rounded-xl transition-all duration-200 ease-in-out
                ${isActive 
                  ? 'bg-blue-50 text-[#005188] font-medium shadow-sm' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-[#005188]'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px]">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

    </div>
  )
}

export default Mobilenav


