import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define o estado inicial
const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null
};

// Cria o slice de autenticação
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{ user: any; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            return initialState;
        }
    }
});

// Exporta ações e reducer
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;

// Teste do slice de autenticação
describe('authSlice', () => {
    it('should handle initial state', () => {
        expect(authSlice.reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle loginStart', () => {
        const actual = authSlice.reducer(initialState, loginStart());
        expect(actual.loading).toEqual(true);
        expect(actual.error).toEqual(null);
    });

    it('should handle loginSuccess', () => {
        const user = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'admin'
        };

        const actual = authSlice.reducer(initialState, loginSuccess({
            user,
            token: 'test-token'
        }));

        expect(actual.loading).toEqual(false);
        expect(actual.user).toEqual(user);
        expect(actual.token).toEqual('test-token');
        expect(actual.error).toEqual(null);
    });

    it('should handle loginFailure', () => {
        const errorMessage = 'Authentication failed';
        const actual = authSlice.reducer(initialState, loginFailure(errorMessage));

        expect(actual.loading).toEqual(false);
        expect(actual.error).toEqual(errorMessage);
        expect(actual.user).toEqual(null);
        expect(actual.token).toEqual(null);
    });

    it('should handle logout', () => {
        const loggedInState = {
            user: {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                role: 'admin'
            },
            token: 'test-token',
            loading: false,
            error: null
        };

        // Agora aplicamos a ação logout
        const actual = authSlice.reducer(loggedInState, logout());

        // Verificamos se retornou ao estado inicial
        expect(actual).toEqual(initialState);
    });
}); 