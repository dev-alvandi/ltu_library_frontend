import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance, { API_BASE_URL } from "@/configuration/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface Resource {
    id: string;
    imageUrl: string;
    title: string;
}

interface LibraryState {
    cart: {
        borrowingBooks: Resource[];
        reservingBooks: Resource[];
        borrowingFilms: Resource[];
        reservingFilms: Resource[];
    };
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    message: string | null;
}

const initialState: LibraryState = {
    cart: {
        borrowingBooks: [],
        reservingBooks: [],
        borrowingFilms: [],
        reservingFilms: [],
    },
    status: "idle",
    error: null,
    message: null,
};

interface BulkLoanRequest {
    borrowingBookIds: string[];
    borrowingFilmIds: string[];
    reservingBookIds: string[];
    reservingFilmIds: string[];
}

interface BulkLoanResponse {
    message: string;
    failedItems?: string[];
}

// Async actions
export const borrowItems = createAsyncThunk<BulkLoanResponse, BulkLoanRequest, { rejectValue: string }>(
    "library/borrowItems",
    async (payload, thunkAPI) => {
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/resources/borrow-multiple`, payload);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const returnItems = createAsyncThunk<BulkLoanResponse, string[], { rejectValue: string }>(
    "library/returnItems",
    async (loanItemIds, thunkAPI) => {
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/resources/return-multiple`, { loanItemIds });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const extendLoans = createAsyncThunk<BulkLoanResponse, string[], { rejectValue: string }>(
    "library/extendLoans",
    async (loanItemIds, thunkAPI) => {
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/resources/extend-multiple`, { loanItemIds });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

// Helper type
type CartKey = keyof LibraryState["cart"];

const libraryActionsSlice = createSlice({
    name: "libraryActions",
    initialState,
    reducers: {
        clearLibraryMessages: (state) => {
            state.message = null;
            state.error = null;
            state.status = "idle";
        },

        addToCart: (
            state,
            action: PayloadAction<{
                type: "borrow" | "reserve";
                kind: "book" | "film";
                item: Resource;
            }>
        ) => {
            const { type, kind, item } = action.payload;
            const key = `${type}ing${kind.charAt(0).toUpperCase() + kind.slice(1)}s` as CartKey;

            if (!state.cart[key].some((r) => r.id === item.id)) {
                state.cart[key].push(item);
                localStorage.setItem("libraryCart", JSON.stringify(state.cart));
            }
        },

        removeFromCart: (
            state,
            action: PayloadAction<{
                id: string;
                type: "borrow" | "reserve";
                kind: "book" | "film";
            }>
        ) => {
            const { id, type, kind } = action.payload;
            const key = `${type}ing${kind.charAt(0).toUpperCase() + kind.slice(1)}s` as CartKey;

            state.cart[key] = state.cart[key].filter((item) => item.id !== id);
            localStorage.setItem("libraryCart", JSON.stringify(state.cart));
        },

        emptyCart: (state) => {
            state.cart = {
                borrowingBooks: [],
                reservingBooks: [],
                borrowingFilms: [],
                reservingFilms: [],
            };
            localStorage.removeItem("libraryCart");
        },

        setCartFromStorage: (state) => {
            const stored = localStorage.getItem("libraryCart");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    state.cart = parsed;
                } catch (e: unknown) {
                    console.warn("Failed to parse cart from localStorage");
                }
            }
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(borrowItems.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(borrowItems.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.message = action.payload.message;
            })
            .addCase(borrowItems.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to borrow items.";
            })
            .addCase(returnItems.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(returnItems.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.message = action.payload.message;
            })
            .addCase(returnItems.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to return items.";
            })
            .addCase(extendLoans.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(extendLoans.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.message = action.payload.message;
            })
            .addCase(extendLoans.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to extend loans.";
            });
    },
});

export const {
    clearLibraryMessages,
    addToCart,
    removeFromCart,
    emptyCart,
    setCartFromStorage,
} = libraryActionsSlice.actions;

export default libraryActionsSlice.reducer;
