import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./PlansFlipCard.css"; // Same CSS as earlier

export default function PlansFlipCard() {
  const [flipped, setFlipped] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    // Animate "Our Plans" on mount
    gsap.fromTo(
      titleRef.current,
      { y: 100, opacity: 0, scale: 0.8 },
      {
        y: 0,
        opacity: 1,
        scale: 2,
        duration: 1.5,
        ease: "power3.out",
      }
    );

    // Flip after 1s
    const timer = setTimeout(() => {
      setFlipped(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center mt-5 items-center h-[100vh]">
      <div className={`flip-card ${flipped ? "flipped" : ""}`}>
        <div className="flip-card-inner">
          {/* Front Face */}
          <div className="flip-card-front bg-gradient-to-br from-blue-50 to-white text-white  flex items-center justify-center">
            <h2
              ref={titleRef}
              className="text-3xl text-[#005188] md:text-4xl font-bold tracking-wide"
            >
              Our <span className="text-[#005188]">Plans</span> 
            </h2>
          </div>

          {/* Back Face */}
         <div className="flip-card-back bg-white text-[#005188] p-8 items-center  flex flex-col gap-12">
  <h3 className="text-3xl font-bold text-center ">Choose Your Plan</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-5/6 ">
    {/* Basic Plan */}
    <div className="rounded-2xl border border-[#005188] p-6 shadow-md hover:shadow-xl transition">
      <h4 className="text-xl font-semibold text-center mb-2">Basic</h4>
      <p className="text-center text-sm text-gray-600 mb-4">For starters and beginners</p>
      <div className="text-center text-3xl font-bold text-[#005188]">$19<span className="text-base font-medium">/month</span></div>
      <button className="mt-4 w-full bg-blue-100 text-[#005188] py-2 rounded-lg font-medium">Current Plan</button>
      <ul className="mt-6 space-y-2 text-sm">
        <li>✔ 2 classes/week</li>
        <li>✔ Text-only support</li>
        <li>✔ Access from 1 device</li>
      </ul>
    </div>

    {/* Standard Plan */}
    <div className="rounded-2xl border border-green-300 p-6 shadow-lg hover:shadow-xl transition scale-105">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xl font-semibold">Standard</h4>
        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">POPULAR</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">Ideal for consistent learners</p>
      <div className="text-center text-3xl font-bold text-green-800">$39<span className="text-base font-medium">/month</span></div>
      <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600">Get Standard</button>
      <ul className="mt-6 space-y-2 text-sm">
        <li>✔ 4 classes/week</li>
        <li>✔ 24/7 chat support</li>
        <li>✔ Access from 2 devices</li>
      </ul>
    </div>

    {/* Premium Plan */}
    <div className="rounded-2xl border border-blue-300 p-6 shadow-md hover:shadow-xl transition">
      <h4 className="text-xl font-semibold text-center mb-2">Premium</h4>
      <p className="text-center text-sm text-gray-600 mb-4">For advanced learning</p>
      <div className="text-center text-3xl font-bold text-[#005188]">$69<span className="text-base font-medium">/month</span></div>
      <button className="mt-4 w-full bg-[#005188] text-white py-2 rounded-lg font-semibold hover:bg-[#005188]">Get Premium</button>
      <ul className="mt-6 space-y-2 text-sm">
        <li>✔ Daily  classes</li>
        <li>✔ Video call + Chat support</li>
        <li>✔ Access from unlimited devices</li>
      </ul>
    </div>
  </div>
</div>

        </div>
      </div>
    </div>
  );
}
