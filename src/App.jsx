import { Routes, Route } from "react-router-dom";
import LandingpageLayout from "./pages/landingpage/layout";
import HomePage from "./pages/landingpage/home";
import SubscriptionsPlan from "./pages/landingpage/subscriptionPlans";
import Login from "./pages/Login&signup/login";
import RoleSelection from "./pages/Login&signup/role-selection";
import StudentRegistration from "./pages/Login&signup/student-registration";
import TutorRegisterForm from "./pages/Login&signup/tutor-registration";
import Signup from "./pages/Login&signup/signup";
import { ToastContainer } from "react-toastify";
import StudentDashboard from "./components/Student/dashboard";
import FindTeachers from "./components/Student/findteacher";
import Chat from "./components/common/message/message";
import Settings from "./components/settings";
import Layoutpage from "./pages/student/home";
import TeacherDashboard from "./components/teacher/dashboard";
import Videocall from "./components/common/Videocall";
import AuthGuard from "./protectedRoutes";
import DashboardLaout from "./components/dashboardLaout";
import MyPosts from "./components/jobPost/postPage";
import CreatePost from "./components/jobPost/createpost";
import CourseList from "./components/teacher/findStudents";
import JobDetails from "./components/teacher/jobDetails";
import MyPostDetails from "./components/jobPost/mypostdetails";
import EditPost from "./components/jobPost/editPost";
import Message from "./components/common/message/chat";
import TeacherDetails from "./components/Student/teacherDetails";
import { useEffect } from "react";
import {SocketProvider, useSocket } from "../soket";
import { useSelector } from "react-redux";
import ClassHiringUI from "./components/classRoom/classHiringUi";
import EditClass from "./components/classRoom/editClass";
import Profile from "./components/common/profile";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const socket=useSocket()
  useEffect(() => {
    if (isAuthenticated && socket) {
      console.log("✅ User authenticated, setting up socket...");

      socket.on("connect", () => {
        console.log("🟢 Socket connected:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected");
      });

      // cleanup listeners on unmount or auth change
      return () => {
        socket.off("connect");
        socket.off("disconnect");
      };
    }
  }, [isAuthenticated]); // runs whenever auth changes

  return (
    <>
    <SocketProvider>
      <Routes>
        <Route element={<AuthGuard />}>
          {/* Public landing routes */}
          <Route path="/" element={<LandingpageLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/subscription-plans" element={<SubscriptionsPlan />} />
          </Route>

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />}>
            <Route path="/signup/role-selection" element={<RoleSelection />} />
            <Route
              path="/signup/student-registration"
              element={<StudentRegistration />}
            />
            <Route
              path="/signup/tutor-registration"
              element={<TutorRegisterForm />}
            />
          </Route>

          {/* Protected routes with SocketProvider */}
            <Route element={<Layoutpage />}>

              <Route path="dashboard" element={<DashboardLaout />} />
              <Route path="find-teachers" element={<FindTeachers />} />
              <Route path="profile" element={<Profile/>}/>
              <Route path="find-teachers/:id" element={<TeacherDetails />} />
              <Route path="messages" element={<Chat />}>
              <Route path="/messages/chat/:id" element={<Message />} />  
              </Route>
              <Route path="/jobpost" element={<MyPosts />} />
              <Route path="/jobpost/edit/:id" element={<EditPost />} />
              <Route path="/jobpost/:id" element={<MyPostDetails />} />
              <Route path="/create-job" element={<CreatePost />} />
              <Route path="/jobs/:page" element={<CourseList />} />
              <Route path="/jobs/page/" element={<CourseList />} />
              <Route path="/jobs/page/:id" element={<JobDetails />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/jobs" element={<CourseList />} />
              <Route path="class-hiring-mod/:jobId/:proposalId" element={<ClassHiringUI/>}/>
              <Route path="class-edit-mod/:classId" element={<EditClass/>}/>
            </Route>
              <Route path="/classroom/:videoRoom" element={<Videocall />} />
        </Route>
      </Routes>
      <ToastContainer />
          </SocketProvider>
    </>
  );
}

export default App;
