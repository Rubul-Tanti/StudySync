import api from "../utils/axios"

const registerTeacher=async(data)=>{

    const res=await api.post("/v1/verifyTeacherAndRegisterTeacher",data,{ headers: {
      "Content-Type": "multipart/form-data", // 👈 important
    },})
    return res.data
}
export default registerTeacher