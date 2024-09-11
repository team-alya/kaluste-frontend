import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ImageUploadPage from './components/ImageUploadPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ImageUploadPage />
  </StrictMode>,
)
