import api from "../utils/axios"
const fetchUser=async()=>{
    const res=await api.post("/v1/fetchuser")
    return res.data
}
export default fetchUser