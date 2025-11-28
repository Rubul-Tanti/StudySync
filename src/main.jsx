import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
 import store from'./Redux/store.js'
import { Provider } from 'react-redux'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
    <Provider store={store}>
        <App />
    </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
