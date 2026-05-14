import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  sessionExpired: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("access_token"),
  sessionExpired: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.sessionExpired = false;
      localStorage.setItem("access_token", action.payload);
    },
    setSessionExpired(state, action: PayloadAction<boolean>) {
      state.sessionExpired = action.payload;
    },
    logout(state) {
      state.token = null;
      state.sessionExpired = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
    },
  },
});

export const { setToken, setSessionExpired, logout } = authSlice.actions;
export default authSlice.reducer;
