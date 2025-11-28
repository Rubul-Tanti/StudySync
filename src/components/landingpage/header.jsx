import { Link, useLocation } from "react-router-dom"
import webLogo from "../../../public/webLogo.png"
const nav = [{name:"Home",route:"/"}, { name: "Subcription Plans", route: "/subscription-plans" }]
const Header = () => {
  const { pathname } = useLocation()
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-sm">
      <div className="flex items-center gap-8">
         <Link to={"/"} className="flex gap-2 items-center">
        <img src={webLogo}  alt="Logo" className="md:h-10 h-8" />
                  <p className=' text-xl text-[#005188]'>Study Sync</p>
        
        </Link> 
      </div>
      <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
        {nav.map((route) => { return <Link to={route.route} key={route.name}> <li key={route.name} className={`hover:text-[#005188] cursor-pointer outline-0 ${pathname === route.route ? "text-[#005188] underline" : "text-black"}`}>  {route.name}</li> </Link> })}
      </ul>
      <div className="flex gap-4">
        <Link to="/login"><button className="border border-[#005188] text-[#005188] px-4 py-1.5 rounded-full hover:bg-blue-50">Log in</button></Link>
       <Link to ="/signup/role-selection"> <button className="bg-[#005188] text-white px-4 py-1.5 rounded-full hover:bg-[#005188]">Sign Up</button></Link>
      </div>
    </nav>

  )
}

export default Header
