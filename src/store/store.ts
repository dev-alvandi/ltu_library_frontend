import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/auth-slice.ts';
import userReducer from '@/store/user-slice.ts';
import bookReducer from '@/store/book-slice.ts';
import bookCopyReducer from '@/store/book-copy-slice.ts';
import libraryActionsReducer from '@/store/library-actions-slice.tsx';
import {useDispatch, useSelector} from "react-redux";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        book: bookReducer,
        bookCopy: bookCopyReducer,
        libraryActions: libraryActionsReducer
    },
});

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;