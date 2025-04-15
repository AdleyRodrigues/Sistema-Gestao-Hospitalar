import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes';
import { store } from './store';

// Memorizar o App para evitar re-renderizações desnecessárias
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
