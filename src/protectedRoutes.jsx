// src/components/common/AuthGuard.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchuser } from "./Redux/slices/authSlice";
import { useEffect } from "react";

const AuthGuard = () => {
  const dispatch = useDispatch();
  const {loading,isAuthenticated,user} = useSelector((state) => state.auth);
  const location = useLocation();
console.log(loading,isAuthenticated,".....")
  useEffect(() => {
    dispatch(fetchuser());
  }, [dispatch]);

  const protectedRoutes = ["class-hiring","/dashboard","videocall", "/messages", "/find-teachers","/jobs","/jobpost",'/mobile','/classroom'];
  // ✅ Case 1: If user is authenticated and tries login/signup/home → redirect to dashboard
  if (
    isAuthenticated &&
    (location.pathname.startsWith("/login") ||
      location.pathname.startsWith("/signup") ||
      location.pathname === "/")
  ) {
      const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  // ✅ Case 2: If user is NOT authenticated but tries to access protected routes → redirect to login
  if (!isAuthenticated &&  protectedRoutes.some(route => 
  location.pathname.startsWith(route)
)) {
    console.log("pass")
  return <Navigate to="/login" state={{from:location}} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
