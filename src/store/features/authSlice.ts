import { APIClient } from "@/core/api";
import { ADMIN_ROLE } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  email: string;
  fullName: string;
  role: ADMIN_ROLE | undefined;
  id: string;
  status: string;
  isAuthenticated: boolean | undefined;
  loading: boolean;
}
const initialState: AuthState = {
  email: "",
  fullName: "",
  role: undefined,
  id: "",
  status: "",
  isAuthenticated: undefined,
  loading: false,
};

const client = APIClient.getInstance();
export const getProfile = createAsyncThunk("auth/getProfile", async () => {
  const { data } = await client.users.getProfile();
  return data;
});

export const authSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateDetails: (state, action: PayloadAction<AuthState>) => {
      state = { ...state, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDefault: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      const { email, _id, status, role, fullName } = action.payload;

      state.email = email;
      state.fullName = fullName;
      state.id = _id;
      state.role = role as ADMIN_ROLE;
      state.status = status;
      state.isAuthenticated = true;
      state.loading = false;
    });
    builder.addCase(getProfile.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
    });
  },
});

export const { updateDetails, setLoading, setDefault } = authSlice.actions;

export default authSlice.reducer;
