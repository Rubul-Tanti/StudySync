// src/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios.js";
import { toast } from "react-toastify";
import fetchUser from"../../services/fetchUser"
import { Navigate, useNavigate } from "react-router-dom";

export const fetchuser = createAsyncThunk("v1/fetchuser", async (_, { rejectWithValue }) => {
  try {
    const data=await fetchUser()
    if(data.success){
      const user=data.user
      const accessToken=data.accessToken
      return {user,accessToken}
    }
  } catch (err) {
    const data =err.response.data

  return rejectWithValue("Unauthorized")
    toast.error("something went wrong")
  }

});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchuser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchuser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
localStorage.setItem("user", JSON.stringify({
  id: action.payload.user._id,
  role: action.payload.user.role
}));
        state.accessToken=action.payload.accessToken
        state.isAuthenticated = true;
      })
      .addCase(fetchuser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
