import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {getErrorMessage} from "@/utils/getErrorMessage.ts";
import axiosInstance from "@/config/api.ts";

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
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: UserState = {
    user: null,
    status: "idle",
    error: null,
};

// ✅ Thunk to validate JWT
export const isJwtTokenValid = createAsyncThunk<
    User, // Success type
    void, // No argument
    { rejectValue: string } // Custom error return
>("user/isJwtTokenValid", async (_, thunkAPI) => {
    try {
        const response = await axiosInstance.get<User>(`/auth/is-jwt-valid`);
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
            .addCase(isJwtTokenValid.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(isJwtTokenValid.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(isJwtTokenValid.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Unknown error";
                state.user = null;
            });
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
