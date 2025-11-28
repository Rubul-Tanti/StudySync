import api from "../utils/axios"

export const createClassApi=async(data)=>{
     const res=await api.post("/v1/hire/create-class",data)
return res.data 
}
export const fetchClasses=async(data)=>{
    const res=await api.post('/v1/fetch-classes',data)
    return res.data
}

export const aproveClass=async(data)=>{
    const res=await api.post('/v1/aprove-class',data)
    return res.data

}
export const updateClassApi=async(data)=>{
    const res=await api.post("/v1/hire/update-class",data)
    return res.data
}