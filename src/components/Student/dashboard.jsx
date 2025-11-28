import React, { useEffect,useState } from "react";
import { FiBriefcase, FiClock, FiMessageSquare, FiStar, FiX } from "react-icons/fi";
import { isBefore, startOfDay, differenceInDays } from "date-fns";
import { BsCheckCircle } from "react-icons/bs";
import { FaBookOpen, FaClock, FaAward,FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FaBookQuran } from "react-icons/fa6";
import { SiConcourse } from "react-icons/si";
import { GiFinishLine } from "react-icons/gi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import fetchUser from "../../services/fetchUser";
import Loader from "../loader";
import { aproveClass, fetchClasses } from "../../services/class";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
const StudentDashboard = () => {
  const queryClient=useQueryClient()
  const user = useSelector((state) => state.auth.user);
  const {data:response,isLoading,isError}=useQuery({queryKey:["classes"],queryFn:()=>fetchClasses({id:user._id,role:user.role})})
  const [isHiring,setIsHiring]=useState([])
  const [isOngoing,setIsGoing]=useState([])
  const [isCompleted,setIsCompleted]=useState([])
  const [todayClass,setTodayClasses]=useState([])
const navigate=useNavigate()
// Helper function to check if class was missed
const isClassMissed = (session, classTime) => {
  const now = new Date();
  const today = now.toLocaleDateString();
  
  // Check if session exists and is still scheduled
  if (session?.status !== 'scheduled' && session?.status !== 'ongoing') {
    return false;
  }
  
  // Parse class end time
  const [endHour, endMinute] = (session?.endTime || classTime.end).split(':').map(Number);
  const classEndTime = new Date();
  classEndTime.setHours(endHour, endMinute, 0, 0);
  
  // If current time is past class end time and status is still scheduled, it's missed
  return now > classEndTime && (session?.status === 'scheduled' || !session);
};
useEffect(()=>{
  if(!isLoading){
    const data=response.data
    const weeksDays=[
                    'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'
                  ]
                    const day=new Date().getDay()
                    const today=weeksDays[day]                   
    const todayClass=data.filter(i=>i.classDays.includes(today)&&!isBefore(new Date(),new Date(i.startingDate)))
    const hiring=data.filter(i=>i.status=="hiring")||[]
    const completed=data.filter(i=>i.status=="completed")||[]
    const ongoing=data.filter(i=>i.status=="ongoing")||[]
    setIsHiring(hiring)
    setIsCompleted(completed)
    setIsGoing(ongoing)
    setTodayClasses(todayClass)
  }
},[response])
const handleMessage=(teacherId
)=>{
  const chatRoom=user.chats.find(i=>i.id==teacherId)
  navigate(`/messages/chat/${chatRoom.chatId}`)
}

function getClassStatus({ timezone = "Asia/Kolkata", start, end }) {
  const now = new Date();
  const currentDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));

  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const startTime = new Date(currentDate);
  startTime.setHours(startHour, startMinute, 0, 0);

  const endTime = new Date(currentDate);
  endTime.setHours(endHour, endMinute, 0, 0);

  // If end happens next day (e.g., 16:30 ➝ 06:30)
  if (endTime <= startTime) {
    endTime.setDate(endTime.getDate() + 1);
  }

  let status = "";
  let timeLeft = "";

  if (currentDate < startTime) {
    status = "upcoming";
    const diffMs = startTime - currentDate;
    const diffMinutes = Math.floor(diffMs / 60000);
    timeLeft = `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}`;
  } 
  else if (currentDate >= startTime && currentDate <= endTime) {
    status = "running";
    const diffMs = endTime - currentDate;
    const diffMinutes = Math.floor(diffMs / 60000);
    timeLeft = `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m left of class`;
  } 
  else {
    status = "finished";
    timeLeft = "Class is already finished";
  }

  return { status, timeLeft };
}



