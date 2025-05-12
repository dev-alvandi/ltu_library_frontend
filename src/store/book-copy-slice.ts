import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/configuration/api.ts";
import { getErrorMessage } from "@/utils/getErrorMessage.ts";



export interface BookCopyResponse {
    bookCopyId: string;
    barcodeId: string;
    barcodeUrl: string;
    status: "AVAILABLE" | "BORROWED" | "LOST";
    physicalLocation: string;
    itemReferenceCopy: boolean;
}

export interface PaginationBookCopyResponse {
    content: BookCopyResponse[];
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

export interface BookCopyRequest {
    bookCopyId: string;
    status?: string;
    physicalLocation: string;
    itemReferenceCopy: boolean;
}


const initialPaginationBookCopyResponse: PaginationBookCopyResponse = {
    content: [],
    empty: true,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 0,
    pageable: {
        pageNumber: 0,
        pageSize: 5,
        sort: {
            sorted: false,
            unsorted: true,
            empty: true,
        },
        offset: 0,
        paged: false,
        unpaged: true,
    },
    size: 5,
    sort: {
        sorted: false,
        unsorted: true,
        empty: true,
    },
    totalElements: 0,
    totalPages: 0,
};

interface BookCopyState {
    copies: PaginationBookCopyResponse;
    bookId: string;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: BookCopyState = {
    copies: initialPaginationBookCopyResponse,
    bookId: "",
    status: "idle",
    error: null,
};

export const fetchBookCopiesByBookId = createAsyncThunk<
    PaginationBookCopyResponse,
    { bookId: string; page: number },
    { rejectValue: string }
>("bookCopies/fetchBookCopiesByBookId", async ({ bookId, page }, thunkAPI) => {
    try {
        const response = await axiosInstance.get<PaginationBookCopyResponse>(`/resources/book/${bookId}/book-copies`, {
            params: { page },
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

export const createBookCopy = createAsyncThunk<
    void,
    BookCopyRequest,
    { rejectValue: string }
>("bookCopies/createBookCopy", async (newCopy, thunkAPI) => {
    try {
        await axiosInstance.post(`/resources/book-copy/${newCopy.bookCopyId}/create`, {
            physicalLocation: newCopy.physicalLocation,
            itemReferenceCopy: newCopy.itemReferenceCopy,
        });
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

export const updateBookCopy = createAsyncThunk<
    BookCopyResponse,
    BookCopyRequest,
    { rejectValue: string }
>("bookCopies/updateBookCopy", async (updatedCopy, thunkAPI) => {
    try {
        const response = await axiosInstance.put<BookCopyResponse>(`/resources/book-copy/${updatedCopy.bookCopyId}/update`, {
            status: updatedCopy.status,
            physicalLocation: updatedCopy.physicalLocation,
            itemReferenceCopy: updatedCopy.itemReferenceCopy,
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

export const deleteBookCopy = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("bookCopies/deleteBookCopy", async (bookCopyId, thunkAPI) => {
    try {
        const response = await axiosInstance.delete(`/resources/book-copy/${bookCopyId}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});


const bookCopySlice = createSlice({
    name: "bookCopies",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookCopiesByBookId.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchBookCopiesByBookId.fulfilled, (state, action: PayloadAction<PaginationBookCopyResponse>) => {
                state.status = "succeeded";
                state.copies = action.payload;
            })
            .addCase(fetchBookCopiesByBookId.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Fetching book copies failed";
            })

            .addCase(createBookCopy.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(createBookCopy.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(createBookCopy.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Creating book copy failed";
            })

            .addCase(updateBookCopy.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateBookCopy.fulfilled, (state) => {
                state.status = "succeeded";
                state.error = null;


            })
            .addCase(updateBookCopy.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Fetching book by ID failed";
            })

            .addCase(deleteBookCopy.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(deleteBookCopy.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(deleteBookCopy.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Fetching book by ID failed";
            })
        ;
    },
});

export default bookCopySlice.reducer;
