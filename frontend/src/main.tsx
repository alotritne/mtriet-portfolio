import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AdminApp } from './admin/AdminApp'
import { NotFoundPage } from './components/NotFoundPage'
import EldoradoCalculator from './pages/EldoradoCalculator'
import './styles/index.css'

const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
const Root = pathname === '/'
  ? App
  : pathname === '/eldorado/cal'
    ? EldoradoCalculator
  : pathname === '/admin' || pathname.startsWith('/admin/')
    ? AdminApp
    : NotFoundPage
createRoot(document.getElementById('root')!).render(<StrictMode><Root /></StrictMode>)
