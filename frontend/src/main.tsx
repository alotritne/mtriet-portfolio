import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AdminApp } from './admin/AdminApp'
import './styles/index.css'

const Root = window.location.pathname.startsWith('/admin') ? AdminApp : App
createRoot(document.getElementById('root')!).render(<StrictMode><Root /></StrictMode>)
