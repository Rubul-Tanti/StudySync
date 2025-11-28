import React, { useState } from "react";
import { useSelector } from "react-redux";
import api from "../../utils/axios";
import Loader from "../loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiDollarSign, FiGlobe, FiBook } from "react-icons/fi";

const defaultData = {
  title: "",
  description: "",
  language: "",
  budget: "",
  id: "",
  name: "",
};

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const finalData = {
        ...formData,
        name: user?.persnalDetails?.name || "",
        id: user?._id || "",
        profilePic: user?.persnalDetails.profileImage || "",
        socketId: user?.socketId || "",
      };

      console.log(finalData);
      const res = await api.post("/v1/createjob", finalData);
      if (res.data.success) {
        toast.success("Created post successfully");
        navigate("/jobpost");
      }
      setFormData(defaultData);
    } catch (e) {
      console.log(e)
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Create Job Post</h1>
          <p className="text-gray-500">Fill in the details to post a new job opportunity</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Job Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFileText className="text-blue-300" />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g.  Teacher for Docker Course"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job requirements, expectations, and any additional details..."
              rows="5"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition resize-none"
            />
          </div>

          {/* Course & Language Row */}
          <div className=" gap-4">
            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Language
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiGlobe className="text-blue-300" />
                </div>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="e.g. English, Arabic"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Monthly Rate
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="text-blue-300" />
              </div>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className="w-full pl-10 pr-24 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm font-medium">USD/Month</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader variant="button" /> : "Create Job Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;