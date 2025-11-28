import { useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import gsap from "gsap";

const faqData = [
  {
    question: "How do I enroll in a course?",
    answer: "Simply select your preferred course, fill out the enrollment form, and start learning immediately.",
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! StudySync offers a free trial lesson so you can explore the platform before subscribing.",
  },
  {
    question: "Can I reschedule a class?",
    answer: "Absolutely! You can reschedule classes according to your availability and your teacher's schedule.",
  },
  {
    question: "Are the sessions 1-on-1?",
    answer: "Yes, all sessions are personalized 1-on-1 to ensure maximum learning effectiveness.",
  },
  {
    question: "Can I track my progress?",
    answer: "Yes, StudySync provides a dashboard to track your learning progress and completed lessons.",
  },
];

export default function Faq() {
  return (
    <section className="py-16 px-4 md:px-16 bg-blue-50">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqData.map((faq, index) => (
          <FaqItem key={index} {...faq} />
        ))}
      </div>
    </section>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  const toggle = () => {
    const content = contentRef.current;
    if (content) {
      gsap.to(content, {
        height: open ? 0 : content.scrollHeight,
        duration: 0.4,
        ease: "power2.out",
      });
    }
    setOpen(!open);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center px-6 py-4 text-left text-blue-900 font-semibold hover:bg-blue-100 transition-colors"
      >
        <span>{question}</span>
        {open ? <FaChevronUp className="text-blue-700" /> : <FaChevronDown className="text-blue-700" />}
      </button>
      <div
        ref={contentRef}
        style={{ height: 0 }}
        className="px-6 overflow-hidden text-blue-900 text-sm transition-all duration-300"
      >
        <div className="py-3">{answer}</div>
      </div>
    </div>
  );
}
