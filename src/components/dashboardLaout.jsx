import React, { useEffect, useState } from 'react'
import {useSelector} from "react-redux"
import StudentDashboard from './Student/dashboard'
import TeacherDashboard from './teacher/dashboard'
import { Navigate, Route, useNavigate } from 'react-router-dom'
import Login from '../pages/Login&signup/login'
import Loader from './loader'
const DashboardLaout = () => {
    const navigate=useNavigate()
    const user=useSelector((state)=>state.auth.user)
    if(!user){
        return <Loader/>
    }
return<>
{user.role==="student"?<StudentDashboard/>:<TeacherDashboard/>}
</>
}

export default DashboardLaout
