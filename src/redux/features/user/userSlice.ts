import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/redux/type";

export interface UserState {
  token: string | null;
  user: AuthUser | null;
}

const getInitialToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("ss_token");
  }
  return null;
};

const getInitialUser = (): AuthUser | null => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("ss_user");
    return raw ? JSON.parse(raw) : null;
  }
  return null;
};

const initialState: UserState = {
  token: getInitialToken(),
  user: getInitialUser(),
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSession: (
      _state,
      action: PayloadAction<{ token: string; user: AuthUser }>
    ) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("ss_token", action.payload.token);
        localStorage.setItem("ss_user", JSON.stringify(action.payload.user));
      }
      return {
        token: action.payload.token,
        user: action.payload.user,
      };
    },
    clearSession: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("ss_token");
        localStorage.removeItem("ss_user");
      }
      return { token: null, user: null };
    },
    updateUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("ss_user", JSON.stringify(action.payload));
      }
    },
  },
});

export const { setSession, clearSession, updateUser } = userSlice.actions;
export default userSlice.reducer;

