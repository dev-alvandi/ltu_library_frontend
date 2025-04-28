import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axiosInstance from "@/config/api.ts";
import {getErrorMessage} from "@/utils/getErrorMessage.ts";
import {AuthResponse} from "@/store/authSlice.ts";

interface User {
    userId: number;

    firstName: string;
    lastName: string;

    dateOfBirth: string;

    phoneNumber: string;
    city: string;
    street: string;
    postalCode: string;

    email: string;

    userType: string
}

interface UserState {
    user: User | null;
    token: string;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: UserState = {
    user: null,
    token: "",
    status: "idle",
    error: null,
};

// Update profile
export const updateProfile = createAsyncThunk<
    AuthResponse,
    User,
    { rejectValue: string }
>("user/updateProfile", async (updatedData, thunkAPI) => {
    try {
        const response = await axiosInstance.put<AuthResponse>(`/api/user/update-profile`, updatedData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

// Update password
export const updatePassword = createAsyncThunk<
    User,
    { oldPassword: string; newPassword: string; confirmNewPassword: string },
    { rejectValue: string }
>("user/updatePassword", async (passwordData, thunkAPI) => {
    try {
        const response = await axiosInstance.put<User>(`/api/user/update-password`, passwordData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.status = "succeeded";
            state.error = null;
        },
        clearUser: (state) => {
            state.user = null;
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.status = "succeeded";
                state.error = null;

                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Updating profile failed.";
            })

            .addCase(updatePassword.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
                state.error = null;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Updating password failed.";
            })
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
