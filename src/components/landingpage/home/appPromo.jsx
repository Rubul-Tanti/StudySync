// components/AppPromo.tsx
import { FaGooglePlay, FaApple } from 'react-icons/fa';

const AppPromo = () => {
  return (
    <section className="bg-blue-50 py-20 px-6 md:px-12 lg:px-24">
      <div className="mx-auto flex flex-row md:flex-row items-center justify-center gap-12">
        
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            One Platform to <span className="text-[#005188]">Study and Learn Together</span><br />
            Anywhere, Anytime
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Join StudySync to connect with teachers and peers, access interactive lessons, and track your learning progress. Personalized, flexible, and fun learning—right on your mobile device.
          </p>

          <div className="flex flex-row sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#"
              className="flex items-center gap-2 bg-[#005188] text-white px-5 py-3 rounded-full hover:bg-[#005188] transition"
            >
              <FaGooglePlay className="text-xl" />
              <span>Get it on Play Store</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 border-2 border-[#005188] text-[#005188] px-5 py-3 rounded-full hover:bg-blue-100 transition"
            >
              <FaApple className="text-xl" />
              <span>Download on App Store</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromo;
