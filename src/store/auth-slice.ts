import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {AuthValues} from "@/pages/auth/type.ts";
import axiosInstance, {API_BASE_URL} from "@/configuration/api.ts";
import {PasswordResetValues, RequestPasswordResetValues} from "@/pages/auth/password-reset/type.ts";
import {User} from "@/types/entitiesType.ts";
import {getErrorMessage} from "@/utils/getErrorMessage.ts";

export interface AuthResponse {
    user: User;
    token: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    authenticationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    registerStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    resetStatus: 'idle' | 'loading' | 'succeeded' | 'failed';

    error: string | null;
}


export const registerUser = createAsyncThunk<AuthResponse, AuthValues, { rejectValue: string }>(
    'auth/registerUser',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/register`, userData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const loginUser = createAsyncThunk<AuthResponse, AuthValues, { rejectValue: string }>(
    'auth/loginUser',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, credentials);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const requestResetPassword = createAsyncThunk<AuthResponse, RequestPasswordResetValues, { rejectValue: string }>(
    'auth/requestPasswordReset',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/request-password-reset`, credentials);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);
export const resetPassword = createAsyncThunk<AuthResponse, PasswordResetValues, { rejectValue: string }>(
    'auth/passwordReset',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/password-reset`, credentials);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const deleteAccount = createAsyncThunk<string, void, { rejectValue: string }>(
    'auth/deleteAccount',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.delete(`${API_BASE_URL}/auth/delete-account`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

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

const initialState: AuthState = {
    user: null,
    token: null,
    authenticationStatus: 'idle',
    registerStatus: 'idle',
    resetStatus: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            localStorage.removeItem("token");
            state.user = null;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.registerStatus = 'succeeded';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
                state.authenticationStatus = 'succeeded';
                state.error = null;
            })
            .addCase(requestResetPassword.fulfilled, (state) => {
                state.resetStatus = 'succeeded';
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.resetStatus = 'succeeded';
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.registerStatus = 'failed';
                state.error = action.payload || 'Registration failed';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.authenticationStatus = 'failed';
                state.error = action.payload || 'Login failed';
            })
            .addCase(requestResetPassword.rejected, (state, action) => {
                state.resetStatus = 'failed';
                state.error = action.payload || 'Password reset mail failed';
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.resetStatus = 'failed';
                state.error = action.payload || 'Password reset failed';
            })
            .addCase(registerUser.pending, (state) => {
                state.registerStatus = 'loading';
                state.error = null;
            })
            .addCase(loginUser.pending, (state) => {
                state.authenticationStatus = 'loading';
                state.error = null;
            })
            .addCase(requestResetPassword.pending, (state) => {
                state.resetStatus = 'loading';
                state.error = null;
            })
            .addCase(resetPassword.pending, (state) => {
                state.resetStatus = 'loading';
                state.error = null;
            })


            .addCase(isJwtTokenValid.pending, (state) => {
                state.authenticationStatus = "loading";
                state.error = null;
            })
            .addCase(isJwtTokenValid.fulfilled, (state, action) => {
                state.user = action.payload;
                state.token = localStorage.getItem("token");
                state.authenticationStatus = "succeeded";
                state.error = null;
            })
            .addCase(isJwtTokenValid.rejected, (state, action) => {
                localStorage.removeItem("token");

                state.authenticationStatus = "failed";
                state.user = null;
                state.error = action.payload || "Unknown error";
            })


            .addCase(deleteAccount.pending, (state) => {
                state.authenticationStatus = "loading";
                state.error = null;
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                state.user = null;
                state.token= ""
                localStorage.removeItem("token");

                state.error = null;
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.error = action.payload || "Unknown error";
            })
    },
});

export const {logout} = authSlice.actions;
export default authSlice.reducer;
