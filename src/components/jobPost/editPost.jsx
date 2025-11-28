import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../utils/axios";
import Loader from "../loader";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiFileText, FiDollarSign, FiGlobe, FiBook } from "react-icons/fi";

const fetchJobDetails = async (id) => {
  const res = await api.post(`/v1/fetchJobDetails/${id}`);
  return res.data.data;
};

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["editjobDetails"],
    queryFn: () => fetchJobDetails(id),
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    course: "",
    language: "",
    budget: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        id: data._id,
        title: data.title,
        description: data.description,
        course: data.course,
        language: data.language,
        budget: data.budget,
      });
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  const goBack = () => {
    navigate(-1);
  };

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
      const res = await api.post("/v1/updatejob", formData);
      const data = res.data;
      if (data.success) {
        toast("Post edited successfully");
        navigate(-1);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-black hover:text-gray-600 transition mb-6"
        >
          <FiArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Edit Job Post</h1>
          <p className="text-gray-500">Update your job posting details</p>
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
                placeholder="e.g.  Teacher for guitar Course"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    

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
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={goBack}
              className="flex-1 bg-white border border-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader variant="button" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;