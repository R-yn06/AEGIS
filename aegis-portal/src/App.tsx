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
  const [activeView, setActiveView] = React.useState<AppView>('home')

  function openProduct(view: AppView = 'dashboard') {
    setActiveView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (activeView === 'home') {
    return (
      <MarketingLayout onOpenApp={() => openProduct('dashboard')}>
        <React.Suspense fallback={<LoadingScreen />}>
          <LandingPage onOpenApp={() => openProduct('dashboard')} />
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

export default function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </I18nProvider>
  )
}