if(isLoading)return<Loader/>
if(isError)return<>error</>
  return (
    <div className="p-4 md:p-6 bg-zinc-50  min-h-screen w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-700"> Learning Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Track your progress and manage your courses</p>
      </div>

      {/* Today's Classes Section */}
      <div className="bg-white p-5 border border-zinc-200 rounded-xl shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FaBookQuran className="text-[#005188]" size={18} />
          </div>
          <h2 className="text-lg font-semibold text-zinc-700">Today's Classes</h2>
        </div>

{todayClass?.length > 0 ? (
  <div className="flex flex-row">
    <div className="space-y-4">
      {todayClass.map((course, i) => { 
        const date = new Date().toLocaleDateString();
           const session =course.sessions?course.sessions[course.sessions.length-1].date==date?course.sessions[course.sessions.length-1]:null:null;
        const classStatus = getClassStatus(session?.date === date ? {timezone: 'Asia/Kolkata', end: session.endTime, start: session.startTime} : course.classTime);
        const missed = isClassMissed(session, course.classTime);
        return (
          <div
            key={i}
            className={`rounded-2xl ${
              missed ? 'bg-orange-100 border-orange-300' :
              session?.status === 'completed' ? 'bg-amber-100' : 
              session?.status === 'rescheduled' ? 'bg-purple-100' : 
              session?.status === 'cancelled' ? 'bg-red-100' : 
              classStatus.status !== 'finished' ? "bg-white" : "bg-zinc-300"
            } flex-1 p-5 transition-colors border border-zinc-200 mx-2`}
          >
            <div className="flex flex-col justify-between gap-6">
              {/* Left: Course Info */}
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-black">
                    {course.subject}
                  </h3>
                  
                  {/* Status badges */}
                  {missed && (
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ⚠️ Missed
                    </span>
                  )}
                  {!missed && session?.status === 'cancelled' && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Cancelled
                    </span>
                  )}
                  {!missed && session?.status === 'rescheduled' && (
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Rescheduled
                    </span>
                  )}
                  {!missed && session?.status === 'completed' && (
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Completed
                    </span>
                  )}
                  {!missed && session?.status === 'scheduled' && classStatus.status === "upcoming" && (
                    <h2 className="text-green-700 mx-3">
                      class starts in: <span className="text-zinc-700 text-sm">{classStatus.timeLeft}</span>
                    </h2>
                  )}
                  {!missed && session?.status === 'ongoing' && (
                    <span className="bg-green-500 ml-2 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                      Live Now
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-zinc-600">
                  <span className="font-medium">Class Time:</span>{" "}
                  {session ? session.startTime : course.classTime.start} – {session ? session.endTime : course.classTime.end}
                </p>
                
                {/* Additional status messages */}
                {missed && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-2">
                    <p className="text-sm text-orange-700 font-medium">
                      ⚠️ You missed this class
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      This class was scheduled but no one joined. Contact your teacher to reschedule.
                    </p>
                  </div>
                )}
                {session?.status === 'cancelled' && session?.reason && (
                  <p className="text-sm text-red-600 italic">
                    Reason: {session.reason}
                  </p>
                )}
                {session?.status === 'rescheduled' && (
                  <p className="text-sm text-purple-600 italic">
                    {session?.newDate && `New Date: ${session.newDate}`}
                    {session?.newTime && ` at ${session.newTime}`}
                  </p>
                )}
              </div>
              
              {/* Show Join button only for running classes that aren't cancelled or missed */}
              {!missed && session?.status === 'ongoing' &&  (
                <div className="text-zinc-600">
                  Your class Room is live:<br/>
                  <button 
                    className="border border-green-500 text-green-500 rounded-lg p-1 hover:bg-green-500 hover:text-white transition-all duration-300 ease-in cursor-pointer hover:shadow-gray-400 shadow-xl m-1 font-bold" 
                    onClick={() => {navigate(`/classroom/${course._id}`)}}
                  >
                    Join Class
                  </button>
                  {session?.attendance?.teacherPresent && (
                    <div className="text-red-800">teacher is in the class Room</div>
                  )}
                </div>
              )}

              {/* Action buttons for missed class */}
              {missed && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => {handleMessage(course.teacher.id)}}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    Contact Teacher
                  </button>
                  <button 
                    className="flex-1 px-4 py-2 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium"
                  >
                    Request Reschedule
                  </button>
                </div>
              )}

              {/* Right: Teacher Info */}
              <div className="flex items-center gap-4">
                <img
                  src={course.teacher.profilePic}
                  alt={course.teacher.name}
                  className="w-16 h-16 rounded-full border border-zinc-400 object-cover"
                />
                <div>
                  <p className="font-semibold text-black text-sm">
                    {course.teacher.name}
                  </p>
                  <button 
                    onClick={() => {handleMessage(course.teacher.id)}} 
                    className="mt-2 px-3 py-1.5 bg-black text-white rounded-full flex items-center gap-1.5 text-xs hover:bg-zinc-800 transition-colors"
                  >
                    <FiMessageSquare size={14} />
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
) : (
  <div className="text-center py-8">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-100 rounded-full mb-3">
      <FaClock className="text-zinc-400" size={20} />
    </div>
    <p className="text-sm text-zinc-500">No classes scheduled for today</p>
  </div>
)}
      </div>

      {/* Ongoing Courses */}
      <div className="bg-white p-5 border border-zinc-200 rounded-xl shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <SiConcourse className="text-[#005188]" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-zinc-700">Ongoing Courses</h2>
        </div>

       {isOngoing?.length > 0 ? (
        <div className="flex">
                <div className="space-y-4 flex flex-row gap-2">
                  {isOngoing.map((course, i) =>
                  {
     
     const startDate = new Date(course.startingDate);
     const now = new Date();
             const hasStarted =
       isBefore(startOfDay(startDate), startOfDay(now)) ||
       startOfDay(startDate).getTime() === startOfDay(now).getTime();
     
     const daysLeft = differenceInDays(startOfDay(startDate), startOfDay(now));
                   return<div
                     key={i}
                     className={`rounded-2xl  p-5 transition-colors border border-zinc-200 ${
                       hasStarted ? "bg-white" : "bg-zinc-300"
                     }`}
                   >
                     <div className="flex flex-col  justify-between gap-6">
                       {/* Left: Course Info */}
                       <div className="flex-1 space-y-2">
                        <div className="flex justify-between"> <h3 className="font-semibold text-lg text-black">
                           {course.subject}
                           </h3>
                             <div
                           className={`inline-flex items-center gap-2 text-sm mt-2 ${
                             hasStarted
                               ? "text-black bg-zinc-100"
                               : "text-zinc-700 bg-zinc-50"
                           } px-3 py-1 rounded-full`}
                         >
                          
                           {!hasStarted&&<> <FiClock size={14} />{ `Will start in ${daysLeft} day${
                                 daysLeft !== 1 ? "s" : ""
                               }`}</>}
                         </div>
     </div>
                         <p className="text-sm text-zinc-600">
                           <span className="font-medium">Class Time:</span>{" "}
                           {course.classTime.start} – {course.classTime.end}
                         </p>
     
                         <p className="text-sm text-zinc-600">
                           <span className="font-medium">Days:</span>{" "}
                           {course.classDays.join(", ")}
                         </p>
     
                         <p className="text-sm text-zinc-600">
                           <span className="font-medium">Per Month Rate:</span> $
                           {course.perMonthRate}
                         </p>
     
                         <p className="text-sm text-zinc-600">
                           <span className="font-medium">Total Sessions:</span>{" "}
                           {course.sessions?.length || 0}
                         </p>
     
                       
                       </div>
     
                       {/* Right: Teacher Info */}
                       <div className="flex items-center gap-4">
                         <img
                           src={course.teacher.profilePic}
                           alt={course.teacher.name}
                           className="w-16 h-16 rounded-full border border-zinc-400 object-cover"
                         />
                         <div>
                           <p className="font-semibold text-black text-sm">
                             {course.teacher.name}
                           </p>
                           <button onClick={()=>{handleMessage(course.teacher.id)}} className="mt-2 px-3 py-1.5 bg-black text-white rounded-full flex items-center gap-1.5 text-xs hover:bg-zinc-800 transition-colors">
                             <FiMessageSquare size={14} />
                             Message
                           </button>
                         </div>
                       </div>
                     </div>
                   </div>
     })}
                </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-100 rounded-full mb-3">
                    <FaBookOpen className="text-zinc-400" size={20} />
                  </div>
                  <p className="text-sm text-zinc-500">No ongoing courses at the moment</p>
                </div>
              )}
      </div>

      {/* Completed Courses */}
      <div className="bg-white p-5 border border-zinc-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <GiFinishLine className="text-[#005188]" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-zinc-700">Completed Courses</h2>
        </div>

        {isCompleted.length > 0 ? (
          <div className="space-y-3">
            {isCompleted.map((course, i) => (
              <div
                key={i}
                className="border border-zinc-200 p-4 rounded-lg flex justify-between items-center hover:bg-zinc-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-zinc-700">{course.name}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Completed on {new Date(course.completedOn).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-full">
                  <BsCheckCircle className="text-green-500" size={18} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-100 rounded-full mb-3">
              <FaAward className="text-zinc-400" size={20} />
            </div>
            <p className="text-sm text-zinc-500">No courses completed yet</p>
          </div>
        )}
 
      </div>
 <div className="bg-white p-5 border mt-5 border-zinc-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <GiFinishLine className="text-[#005188]" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-zinc-700">In Hiring Process</h2>
        </div>

             {isHiring.length > 0 ? (
  <div className="space-y-3">
    {isHiring.map((hiring, i) => (
      <div
        key={i}
        className="border relative text-sm border-zinc-200 p-4  rounded-lg flex max-w-52 items-center hover:bg-zinc-50 transition-colors"
      >
  
        <div className="flex-1">
      <div className="mb-2">
        <p className="text-sm text-zinc-500">Student Name</p>
        <p className="font-medium text-zinc-700">{hiring.student.name}</p>
      </div>

      <div className="mb-2">
        <p className="text-sm text-zinc-500">Per Month Rate</p>
        <p className="text-xs text-zinc-700">{hiring.perMonthRate}</p>
      </div>

      <div className="mb-2">
        <p className="text-sm text-zinc-500">Subject</p>
        <p className="text-xs text-zinc-700">{hiring.subject}</p>
      </div>

      <div className="mb-2">
        <p className="text-sm text-zinc-500">Starting Date</p>
        <p className="text-xs text-zinc-700">{new Date(hiring.startingDate).toLocaleDateString()}</p>
      </div>

      <div className="mb-2">
        <p className="text-sm text-zinc-500">Class Time Start</p>
        <p className="text-xs text-zinc-700">{hiring.classTime.start}</p>
      </div>

      <div>
        <p className="text-sm text-zinc-500">Class Time End</p>
        <p className="text-xs text-zinc-700">{hiring.classTime.end}</p>
      </div>
      <div className="flex items-center gap-2">
      <Link to={`/class-edit-mod/${hiring._id}`} className="p-2 text-sm text-zinc-500 rounded-lg border border-zinc-200 cursor-pointer  hover:bg-black hover:text-white transition-all ease-in duration-300 flex items-center gap-2 mt-2
      
      "><FaEdit/>edit</Link></div>
        </div>
 
      </div>
    ))}
  </div>
) : (
  <div className="text-center py-8">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-100 rounded-full mb-3">
      <FiBriefcase className="text-zinc-400" size={20} />
    </div>
    <p className="text-sm text-zinc-500">No hiring processes yet</p>
  </div>
)}</div>
    </div>
  );
};

export default StudentDashboard;