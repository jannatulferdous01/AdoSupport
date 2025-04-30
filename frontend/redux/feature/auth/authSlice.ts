import { createSlice } from "@reduxjs/toolkit";

type TAuthSliceState = {
  id: string;
  name: string;
  email: string;
  role: "";
  status: "";
  token: string;
};

const initialState: TAuthSliceState = {
  id: "",
  name: "",
  email: "",
  role: "",
  status: "",
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.status = action.payload.status;
      state.token = action.payload.token;
    },
    removeAuth: (state) => {
      state.id = "";
      state.name = "";
      state.email = "";
      state.role = "";
      state.status = "";
      state.token = "";
    },
  },
});
export const { setAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;
