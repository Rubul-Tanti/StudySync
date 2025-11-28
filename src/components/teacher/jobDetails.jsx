import { useQuery } from "@tanstack/react-query";
import React from "react";
import Loader from "../loader";
import api from "../../utils/axios";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { FiCalendar, FiDollarSign, FiGlobe, FiBook, FiUsers, FiCopy, FiSend } from "react-icons/fi";

export default function JobDetails() {
  const { id } = useParams();
  const proposal = useRef(null);

  const fetchJobDetails = async () => {
    const res = await api.post(`/v1/fetchJobDetails/${id}`);
    return res.data.data;
  };

  const user = useSelector(state => state.auth.user);

  const sendProposal = async (e, { proposal }) => {
    e.preventDefault();
    const userId = user._id;
    const username = user.persnalDetails.name;
    const userImage = user.persnalDetails.profilePic;

    try {
      const res = await api.post("/v1/job/sendproposal", { postId: id, userId, username, userImage, proposal });
      if (res?.data.success) {
        toast.success("Sent proposal successfully");
        console.log(res.data.data);
      }
      
    } catch (e) {
      toast.error(e?.response?.data?.message)
      console.log(e);
    }
  };

  const {
    data: job,
    isLoading,
    error,
  } = useQuery({ queryKey: ["jobDetails", id], queryFn: fetchJobDetails });

  if (isLoading) return <Loader />;
  if (error) {
    toast.error("Page not found");
    return <Navigate to={"/jobs"} />;
  }

  const formattedDate = new Date(job.postedAt).toLocaleDateString();

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Job Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-zinc-700  mb-3">{job.title}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <FiCalendar className="text-[#005188]" />
              <span className="text-[#005188]">Posted on</span> {formattedDate}
            </p>
          </div>

          {/* Description */}
          <section>
            <h2 className="text-xl font-semibold text-black mb-4">Job Description</h2>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </section>

          {/* Job Details */}
          <section>
            <h2 className="text-xl font-semibold text-black mb-4">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-gray-200">
                <FiBook className="text-gray-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="font-medium text-black">{job.course}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-gray-200">
                <FiGlobe className="text-gray-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Language</p>
                  <p className="font-medium text-black">{job.language}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-gray-200">
                <FiDollarSign className="text-gray-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-medium text-black">${job.budget}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-gray-200">
                <FiUsers className="text-gray-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Applicants</p>
                  <p className="font-medium text-black">{job.applicants.length}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Proposal Section */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-black mb-4">Submit Your Proposal</h2>
            <form onSubmit={(e) => { sendProposal(e, { proposal: proposal.current.value }) }} className="space-y-4">
              <textarea
                ref={proposal}
                name="proposal"
                className="w-full border-2 border-gray-200 rounded-lg p-4 focus:outline-none focus:border-black transition resize-none"
                rows="8"
                placeholder="Write your proposal here. Explain why you're the best fit for this job..."
                required
              ></textarea>
              <button
                type="submit"
                className="bg-[#005188] text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition flex items-center gap-2 font-medium"
              >
                <FiSend />
                Submit Proposal
              </button>
            </form>
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <aside className="space-y-6">
          {/* About the client */}
          <div className="border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-black mb-4">About the Client</h2>
            <div className="flex items-center gap-3">
              <img 
                src={job.postedBy.profilePic} 
                alt={job.postedBy.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <p className="font-medium text-black">{job.postedBy.name}</p>
                <p className="text-sm text-gray-500">Client</p>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Activity on this Job</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Applicants</span>
                <span className="font-semibold text-black">{job.applicants.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Interviewing</span>
                <span className="font-semibold text-black">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Invites sent</span>
                <span className="font-semibold text-black">0</span>
              </div>
            </div>
          </div>

          {/* Job link */}
          <div className="border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Share this Job</h2>
            <div className="space-y-3">
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-gray-50"
                value={`https://StudySync.com/jobs/${job._id}`}
                readOnly
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://StudySync.com/jobs/${job._id}`);
                  toast.success("Job link copied!");
                }}
                className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 font-medium"
              >
                <FiCopy />
                Copy Link
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}