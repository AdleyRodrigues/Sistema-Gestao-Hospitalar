import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types/auth';

// Tente obter o usuário do localStorage
const getUserFromLocalStorage = (): User | null => {
    const userString = localStorage.getItem('@vidaplus:user');
    if (!userString) return null;
    try {
        return JSON.parse(userString);
    } catch (error) {
        localStorage.removeItem('@vidaplus:user');
        return null;
    }
};

const initialState: AuthState = {
    user: getUserFromLocalStorage(),
    token: localStorage.getItem('@vidaplus:token'),
    isAuthenticated: !!localStorage.getItem('@vidaplus:token'),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            localStorage.setItem('@vidaplus:token', action.payload.token);
            localStorage.setItem('@vidaplus:user', JSON.stringify(action.payload.user));
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('@vidaplus:token');
            localStorage.removeItem('@vidaplus:user');
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer; 