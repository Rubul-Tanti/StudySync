import Header from"../../components/landingpage/header"
import Footer from"../../components/landingpage/footer"
import { Outlet, Route, Routes } from 'react-router-dom'

const LandingpageLayout = () => {
  return (
 <>
     <Header/>
<Outlet/>
    <Footer/>
 </>
  )
}

export default LandingpageLayout
