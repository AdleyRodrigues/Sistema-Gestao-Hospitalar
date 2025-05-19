import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes';
import { store } from './store';
import { FC, useEffect } from 'react';
import { User } from './types/auth';
import { loginSuccess } from './store/slices/authSlice';

// Componente para inicializar a autenticação
const AuthInitializer: FC = () => {
  useEffect(() => {
    // Verificar se há um token e dados de usuário no localStorage
    const token = localStorage.getItem('@vidaplus:token');
    const userStr = localStorage.getItem('@vidaplus:user');

    if (token && userStr) {
      try {
        // Tentar carregar o usuário do localStorage
        const user = JSON.parse(userStr) as User;
        console.log('Inicializando dados do usuário do localStorage:', user);

        // Atualizar o estado Redux
        store.dispatch(loginSuccess({ user, token }));
      } catch (error) {
        console.error('Erro ao carregar dados do usuário do localStorage:', error);
        // Limpar dados inválidos
        localStorage.removeItem('@vidaplus:token');
        localStorage.removeItem('@vidaplus:user');
      }
    }
  }, []);

  return null;
};

// Memorizar o App para evitar re-renderizações desnecessárias
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthInitializer />
        <Router />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
