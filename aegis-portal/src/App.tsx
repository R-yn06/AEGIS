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
const GeoMap = React.lazy(() => import('./pages/GeoMap'))

function AppContent() {
  const [activeView, setActiveView] = React.useState<AppView>(() => getViewFromPath())
  
  // Create shared state for the active project
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>('')

  React.useEffect(() => {
    function syncRoute() {
      setActiveView(getViewFromPath())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  // Extend openProduct to allow passing a target project ID
  function openProduct(view: AppView = 'dashboard', projectId?: string) {
    const path = getPathFromView(view)
    window.history.pushState({}, '', path)
    setActiveView(view)
    
    if (projectId) {
      setSelectedProjectId(projectId)
    }
    
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
        {/* Pass state and updater functions into the Dashboard */}
        {activeView === 'dashboard' && (
          <Dashboard 
            onUpload={() => openProduct('upload')} 
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
          />
        )}
        {activeView === 'upload' && <CitizenUpload />}
        {activeView === 'suppliers' && <SupplierDirectory />}
        {/* Pass the expanded openProduct navigator to the GeoMap */}
        {activeView === 'geomap' && <GeoMap onNavigate={openProduct} />}
      </React.Suspense>
    </ProductLayout>
  )
}

function getViewFromPath(): AppView {
  const path = window.location.pathname
  if (path.startsWith('/projects')) return 'dashboard'
  if (path.startsWith('/report')) return 'upload'
  if (path.startsWith('/suppliers')) return 'suppliers'
  if (path.startsWith('/map')) return 'geomap'
  return 'home'
}

function getPathFromView(view: AppView) {
  if (view === 'dashboard') return '/projects'
  if (view === 'upload') return '/report'
  if (view === 'suppliers') return '/suppliers'
  if (view === 'geomap') return '/map'
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