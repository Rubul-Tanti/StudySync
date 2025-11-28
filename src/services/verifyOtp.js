import  api from "../utils/axios.js";
const verifyOtp = async (data) => {
    console.log(data)
    const res = await api.post("/v1/verifyStudentAndRegisterStudent", data);
    if (res.status !== 200) throw new Error("OTP verification failed");
    return res.data;
  
}
export default verifyOtp;