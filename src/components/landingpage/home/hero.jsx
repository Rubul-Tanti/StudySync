import heroImage from "../../../assets/images/landingpage/hero.png"

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-20 px-6 md:px-12 lg:px-24 text-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Learn or Teach the <span className="text-blue -600">together Online</span><br />
            For Kids & Adults
          </h1>
          <p className="text-lg text-gray-600 mb-8">
Join a trusted learning platform where teachers help students learn, practice, and master academic skills. Interactive, personalized, and flexible online classes designed for every learner.          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-[#005188] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#005188] transition duration-300">
              Start Learning
            </button>
            <button className="border-2 border-[#005188] text-[#005188] px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300">
              Become a Teacher
            </button>
          </div>
        </div>  

        {/* Right Image */}
        <div className="flex-1 h-full overflow-hidden md:rounded-tl-[50px] rounded md:rounded-br-[50px]">
          <img
            src={heroImage}
            alt="hero imageOnline"
            className=" object-cover "
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
