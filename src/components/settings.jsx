import { useState } from "react";
import {
  FiSettings,
  FiUser,
  FiBell,
  FiEye,
  FiGlobe,
  FiShield,
} from "react-icons/fi";
import webLogo from "../../public/webLogo.png";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  let user ="student"
  const menuItems = [
    { id: "general", label: "General", icon: <FiSettings /> },
    { id: "account", label: "Account", icon: <FiUser /> },
    { id: "notifications", label: "Notifications", icon: <FiBell /> },
    { id: "privacy", label: "Privacy & Security", icon: <FiShield /> },
    { id: "language", label: "Language", icon: <FiGlobe /> },
  ];

  const [active, setActive] = useState("general");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("English");

  return (
    <div className="min-h-screen overflow-hidden bg-blue-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="bg-white shadow-lg border-b md:border-b-0 md:border-r w-full md:w-64 p-4">
        <div className="flex items-center justify-between md:block">
          <Link to={"/"}>
          <img
            alt="logo"
            src={webLogo}
            className="h-8 md:h-10 drop-shadow-lg"
          />
        </Link>
        </div>
        <Link
            to={`/user/${user}/dashboard`}
            className="flex h-12 items-center gap-2 text-[#005188] font-semibold"
          >
          <IoIosArrowBack size={20} />
        <h2 className="hidden md:block text-xl font-bold text-[#005188] ">
           Settings
        </h2>
          </Link>

        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible mt-4 md:mt-0 pb-2 md:pb-0">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                active === item.id
                  ? "bg-[#005188] text-white"
                  : "hover:bg-blue-100 text-[#005188]"
              }`}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-8">
        {active === "general" && (
          <section>
            <div className="flex items-center gap-2 text-[#005188] mb-6">
              <IoIosArrowBack className="hidden md:block" size={20} />
              <h2 className="text-xl font-bold">General Settings</h2>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#005188] outline-none"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#005188] outline-none"
              />
            </div>
          </section>
        )}

        {active === "account" && (
          <section>
            <div className="flex items-center gap-2 text-[#005188] mb-6">
              <IoIosArrowBack className="hidden md:block" size={20} />
              <h2 className="text-xl font-bold">Account Settings</h2>
            </div>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="New Password"
                className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#005188] outline-none"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#005188] outline-none"
              />
            </div>
          </section>
        )}

        {active === "notifications" && (
          <section>
            <h3 className="text-2xl font-bold text-[#005188] mb-4">
              Notifications
            </h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-5 h-5"
              />
              Enable Email Notifications
            </label>
          </section>
        )}

        {active === "appearance" && (
          <section>
            <h3 className="text-2xl font-bold text-[#005188] mb-4">Appearance</h3>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#005188] outline-none"
            >
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
              <option value="system">System Default</option>
            </select>
          </section>
        )}

        {active === "privacy" && (
          <section>
            <h3 className="text-2xl font-bold text-[#005188] mb-4">
              Privacy & Security
            </h3>
            <p className="text-gray-700 mb-4">
              Manage your privacy settings and control your data.
            </p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
              Delete My Account
            </button>
          </section>
        )}

        {active === "language" && (
          <section>
            <h3 className="text-2xl font-bold text-[#005188] mb-4">Language</h3>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#005188] outline-none"
            >
              <option>English</option>
              <option>Arabic</option>
              <option>Urdu</option>
            </select>
          </section>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
;
