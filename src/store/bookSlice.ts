import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axiosInstance, {API_BASE_URL} from "@/config/api.ts";
import {getErrorMessage} from "@/utils/getErrorMessage.ts";
import {FILTERS_TYPE} from "@/pages/search-resources/books/type.ts";
import axios from "axios";
import {ReceivingBook} from "@/types/entitiesType.ts";
import {booksParamsSerializer} from "@/utils/booksParamsSerializer.ts";


interface AllBooksFilters {
    languages: Record<string, number>,
    categories: Record<string, number>,
    publishedYearRange: { minYear: number, maxYear: number },
}

interface Suggestions {
    title: string[];
    isbn: string[];
    author: string[];
    publisher: string[];
}


interface SearchBooksArgs extends FILTERS_TYPE {
    query: string;
    page: number
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
    isAvailable: boolean;
    minPublishedYear: number;
    maxPublishedYear: number;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    suggestions: Suggestions
}


const currentYear = new Date().getFullYear();

const initialState: BookState = {
    results: initialPaginationBookResponse,
    languages: {},
    categories: {},
    isAvailable: true,
    minPublishedYear: 1000,
    maxPublishedYear: currentYear,
    status: "idle",
    error: null,
    suggestions: {
        title: [],
        isbn: [],
        author: [],
        publisher: [],
    },

};

export const getAllBooks = createAsyncThunk<PaginationBookResponse, number, { rejectValue: string }>(
    "books/getAllBooks",
    async (pageIndex = 0, thunkAPI) => {
        try {
            const response = await axios.get<PaginationBookResponse>(
                `${API_BASE_URL}/resources/books`,
                {params: {page: pageIndex}}
            );
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
                    params: filters,
                    paramsSerializer: booksParamsSerializer
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

export const fetchSuggestions = createAsyncThunk<Suggestions, string, { rejectValue: string }>(
    "books/fetchSuggestions",
    async (query, thunkAPI) => {
        try {
            // console.log(encodeURIComponent(query))
            const response = await axios.get<Suggestions>(
                `${API_BASE_URL}/resources/suggested-books?query=${encodeURIComponent(query)}`
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const searchBooks = createAsyncThunk<PaginationBookResponse, SearchBooksArgs, { rejectValue: string }>(
    "books/searchBooks",
    async (args, thunkAPI) => {
        try {
            const response = await axios.get<PaginationBookResponse>(
                `${API_BASE_URL}/resources/searched-books`,
                {
                    params: args,
                    paramsSerializer: booksParamsSerializer,
                }
            );
            console.log(response.data)
            return response.data;
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue("Search failed");
        }
    }
);

export const borrowBook = createAsyncThunk<
    string, // success message or response DTO
    string, // bookId
    { rejectValue: string }
>("books/borrowBook", async (bookId, thunkAPI) => {
    try {
        const response = await axiosInstance.post(`/resources/borrow/${bookId}`);
        thunkAPI.dispatch(bookSlice.actions.updateBookByBookIdUponSuccessfulBorrow(response.data.book.bookId));
        return response.data.message || "Book borrowed successfully";
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

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
        updateBookByBookIdUponSuccessfulBorrow: (state, action: PayloadAction<string>) => {
            const book = state.results?.content.find(b => b.bookId === action.payload);
            if (book && book.numberOfAvailableToBorrowCopies > 0) {
                book.numberOfAvailableToBorrowCopies -= 1;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllBooks.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getAllBooks.fulfilled, (state, action) => {
                state.results = action.payload;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(getAllBooks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Fetching all books failed";
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
                state.error = action.payload || "Fetching filtered books failed";
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
                state.error = action.payload || "Fetching all filters failed";
            })
            .addCase(fetchSuggestions.fulfilled, (state, action) => {
                state.suggestions = action.payload;
            })
            .addCase(fetchSuggestions.rejected, (state) => {
                state.suggestions = {
                    title: [],
                    isbn: [],
                    author: [],
                    publisher: [],
                };
            })
            .addCase(searchBooks.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(searchBooks.fulfilled, (state, action) => {
                state.results = action.payload;
                state.status = "succeeded";
            })
            .addCase(searchBooks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Unknown error";
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
            });
    },
});

export const {setBooks, clearBooks} = bookSlice.actions;
export default bookSlice.reducer;
