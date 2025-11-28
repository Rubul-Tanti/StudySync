import React from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../loader"; // make sure you have this

const TeacherDetails = () => {
  const { id } = useParams();

  const fetchTeacherDetails = async () => {
    const res = await api.post(`/v1/teacherDetails/${id}`);
    return res.data;
  };

  const {
    data,
    isLoading,
    error,
  } = useQuery({ queryKey: ["teacher details", id], queryFn: fetchTeacherDetails });

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">Failed to load teacher details</p>;

  const teacher = data?.data;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
      {/* Header Section */}
      <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
        <img
          src={teacher?.persnalDetails?.profilePic}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover shadow-md"
        />
        <div>
          <h1 className="text-3xl font-bold text-[#005188]">
            {teacher?.persnalDetails?.name}
          </h1>
          <p className="text-sm text-gray-500">{teacher?.persnalDetails?.email}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-yellow-500 font-semibold text-lg">
              ⭐ {teacher?.rating || 0}
            </span>
            {teacher?.verified && (
              <span className="bg-blue-100 text-[#005188] px-3 py-1 rounded-full text-xs font-medium">
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="mt-10 space-y-10">
        {/* Personal Info */}
        <section>
          <h2 className="text-xl font-semibold text-[#005188] mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong className="text-[#005188]">Email:</strong> {teacher?.persnalDetails?.email}
            </p>
            <p>
              <strong className="text-[#005188]">Gender:</strong> {teacher?.persnalDetails?.gender}
            </p>
            <p>
              <strong className="text-[#005188]">Country:</strong> {teacher?.persnalDetails?.country}
            </p>
            <p>
              <strong className="text-[#005188]">Languages:</strong>{" "}
              {teacher?.persnalDetails?.languageSpoken?.join(", ")}
            </p>
          </div>
        </section>

        {/* Professional Details */}
        <section>
          <h2 className="text-xl font-semibold text-[#005188] mb-4">
            Professional Details
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong className="text-[#005188]">Monthly Rate:</strong> ${teacher?.profesnalDetails?.MonthlyRate}/Month
            </p>
            <p>
              <strong className="text-[#005188]">Education:</strong> {teacher?.profesnalDetails?.educationDetails}
            </p>
            <p>
              <strong className="text-[#005188]">Bio:</strong> {teacher?.profesnalDetails?.bio}
            </p>
          </div>
        </section>

        {/* Specializations */}
        <section>
          <h2 className="text-xl font-semibold text-[#005188] mb-4">
            Specializations
          </h2>
          <div className="flex flex-wrap gap-2">
            {teacher?.profesnalDetails?.specializations?.map((spec, idx) => (
              <span
                key={idx}
                className="bg-blue-50 text-[#005188] px-3 py-1 rounded-full text-sm shadow-sm"
              >
                {spec}
              </span>
            ))}
          </div>
        </section>

        {/* Courses */}
        <section>
          <h2 className="text-xl font-semibold text-[#005188] mb-4">Courses</h2>
          <div className="space-y-4">
            {teacher?.profesnalDetails?.taught?.length ? (
              teacher.profesnalDetails.taught.map((c, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-lg bg-blue-50 shadow-sm hover:shadow-md transition"
                >
                  <p>
                    <strong className="text-[#005188]">Course Name:</strong> {c.subject}
                  </p>
                  <p>
                    <strong className="text-[#005188]">Student:</strong> {c.studentName} ({c.studentDetail?.country})
                  </p>
                  <p>
                    <strong className="text-[#005188]">Total class:</strong> {c.numberOfClass}
                  </p>
                  <p>
                    <strong className="text-[#005188]">Duration:</strong> {c.durationInDays}
                  </p>
                  <p>
                    <strong className="text-[#005188]">lastClass:</strong> {c.endDate}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No courses available</p>
            )}
          </div>
        </section>

        {/* Reviews */}
        <section>
          <h2 className="text-xl font-semibold text-[#005188] mb-4">
            Student Reviews
          </h2>
          <div className="space-y-4">
            {teacher?.reviews?.length ? (
              teacher.reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 bg-blue-50 p-5 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={review.student?.profilePic || "https://via.placeholder.com/50"}
                    alt="Student"
                    className="w-12 h-12 rounded-full object-cover shadow"
                  />
                  <div>
                    <p className="font-semibold text-[#005188]">
                      {review.student?.name} ({review.student?.country})
                    </p>
                    <p className="text-yellow-500">⭐ {review.rating}</p>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherDetails;
