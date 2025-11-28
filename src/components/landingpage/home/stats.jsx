// components/Stats.tsx

const stats = [
  { value: 3, label: 'Teachers' },
  { value:11, label: 'Students' },

];

const Stats = () => {
  return (
    <section className="bg-white py-12  px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl  mx-auto grid grid-cols-2 md:grid-cols-2 gap-8 text-center rounded-xl shadow-sm bg-gradient-to-br from-white to-blue-50">
        {stats.map((stat, index) => (
          <div key={index} className="relative px-4">
            {/* Vertical divider except last */}
            {index !== stats.length - 1 && (
              <span className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 h-12 w-[1px] bg-[#005188]"></span>
            )}
            <h2 className="text-5xl font-bold text-[#005188]">{stat.value}</h2>
            <p className="mt-2 text-lg font-semibold text-gray-700">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
  