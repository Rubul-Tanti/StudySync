import Hero from "../../components/landingpage/home/hero"
import AppPromo from "../../components/landingpage/home/appPromo"
import EasyToStart from "../../components/landingpage/home/easyToStart"
import Features from "../../components/landingpage/home/features"
import ContactUs from "../../components/landingpage/home/contactus"
import Stats from "../../components/landingpage/home/stats"

const HomePage = () => {
  return (
  <>
      <Hero/>
      <Stats/>
      <AppPromo/>
      <EasyToStart/>
      <Features/>
      <ContactUs/>
  </>
  )
}

export default HomePage
