import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx'
import { MoveraMotionProvider } from './shared/motion/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MoveraMotionProvider>
      <App />
    </MoveraMotionProvider>
  </StrictMode>,
)
