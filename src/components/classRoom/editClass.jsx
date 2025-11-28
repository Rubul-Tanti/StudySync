import React, { useEffect, useState } from 'react';
import { BsCalendar2Date } from "react-icons/bs";
import { MdAttachMoney } from "react-icons/md";
import { 
  FiCalendar as Calendar, 
  FiClock as Clock, 
  FiMessageSquare as MessageSquare, 
  FiCheckCircle as CheckCircle, 
  FiCircle as Circle, 
  FiArrowRight as ArrowRight 
} from 'react-icons/fi';
import { PiStudentThin } from "react-icons/pi";
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import Loader from '../loader';
import {updateClassApi} from '../../services/class';

const EditClass = () => {
  const {classId} = useParams();
  const [page, setPage] = useState('details');
  const now = new Date();
const navigate=useNavigate()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["proposal", classId],
    queryFn: async () => {
      const res = await api.post("/v1/get-classDetails", {classId});
      return res.data;
    },
    enabled: !!classId,
    staleTime: 1000 * 60 * 5,
  });

  const [Proposal, setProposal] = useState({
    classDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    classTime: { start: '09:00', end: '10:00' },
    studentName: '',
    subject: '',
    perMonthRate: '',
    startingDate:now,
    teacherName: '',
  });

  const [finalProposal, setFinalProposal] = useState({
    classDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    classTime: { start: '09:00', end: '10:00' },
    studentName: '',
    subject: '',
    perMonthRate: '',
    startingDate: now,
    teacherName: '',
  });

  useEffect(() => {
    if (data?.data) {
      const initialData = {
        classDays:data?.data?.classDays,
        classTime: { start:data?.data?.classTime.start, end:data?.data?.classTime.end },
        studentName: data?.data?.student?.name || '',
        subject: data?.data?.subject || '',
        perMonthRate: data?.data?.perMonthRate || '',
        startingDate:new Date(data.data.startingDate),
        teacherName: data?.data?.teacher?.name || '',
      };
      setProposal(initialData);
      setFinalProposal(initialData);
    }
  }, [data?.data?.student?.id]);

