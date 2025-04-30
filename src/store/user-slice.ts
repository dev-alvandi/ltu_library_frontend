import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axiosInstance from "@/config/api.ts";
import {getErrorMessage} from "@/utils/getErrorMessage.ts";
import {AuthResponse} from "@/store/auth-slice.ts";
import {createInitialPaginationResponse, PaginationResponse} from "@/types/entitiesType.ts";



export interface LoanItemResponse {
    loanId: string; // UUID
    imageUrl: string;
    title: string;
    borrowedAt: string;
    dueAt: string;
    isReturned: boolean;
    status: "RETURNED" | "NOT_RETURNED" | "OVERDUE";
    extendable: boolean
}

export interface ReservationResponse {
    reservationId: string;
    title: string;
    imageUrl: string;
    reservedAt: string; // ISO string
    queuePosition: number;
}


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
    loans: PaginationResponse<LoanItemResponse>;
    reservations: PaginationResponse<ReservationResponse>
}

const initialState: UserState = {
    user: null,
    token: "",
    status: "idle",
    error: null,

    loans: createInitialPaginationResponse<LoanItemResponse>(5),
    reservations: createInitialPaginationResponse<ReservationResponse>(5)
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

export const borrowBook = createAsyncThunk<
    string, // success message or response DTO
    string, // bookId
    { rejectValue: string }
>("books/borrowBook", async (bookId, thunkAPI) => {
    try {
        const response = await axiosInstance.post(`/api/user/borrow/${bookId}`);
        return response.data.message || "Book borrowed successfully";
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

export const returnResource = createAsyncThunk<
    string, // success message
    string, // barcode
    { rejectValue: string }
>("user/returnResource", async (barcode, thunkAPI) => {
    try {
        const response = await axiosInstance.put(`/api/user/return-resource/${barcode}`);
        return response.data; // or response.data.message if your backend wraps it
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

export const extendResource = createAsyncThunk<
    string, // success message
    string, // loanId
    { rejectValue: string }
>("user/extendResource", async (loanId, thunkAPI) => {
    try {
        const response = await axiosInstance.put(`/api/user/extend-loan/${loanId}`);
        return response.data; // or response.data.message if you return a wrapped object
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

export const getLoanItems = createAsyncThunk<
    PaginationResponse<LoanItemResponse>,
    number,
    { rejectValue: string }
>("user/getLoanItems", async (page, thunkAPI) => {
    try {
        const response = await axiosInstance.get(`/api/user/loans`, {
            params: { page }
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

export const fetchUserReservations = createAsyncThunk<
    PaginationResponse<ReservationResponse>, // response type
    number,                // argument type (userId)
    { rejectValue: string } // rejected type
>(
    "user/fetchUserReservations",
    async (page, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`/api/user/reservations`, {
                params: { page }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);


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
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);

                state.status = "succeeded";
                state.error = null;
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

            .addCase(borrowBook.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(borrowBook.fulfilled, (state) => {
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(borrowBook.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Borrowing failed";
            })

            .addCase(returnResource.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(returnResource.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = "succeeded";
                state.error = null;
                console.log("Return success:", action.payload);
            })
            .addCase(returnResource.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to return resource.";
            })

            .addCase(extendResource.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(extendResource.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = "succeeded";
                state.error = null;
                console.log("Extension success:", action.payload);
            })
            .addCase(extendResource.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to extend the loan.";
            })


            .addCase(getLoanItems.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getLoanItems.fulfilled, (state, action: PayloadAction<PaginationResponse<LoanItemResponse>>) => {
                state.loans = action.payload;
                state.status = "succeeded";
                state.error = null;

                console.log(action.payload)
            })
            .addCase(getLoanItems.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to fetch loans.";
            })

            .addCase(fetchUserReservations.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchUserReservations.fulfilled, (state, action: PayloadAction<PaginationResponse<ReservationResponse>>) => {
                state.reservations = action.payload;
                state.status = "succeeded";
                state.error = null;

                console.log(action.payload)
            })
            .addCase(fetchUserReservations.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to fetch loans.";
            });
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
