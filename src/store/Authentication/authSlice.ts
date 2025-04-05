import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { AuthState, AuthResponse } from './type';
import {AuthValues} from "@/pages/auth/type.ts";
import {API_BASE_URL} from "@/config/api.ts";
import {PasswordResetValues, RequestPasswordResetValues} from "@/pages/auth/password-reset/type.ts";

// Helper to extract a typed error message from Axios
const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message;
    }
    return 'An unknown error occurred';
};

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

const initialState: AuthState = {
    user: null,
    token: null,
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(requestResetPassword.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.status = 'succeeded';
                state.error = null;
            })
             .addCase(resetPassword.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Registration failed';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Login failed';
            })
            .addCase(requestResetPassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Password reset mail failed';
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Password reset failed';
            })
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.status = 'loading';
                    state.error = null;
                }
            );
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
