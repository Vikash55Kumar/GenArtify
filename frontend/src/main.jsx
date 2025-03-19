import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import store from './store.js'; // Import your Redux store
import { AuthProvider } from './utility/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}> {/* Pass store as a prop */}
    <BrowserRouter>
    <AuthProvider>
        <App />
    </AuthProvider>,
    </BrowserRouter>
  </Provider>
);
