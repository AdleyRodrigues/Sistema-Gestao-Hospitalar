import { authSlice, loginStart, loginSuccess, loginFailure, logout } from '../../store/slices/authSlice';
import { User } from '../../types/auth';

describe('authSlice', () => {
    const initialState = {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null
    };

    it('should handle initial state', () => {
        expect(authSlice.reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle loginStart', () => {
        const actual = authSlice.reducer(initialState, loginStart());
        expect(actual.loading).toEqual(true);
        expect(actual.error).toEqual(null);
    });

    it('should handle loginSuccess', () => {
        const user: User = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'admin',
            avatar: 'avatar.png'
        };

        const actual = authSlice.reducer(initialState, loginSuccess({
            user,
            token: 'test-token'
        }));

        expect(actual.isAuthenticated).toEqual(true);
        expect(actual.user).toEqual(user);
        expect(actual.token).toEqual('test-token');
        expect(actual.loading).toEqual(false);
        expect(actual.error).toEqual(null);
    });

    it('should handle loginFailure', () => {
        const errorMessage = 'Authentication failed';
        const actual = authSlice.reducer(initialState, loginFailure(errorMessage));

        expect(actual.loading).toEqual(false);
        expect(actual.error).toEqual(errorMessage);
        expect(actual.isAuthenticated).toEqual(false);
    });

    it('should handle logout', () => {
        // Primeiro, vamos criar um estado autenticado
        const loggedInState = {
            isAuthenticated: true,
            user: {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                role: 'admin',
                avatar: 'avatar.png'
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