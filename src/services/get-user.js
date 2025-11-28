import api from "../utils/axios"

const GetUser=async(data)=>{
    console.log(data)
const res=await api.post("/v1/get-user",data)
return res.data

}
export default GetUser