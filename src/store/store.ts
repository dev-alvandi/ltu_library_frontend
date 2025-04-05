import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Authentication/authSlice';
import {useDispatch, useSelector} from "react-redux";

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;