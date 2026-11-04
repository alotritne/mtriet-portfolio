import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { NotFoundPage } from './components/NotFoundPage'
import EldoradoCalculator from './pages/EldoradoCalculator'
import { motionIsEnabled } from './hooks/useMotionPreference'

document.documentElement.dataset.motion = motionIsEnabled() ? 'on' : 'off'

const AdminApp = lazy(() => import('./admin/AdminApp').then(module => ({ default: module.AdminApp })))
const BlogPage = lazy(() => import('./blog/BlogPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const App = lazy(() => import('./App'))

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
// The reference portfolio owns the home page's visual system. Legacy styles are
// loaded only for the other routes so they cannot leak into its layout.
async function renderApp() {
  if (pathname === '/projects' || pathname === '/blog' || pathname.startsWith('/blog/')) {
    await import('./portfolio/styles.css')
    await import('./portfolio/catalog.css')
  } else if (pathname !== '/') {
    await import('./styles/index.css')
    await import('./styles/liveMotion.css')
    await import('./styles/portfolioRework.css')
    await import('./styles/portfolioUnified.css')
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Suspense fallback={<p role="status">Đang tải / Loading…</p>}><Root /></Suspense>
    </StrictMode>,
  )
}

void renderApp()
