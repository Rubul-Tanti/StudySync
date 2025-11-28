// components/Features.tsx
import {
  FaVideo,
  FaComments,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaBell,
  FaChartLine,
  FaUserCircle,
  FaClock,
} from 'react-icons/fa';

const features = [
  {
    icon: <FaVideo className="text-[#005188] text-3xl" />,
    title: '1-to-1 Video Call',
    desc: 'Learn or teach through high-quality, real-time video sessions.',
  },
  {
    icon: <FaComments className="text-[#005188] text-3xl" />,
    title: 'Live Chat',
    desc: 'Instant messaging between students and teachers.',
  },
  {
    icon: <FaSearch className="text-[#005188] text-3xl" />,
    title: 'Search Teachers',
    desc: 'Find qualified  teachers easily by skill, language, or price.',
  },
  {
    icon: <FaFilter className="text-[#005188] text-3xl" />,
    title: 'Advanced Filters',
    desc: 'Filter by availability, level, gender, or teaching method.',
  },
  {
    icon: <FaCalendarAlt className="text-[#005188] text-3xl" />,
    title: 'Schedule Classes',
    desc: 'Teachers can set class times and manage availability.',
  },
  {
    icon: <FaBell className="text-[#005188] text-3xl" />,
    title: 'Reminders & Alerts',
    desc: 'Get notified before every class or activity.',
  },
  {
    icon: <FaChartLine className="text-[#005188] text-3xl" />,
    title: 'Progress Tracking',
    desc: 'Students & teachers can monitor Quran memorization or tajweed.',
  },
  {
    icon: <FaUserCircle className="text-[#005188] text-3xl" />,
    title: 'Teacher Profiles & Reviews',
    desc: 'View reviews, experience, and credentials of each teacher.',
  },
  {
    icon: <FaClock className="text-[#005188] text-3xl" />,
    title: '24/7 Flexibility',
    desc: 'Take or give classes at your convenience, from anywhere.',
  },
];

const Features = () => {
  return (
    <section className="bg-white py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Powerful Features for Students & Teachers
        </h2>
        <p className="text-gray-600 text-lg">
          Everything you need to teach or learn  online effectively and beautifully.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-blue-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <div className="mb-4">{feature.icon}</div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              {feature.title}
            </h4>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
