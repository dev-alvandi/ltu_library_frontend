import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/authSlice.ts';
import userReducer from '@/store/userSlice.ts';
import bookReducer from '@/store/bookSlice.ts';
import bookCopyReducer from '@/store/bookCopySlice.ts';
import libraryActionsReducer from '@/store/libraryActionsSlice';
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