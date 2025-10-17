import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import 'flowbite';
import { AuthProvider } from './components/Context/Auth.jsx';
import { ItemContextProvider } from './components/Context/Item.jsx';
createRoot(document.getElementById('root')).render(
  <ItemContextProvider>
    <AuthProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </AuthProvider>
  </ItemContextProvider>
)
