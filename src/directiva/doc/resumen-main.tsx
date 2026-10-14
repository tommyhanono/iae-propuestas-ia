import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './doc.css'
import Resumen from './Resumen.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Resumen />
  </StrictMode>,
)
