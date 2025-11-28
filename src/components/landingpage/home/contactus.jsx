// components/ContactUs.tsx

const ContactUs = () => {
  return (
    <section className="bg-blue-50 py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Contact Us
        </h2>
        <p className="text-gray-600 text-lg">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      <form className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188]"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188]"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="message">Message</label>
          <textarea
            id="message"
            rows={5}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005188]"
            placeholder="Type your message here..."
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-[#005188] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#005188] transition"
          >
            Send Message
          </button>
        </div>
      </form>
    </section>
  );
};

export default ContactUs;
