import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import CitizenUpload from './pages/CitizenUpload'
import SupplierDirectory from './pages/SupplierDirectory'
import './styles/tailwind.css'

const RouterLink: React.ComponentType<any> = Link as unknown as React.ComponentType<any>

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <nav className="max-w-4xl mx-auto p-4 flex gap-3">
          <RouterLink to="/" className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800">Dashboard</RouterLink>
          <RouterLink to="/upload" className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800">Citizen Upload</RouterLink>
          <RouterLink to="/suppliers" className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800">Supplier Directory</RouterLink>
        </nav>

        <main className="max-w-4xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<CitizenUpload />} />
            <Route path="/suppliers" element={<SupplierDirectory />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}