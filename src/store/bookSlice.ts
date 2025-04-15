import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {API_BASE_URL} from "@/config/api.ts";
import { getErrorMessage } from "@/utils/getErrorMessage.ts";
import {FILTERS_TYPE} from "@/pages/search-resources/type.ts";
import axios from "axios";
import {ReceivingBook} from "@/types/entitiesType.ts";


interface AllBooksFilters {
    languages: Record<string, number>,
    categories: Record<string, number>,
    publishedYearRange: { minYear: number, maxYear: number },
}

export interface PaginationBookResponse {
    content: ReceivingBook[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    size: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    totalElements: number;
    totalPages: number;
}

const initialPaginationBookResponse = {
    content: [],
    empty: true,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 0,
    pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: {
            sorted: false,
            unsorted: true,
            empty: true,
        },
        offset: 0,
        paged: false,
        unpaged: true,
    },
    size: 10,
    sort: {
        sorted: false,
        unsorted: true,
        empty: true,
    },
    totalElements: 0,
    totalPages: 0,
}

interface BookState {
    results: PaginationBookResponse | null;
    languages: Record<string, number>,
    categories: Record<string, number>,
    availabilities: ("Available to Borrow" | "Reserved Only")[];
    minPublishedYear: number;
    maxPublishedYear: number;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const currentYear = new Date().getFullYear();

const initialState: BookState = {
    results: initialPaginationBookResponse,
    languages: {},
    categories: {},
    availabilities: ["Available to Borrow", "Reserved Only"],
    minPublishedYear: 1000,
    maxPublishedYear: currentYear,
    status: "idle",
    error: null,
};

export const getAllBooks = createAsyncThunk<PaginationBookResponse, void, { rejectValue: string }>(
    "books/getAllBooks",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get<PaginationBookResponse>(`${API_BASE_URL}/resources/books`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const filteredBooks = createAsyncThunk<PaginationBookResponse, FILTERS_TYPE, { rejectValue: string }>(
    "books/filteredBooks",
    async (filters, thunkAPI) => {
        try {
            const response = await axios.get<PaginationBookResponse>(
                `${API_BASE_URL}/resources/filtered-books`,
                {
                    params: filters, // ✅ the key fix
                    paramsSerializer: (params) =>
                        new URLSearchParams(
                            Object.entries(params).flatMap(([key, value]) => {
                                if (Array.isArray(value)) {
                                    return value.map((v) => [key, v]);
                                }
                                return [[key, String(value)]];
                            })
                        ).toString(),
                }
            );

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const allBooksFilters = createAsyncThunk<AllBooksFilters, void, { rejectValue: string }>(
    "books/allBooksFilters",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get<AllBooksFilters>(`${API_BASE_URL}/resources/books-filters`);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

const bookSlice = createSlice({
    name: "books",
    initialState,
    reducers: {
        setBooks: (state, action: PayloadAction<ReceivingBook[]>) => {
            state.results = {
                content: action.payload,
                empty: action.payload.length === 0,
                first: true,
                last: true,
                number: 0,
                numberOfElements: action.payload.length,
                pageable: {
                    pageNumber: 0,
                    pageSize: action.payload.length,
                    sort: {
                        sorted: false,
                        unsorted: true,
                        empty: true,
                    },
                    offset: 0,
                    paged: false,
                    unpaged: true,
                },
                size: action.payload.length,
                sort: {
                    sorted: false,
                    unsorted: true,
                    empty: true,
                },
                totalElements: action.payload.length,
                totalPages: 1,
            };

            state.status = "succeeded";
            state.error = null;
        },
        clearBooks: (state) => {
            state.results = null;
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllBooks.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getAllBooks.fulfilled, (state, action) => {
                state.results = action.payload;
                console.log(action.payload)
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(getAllBooks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Unknown error";
            })
            .addCase(filteredBooks.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(filteredBooks.fulfilled, (state, action) => {
                state.results = action.payload;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(filteredBooks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Unknown error";
            })
            .addCase(allBooksFilters.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(allBooksFilters.fulfilled, (state, action) => {
                state.languages = action.payload.languages;
                state.categories = action.payload.categories;
                state.minPublishedYear = action.payload.publishedYearRange.minYear;
                state.maxPublishedYear = action.payload.publishedYearRange.maxYear;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(allBooksFilters.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Unknown error";
            });
    },
});

export const { setBooks, clearBooks } = bookSlice.actions;
export default bookSlice.reducer;
