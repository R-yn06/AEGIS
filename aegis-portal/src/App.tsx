import React from 'react'
import { I18nProvider } from './contexts/I18nContext'
import { ToastProvider } from './contexts/ToastContext'
import { MarketingLayout } from './layouts/MarketingLayout'
import { ProductLayout } from './layouts/ProductLayout'
import { LoadingScreen } from './components/ui/LoadingScreen'
import type { AppView } from './constants/navigation'

const LandingPage = React.lazy(() => import('./pages/LandingPage'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const CitizenUpload = React.lazy(() => import('./pages/CitizenUpload'))
const SupplierDirectory = React.lazy(() => import('./pages/SupplierDirectory'))

function AppContent() {
  const [activeView, setActiveView] = React.useState<AppView>(() => getViewFromPath())

  React.useEffect(() => {
    function syncRoute() {
      setActiveView(getViewFromPath())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  function openProduct(view: AppView = 'dashboard') {
    const path = getPathFromView(view)
    window.history.pushState({}, '', path)
    setActiveView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (activeView === 'home') {
    return (
      <MarketingLayout onOpenApp={() => openProduct('dashboard')}>
        <React.Suspense fallback={<LoadingScreen />}>
          <LandingPage onOpenApp={() => openProduct('dashboard')} onReportIssue={() => openProduct('upload')} />
        </React.Suspense>
      </MarketingLayout>
    )
  }

  return (
    <ProductLayout activeView={activeView} onNavigate={openProduct}>
      <React.Suspense fallback={<LoadingScreen />}>
        {activeView === 'dashboard' && <Dashboard onUpload={() => openProduct('upload')} />}
        {activeView === 'upload' && <CitizenUpload />}
        {activeView === 'suppliers' && <SupplierDirectory />}
      </React.Suspense>
    </ProductLayout>
  )
}

function getViewFromPath(): AppView {
  const path = window.location.pathname
  if (path.startsWith('/projects')) return 'dashboard'
  if (path.startsWith('/report')) return 'upload'
  if (path.startsWith('/suppliers')) return 'suppliers'
  return 'home'
}

function getPathFromView(view: AppView) {
  if (view === 'dashboard') return '/projects'
  if (view === 'upload') return '/report'
  if (view === 'suppliers') return '/suppliers'
  return '/'
}

export default function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </I18nProvider>
  )
}
