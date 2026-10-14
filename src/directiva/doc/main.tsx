import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './doc.css'
import Doc from './Doc.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Doc />
  </StrictMode>,
)
