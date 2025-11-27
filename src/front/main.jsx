import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // Global styles for your application
import { RouterProvider } from "react-router-dom";  // Import RouterProvider to use the router
import { router } from "./routes";  // Import the router configuration
import { StoreProvider } from './hooks/useGlobalReducer';  // Import the StoreProvider for global state management
import { BackendURL } from './components/BackendURL';

const Main = () => {
    
    // Allow empty VITE_BACKEND_URL during development (we use Vite proxy or relative paths).
    // Only show the BackendURL helper when in production and the variable is missing.
    const backendUrlMissing = !import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL === "";
    if (backendUrlMissing && !import.meta.env.DEV) return (
        <React.StrictMode>
              <BackendURL/ >
        </React.StrictMode>
    );
    return (
        <React.StrictMode>  
            {/* Provide global state to all components */}
            <StoreProvider> 
                {/* Set up routing for the application */} 
                <RouterProvider router={router}>
                </RouterProvider>
            </StoreProvider>
        </React.StrictMode>
    );
}

// Render the Main component into the root DOM element.
ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
