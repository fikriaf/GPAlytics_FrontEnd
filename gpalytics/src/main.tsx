import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalLoader from "./components/GlobalLoader";

const removeGlobalLoader = () => {
  const loader = document.getElementById('global-loader')
  if (loader) {
    loader.style.opacity = '0'
    setTimeout(() => loader.remove(), 300)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalLoader />
    <App />
  </StrictMode>,
)

removeGlobalLoader()