const handleChange = (e) => {
  e.preventDefault();
  const label = e.target.id;  // e.g., "classTime.start" or "classTime.end"
  const value = e.target.value; // e.g., "09:00"

  if (label.includes('classTime')) {
    const timeType = label.split('.')[1]; // "start" or "end"

    // Convert input UTC time to local time
    const [hour, minute] = value.split(':');
    const today = new Date();
    const utcDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), +hour, +minute));
    const localTime = utcDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setProposal(item => ({
      ...item,
      classTime: {
        ...item.classTime,
        [timeType]: localTime
      }
    }));
  } else if (label === 'startingDate') {
    setProposal(item => ({ ...item, [label]: new Date(value) }));
  } else {
    setProposal(item => ({ ...item, [label]: value }));
  }
};

  const setDays = (e) => {
    e.preventDefault();
    const day = e.target.textContent;
    if (Proposal.classDays.includes(day)) {
      setProposal(item => ({ ...item, classDays: item.classDays.filter(d => d !== day) }));
    } else {
      setProposal(item => ({ ...item, classDays: [...(item.classDays || []), day] }));
    }
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const updateClass = async () => {
    try {
      const response = await updateClassApi({
        classId,
        classDays: finalProposal.classDays,
        classTime: finalProposal.classTime,
        subject: finalProposal.subject,
        perMonthRate: finalProposal.perMonthRate,
        startingDate: finalProposal.startingDate,
      });
      if (response.success) {
        toast.success("Class updated successfully");
        navigate("/dashboard")
      }
    } catch (e) {
      toast.error("Failed to update class");
    }
  };

  if (isLoading) return <Loader />;

  if(data.data=='already-exist')return<div className='text-center flex justify-center items-center h-full text-2xl'>Class already have been created for this Proposal</div>
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Class Editing Process</h1>
          <p className="text-gray-600">Follow the steps to edit your class booking</p>
          <p className='text-red-600 text-sm'>*make sure to edit all fields before creating a class*</p>
        </div>

        {page === "editDetails" ? (
          <div className="space-y-6">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2 text-black">
                  Teacher: <p className="text-xl font-semibold">{finalProposal.teacherName}</p>
                </h3>
                <span className="px-3 py-1 [#005188] text-white text-xs font-semibold rounded-full">
                  {finalProposal.subject}
                </span>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PiStudentThin className="w-5 h-5 text-blue-400" />
                  <p className="font-semibold text-black">Student Name</p>
                </div>
                <div className="ml-7 space-y-1">
                  <p className="text-zinc-700">{Proposal.studentName}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <p className="font-semibold text-black">Class Days</p>
                  </div>
                  <div className="ml-7 space-y-1 flex flex-row gap-2 flex-wrap">
                    {weekDays.map((days, i) => (
                      <button
                        key={i}
                        onClick={setDays}
                        className={`border-zinc-300 text-sm h-[30px] border rounded-lg flex items-center px-2 ${
                          Proposal.classDays.includes(days)
                            ? "bg-black text-white"
                            : "bg-white text-zinc-400"
                        }`}
                      >
                        {days}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <p className="font-semibold text-black">Class Time (UTC)</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div>
                      <label className="text-xs text-gray-600">Start</label>
                      <input
                        id="classTime.start"
                        className="border border-zinc-500 rounded-lg p-2 outline-0"
                        onChange={handleChange}
                        value={Proposal.classTime.start}
                        type="time"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">End</label>
                      <input
                        id="classTime.end"
                        className="border border-zinc-500 rounded-lg p-2 outline-0"
                        onChange={handleChange}
                        value={Proposal.classTime.end}
                        type="time"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row justify-between gap-5">
                <div className="bg-white flex-1 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BsCalendar2Date className="w-5 h-5 text-blue-400" />
                    <p className="font-semibold text-black">Starting Date</p>
                  </div>
                  <input
                    id="startingDate"
                    className="border-zinc-400 border text-zinc-500 outline-0 rounded-lg p-2 w-full"
                    onChange={handleChange}
                    type="date"
                  />
                </div>

                <div className="bg-white border flex-1 border-gray-200 rounded-lg p-4">
                  <p className="font-semibold text-black flex items-center mb-2">
                    <MdAttachMoney className="text-green-600" size={30} />
                    Per Month Rate
                  </p>
                  <p className="text-2xl font-bold text-green-400">
                    <input
                      id="perMonthRate"
                      onChange={handleChange}
                      value={Proposal.perMonthRate}
                      className="max-w-[155px] border border-green-200 outline-0 rounded-lg p-1"
                      type="number"
                    />{" "}
                    <span className="text-sm font-normal text-gray-500">per Month</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setPage('details')}
                  className="flex-1 bg-white border-2 border-gray-200 hover:border-gray-300 text-black font-semibold py-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={JSON.stringify(Proposal) === JSON.stringify(finalProposal)}
                  onClick={() => {
                    setFinalProposal(Proposal);
                    toast.success("Saved");
                    setPage('details');
                  }}
                  className={`flex-1 ${
                    JSON.stringify(Proposal) === JSON.stringify(finalProposal)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "[#005188] hover:bg-[#005188]"
                  } text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2`}
                >
                  <CheckCircle className="w-5 h-5" />
                  Save
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-4">
                By approving, you agree to the terms and will be charged according to the rate above.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2 text-black">
                Teacher: <p className="text-xl font-semibold">{finalProposal.teacherName}</p>
              </h3>
              <span className="px-3 py-1 [#005188] text-white text-xs font-semibold rounded-full">
                {finalProposal.subject}
              </span>
            </div>
            <div className="flex flex-row gap-2">
              <p>Student Name:</p>
              <p className="text-sm text-zinc-600">{finalProposal.studentName}</p>
            </div>
            <div className="flex flex-row gap-2">
              <p>Class Days:</p>
              <div className="text-sm text-zinc-600 flex gap-2 flex-wrap">
                {finalProposal.classDays.map((day, i) => (
                  <p key={i}>{day}</p>
                ))}
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <p>Class Time:</p>
              <p className="text-sm text-zinc-600">{finalProposal.classTime?.start} - {finalProposal.classTime?.end}</p>
            </div>
            <div className="flex flex-row gap-2">
              <p>Starting Date:</p>
              <p className="text-sm text-zinc-600">{finalProposal.startingDate.toLocaleDateString()}</p>
            </div>
            <div className="flex flex-row gap-2">
              <p>Per Month Rate:</p>
              <p className="text-sm text-zinc-600">${finalProposal.perMonthRate}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setPage('editDetails')}
                className="flex-1 bg-white border-2 border-gray-200 hover:border-gray-300 text-black font-semibold py-4 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={updateClass}
                className="flex-1 [#005188] hover:bg-[#005188] text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Update Class
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditClass;