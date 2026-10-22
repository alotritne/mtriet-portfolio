import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { NotFoundPage } from './components/NotFoundPage'
import EldoradoCalculator from './pages/EldoradoCalculator'
import './styles/index.css'

const AdminApp = lazy(() => import('./admin/AdminApp').then(module => ({ default: module.AdminApp })))
const BlogPage = lazy(() => import('./blog/BlogPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))

const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
const Root = pathname === '/'
  ? App
  : pathname === '/projects'
    ? ProjectsPage
  : pathname === '/eldorado/cal'
    ? EldoradoCalculator
  : pathname === '/blog' || /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pathname)
    ? BlogPage
  : pathname === '/admin' || pathname.startsWith('/admin/')
    ? AdminApp
    : NotFoundPage
createRoot(document.getElementById('root')!).render(<StrictMode><Suspense fallback={<p className="portfolio-shell" role="status">Đang tải / Loading…</p>}><Root /></Suspense></StrictMode>)
