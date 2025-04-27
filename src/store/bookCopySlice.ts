import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/config/api.ts";
import { getErrorMessage } from "@/utils/getErrorMessage.ts";

interface BookCopyResponse {
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
    size: number;
    totalElements: number;
    totalPages: number;
}

interface CreateBookCopyRequest {
    bookId: string;
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
    size: 9,
    totalElements: 0,
    totalPages: 0,
};

interface BookCopyState {
    copies: PaginationBookCopyResponse;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: BookCopyState = {
    copies: initialPaginationBookCopyResponse,
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
    CreateBookCopyRequest,
    { rejectValue: string }
>("bookCopies/createBookCopy", async (newCopy, thunkAPI) => {
    try {
        await axiosInstance.post(`/resources/book-copy/${newCopy.bookId}/create`, {
            physicalLocation: newCopy.physicalLocation,
            itemReferenceCopy: newCopy.itemReferenceCopy,
        });
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
                console.log(action.payload)
            })
            .addCase(fetchBookCopiesByBookId.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Fetching book copies failed";
            })

            .addCase(createBookCopy.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(createBookCopy.fulfilled, (state, action) => {
                state.status = "succeeded";
                console.log(action.payload)
            })
            .addCase(createBookCopy.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Creating book copy failed";
            })

        ;
    },
});

export default bookCopySlice.reducer;
