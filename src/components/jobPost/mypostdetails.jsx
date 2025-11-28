import React, { useState } from "react";
import { useParams, Navigate, useNavigate, Link, Links } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/axios";
import Loader from "../loader";
import { toast } from "react-toastify";
import { FiEdit, FiDollarSign, FiBook, FiGlobe, FiMessageSquare, FiUserCheck, FiUserX, FiCopy, FiTrash2 } from "react-icons/fi";

const MyPostDetails = () => {
  const navigate = useNavigate();
  const  queryClient=useQueryClient()
  const { id } = useParams();
  const [loading, setloading] = useState(false);

  const handleClosePost = (id) => {
    toast.info(
      <div className="text-black">
        <p className="font-semibold">Close Post</p>
        <p className="text-sm text-gray-600">Are you sure you want to close this post?</p>
        <div className="flex gap-3 mt-3">
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              const { data } = await api.post(`/v1/deletejob/${id}`);
              if (data.success) {
                toast("Post deleted successfully");
                navigate("/jobpost");
              } else {
                toast.error("Internal server error");
              }
              toast.dismiss();
            }}
            className="px-3 py-1 bg-zinc-700 text-white rounded-lg hover:bg-gray-800"
          >
            Close Post
          </button>
        </div>
      </div>,
      {
        position: "bottom-center",
        className: "bg-white rounded-lg shadow-lg border border-gray-200",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
      }
    );
  };

  const fetchMyJob = async () => {
    const res = await api.post(`/v1/fetchJobDetails/${id}`);
    return res.data.data;
  };

  const {
    data: job,
    isLoading,
    error,
  } = useQuery({ queryKey: ["myJob", id], queryFn: fetchMyJob });

  if (isLoading) return <Loader />;

  if (error) {
    toast.error("Job not found");
    return <Navigate to={"/jobpost"} />;
  }

  const formattedDate = new Date(job.postedAt).toLocaleDateString();

  const notHire = async (proposalId) => {
    try {
      console.log(proposalId)
      const jobId = job._id;
      setloading(true);
      const { data } = await api.post("/v1/job/proposal-delete", { proposalId, jobId });
      console.log(data)
      if (data.success) {
        toast.success("Proposal deleted successfully");
          queryClient.invalidateQueries(["myJob", id]);
      }
    } catch (e) {
      console.log(e);
      toast("Something went wrong, try again later");
    } finally {
      setloading(false);
    }
  };

  const interview = async ({ teacherId, teacherName, teacherProfilePic }) => {
    try {
      const student = {
        studentId: job.postedBy.id,
        studentName: job.postedBy.name,
        studentProfilePic: job.postedBy.profilePic,
      };
      const teacher = { teacherId, teacherName, teacherProfilePic };
      const { data } = await api.post("/v1/job/initialize-chat", { teacher, student });
      if (data.success) {
        navigate(`/messages/chat/${data.data._id}`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Job Header */}
        <header className="border-b border-gray-200 pb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-zinc-700">{job.title}</h1>
            <Link
              to={`/jobpost/edit/${job._id}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiEdit size={20} className="text-blue-300" />
            </Link>
          </div>
          <p className="text-sm text-gray-500 mb-4"><span className="text-blue-400">Posted on</span> {formattedDate}</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-4 py-2 rounded-lg bg-gray-50 text-black border border-gray-200 flex items-center gap-2">
              <FiDollarSign className="text-blue-300" />
              ${job.budget}
            </span>
            <span className="px-4 py-2 rounded-lg bg-gray-50 text-black border border-gray-200 flex items-center gap-2">
              <FiGlobe className="text-blue-300" />
              {job.language}
            </span>
          </div>
        </header>

        {/* Description */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">Job Description</h2>
          <p className="leading-relaxed text-gray-700">{job.description}</p>
        </section>

        {/* Proposals */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-black">
            Proposals ({job.applicants?.length || 0})
          </h2>

          {job.applicants?.length > 0 ? (
            <div className="space-y-4">
              {job.applicants.map((proposal, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-gray-50 border border-gray-200 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                      src={proposal.profilePic}
                      alt={proposal.name}
                    />
                    <div className="flex-1">
                      <Link to={`/find-teachers/${proposal.id}`}>
                        <p className="font-semibold text-lg text-black hover:underline cursor-pointer">
                          {proposal.name}
                        </p>
                      </Link>
                      <p className="text-gray-700 mt-2 leading-relaxed">
                        {proposal.proposal}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4 pt-4 border-t flex-wrap border-gray-200">
                    <button
                      onClick={() => {
                        interview({
                          teacherId: proposal.id,
                          teacherName: proposal.name,
                          teacherProfilePic: proposal.profilePic,
                        });
                      }}
                      className="px-4 cursor-pointer py-2 rounded-lg bg-white border border-gray-200 text-black hover:bg-gray-100 transition flex items-center gap-2 text-sm font-medium"
                    >
                      <FiMessageSquare className="text-blue-300" />
                      Interview
                    </button>
                    <Link to={`/class-hiring-mod/${job._id}/${proposal._id}`}><button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-black hover:bg-gray-100 transition flex items-center gap-2 text-sm font-medium">
                      <FiUserCheck className="text-blue-300" />
                      Hire
                    </button></Link>
                    <button
                      onClick={() => {
                      toast.info(<div className="flex flex-col gap-2 "><p className="text-center text-zinc-700">Are you sure, you want to decline this proposal</p>
                      <div className="flex justify-between items-center"><button className="w-[80px]  bg-red-600 text-white p-2 rounded-2xl" onClick={()=>{toast.dismiss()}}>cancel</button><button className="border cursor-pointer w-[80px]  p-2 rounded-xl border-zinc-400" onClick={()=>{notHire(proposal.id);toast.dismiss()}}>yes</button></div></div>
                    ,{position:"bottom-center"}  
                    )
                        // notHire(proposal._id);
                      }}
                      className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-black hover:bg-gray-100 transition flex items-center gap-2 text-sm font-medium"
                    >
                      <FiUserX />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No proposals yet.</p>
          )}
        </section>

        {/* Job Link */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">Share Job Link</h2>
          <div className="flex items-center gap-3">
            <input
              className="flex-1 rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-700 border border-gray-200"
              value={`https://StudySync.com/jobs/${job._id}`}
              readOnly
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://StudySync.com/jobs/${job._id}`);
                toast.success("Job link copied!");
              }}
              className="px-4 py-3 rounded-lg bg-zinc-700 text-white hover:bg-gray-800 transition text-sm flex items-center gap-2 font-medium"
            >
              <FiCopy />
              Copy
            </button>
          </div>
        </section>

        {/* Delete Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              handleClosePost(job._id);
            }}
            className="bg-[#005188] text-white font-semibold text-sm py-3 px-6 rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
          >
            <FiTrash2 />
            Delete Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPostDetails;