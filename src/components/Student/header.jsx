import React from 'react';
import { GoBell } from "react-icons/go";
import webLogo from "../../../public/webLogo.png";
import defaultProfile from "../../assets/images/defaultprofile.png";
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full sticky top-0 z-50 bg-white  border-b border-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6  ">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
            <img 
              src={webLogo} 
              alt="Website Logo" 
              className="h-8 sm:h-10 md:h-8 object-contain" 
            />
          <p className='text-[#005188] text-xl '>Study Sync</p>
          </Link>

          {/* Right Side: Notifications + Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications Button */}

            {/* <button
              type="button"
              className="flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1.5 sm:py-2 
                         rounded-lg hover:bg-gray-50 transition-colors duration-200 
                         active:scale-95 transform"
              aria-label="Notifications"
            >
              <div className="relative">
                <GoBell size={22} className="text-gray-700" />
                {/* Optional notification badge - uncomment if needed
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#005188] rounded-full"></span>
                */}
              {/* </div>
              <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
                Notifications
              </span>
            </button> */} 

            {/* Profile */}
            <Link 
              to="/profile"
              className="flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1.5 sm:py-2 
                         rounded-lg hover:bg-gray-50 transition-colors duration-200 
                         active:scale-95 transform"
            >
              <img
                src={defaultProfile}
                alt="Profile"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-gray-200 
                           object-cover transition-all duration-200 hover:border-gray-300"
              />
              <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
                Profile
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;