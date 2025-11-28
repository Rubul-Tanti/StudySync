import { useQuery } from "@tanstack/react-query";
import api from "../utils/axios.js"

const sendOtp=async(data)=>{

    const res=await api.post("/v1/email-verification",{email:data})
    return res.data;
}   
export default sendOtp