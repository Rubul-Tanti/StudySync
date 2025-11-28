import api from "../utils/axios.js";
export const Login = async (email, password) => {
  
  const res = await api.post("/v1/login", { email, password });
  console.log(res.data)
  return res.data;
};
export default Login