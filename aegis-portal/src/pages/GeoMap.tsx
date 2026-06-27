import React, { useState, useEffect, useRef } from 'react'
import { useProjects } from '../hooks/useProjects' 
import { useI18n } from '../contexts/I18nContext'
import type { AppView } from '../constants/navigation'

type GeoMapProps = {
  onNavigate: (view: AppView, projectId?: string) => void
}

const RISK_COLORS: Record<string, string> = {
  Low: '#22c55e',
  Medium: '#f59e0b',
  High: '#ef4444',
  Critical: '#b91c1c',
}

// Global cache outside component tree memory lifecycle guarantees persistence across view unmounts
const MAP_CACHE = {
  center: [12.8797, 121.7740] as [number, number],
  zoom: 6,
  mode: 'streets' as 'streets' | 'satellite'
}

export default function GeoMap({ onNavigate }: GeoMapProps) {
  const { t } = useI18n()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const activeTileLayerRef = useRef<any>(null)

  // Load baseline values from global application context cache directly
  const [mapMode, setMapMode] = useState<'streets' | 'satellite'>(MAP_CACHE.mode)

  const { data: projectsData, isLoading, error } = useProjects()

  const projectsArray = projectsData?.projects && Array.isArray(projectsData.projects)
    ? projectsData.projects
    : []

  const mappable = projectsArray.filter(
    (p: any) => p.latitude && p.longitude
  )
  const noCoords = projectsArray.filter(
    (p: any) => !p.latitude || !p.longitude
  )

  // 1. Initial Leaflet Map Instantiation (Runs strictly once on view mount)
  useEffect(() => {
    if (!document.getElementById('leaflet-base-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-base-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    if (isLoading || error || !mapRef.current || mapInstanceRef.current) return

    let isMounted = true

    import('leaflet').then((L) => {
      if (!isMounted || !mapRef.current || mapInstanceRef.current) return

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const philippineBounds = L.latLngBounds(
        L.latLng(4.5, 114.5),  
        L.latLng(21.5, 127.0)  
      )

      // Instantiates map using exactly where the user last left off in cache memory
      const map = L.map(mapRef.current, {
        center: MAP_CACHE.center, 
        zoom: MAP_CACHE.zoom,
        minZoom: 6,           
        maxZoom: 19,          
        maxBounds: philippineBounds, 
        maxBoundsViscosity: 1.0,     
        zoomControl: true,
      })

      mapInstanceRef.current = map

      // Intercept movement instantly to stream data straight into memory storage
      const storeViewState = () => {
        const center = map.getCenter()
        MAP_CACHE.center = [center.lat, center.lng]
        MAP_CACHE.zoom = map.getZoom()
      }

      map.on('moveend', storeViewState)
      map.on('zoomend', storeViewState)

      // Initialize default background layer based on active setting
      let initialLayer;
      if (MAP_CACHE.mode === 'streets') {
        initialLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        })
      } else {
        initialLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles © Esri',
          maxZoom: 19
        })
      }
      initialLayer.addTo(map)
      activeTileLayerRef.current = initialLayer

      // Plot data markers
      mappable.forEach((project: any) => {
        const classification = project.riskClassification || 'Unknown'
        const color = RISK_COLORS[classification] ?? '#6b7280'

        const markerHtml = `
          <div style="
            width: 14px; height: 14px;
            border-radius: 50%;
            background: ${color};
            border: 2.5px solid #fff;
            box-shadow: 0 0 0 2px ${color}55, 0 2px 6px rgba(0,0,0,0.4);
          "></div>
        `

        const icon = L.divIcon({
          html: markerHtml,
          className: '',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          popupAnchor: [0, -10],
        })

        const popupContent = `
          <div style="font-family: Arial, sans-serif; min-width: 220px; max-width: 280px; color: #374151;">
            <div style="
              display: inline-block;
              padding: 2px 8px;
              border-radius: 999px;
              background: ${color}22;
              color: ${color};
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.05em;
              margin-bottom: 6px;
              border: 1px solid ${color}44;
            ">${classification.toUpperCase()} RISK</div>
            <div style="font-size: 11px; color: #6b7280; margin-bottom: 2px;">${project.contractId}</div>
            <div style="font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 6px; line-height: 1.4;">${project.projectTitle}</div>
            <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">📍 ${project.province || 'Unspecified'}</div>
            <div style="font-size: 12px; color: #374151; margin-bottom: 8px;">
              <strong>₱${((project.budget || 0) / 1_000_000).toFixed(2)}M</strong> budget
              &nbsp;·&nbsp;
              <span style="color: #22c55e; font-weight: 600;">
                ${(project.progress || 0).toFixed(1)}% complete
              </span>
            </div>
            <button
              onclick="window.aegisNavigateToDashboard && window.aegisNavigateToDashboard('${project.contractId}')"
              style="
                width: 100%;
                padding: 6px 0;
                background: #0f172a;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                letter-spacing: 0.03em;
              "
            >View in Dashboard →</button>
          </div>
        `

        L.marker([project.latitude, project.longitude], { icon })
          .addTo(map)
          .bindPopup(popupContent, { maxWidth: 300 })
      })
    })

    return () => {
      isMounted = false
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isLoading, error])

  // 2. Map Toggle Execution Layer
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    MAP_CACHE.mode = mapMode

    import('leaflet').then((L) => {
      if (activeTileLayerRef.current) {
        map.removeLayer(activeTileLayerRef.current)
      }

      let newLayer;
      if (mapMode === 'streets') {
        newLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        })
      } else {
        newLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles © Esri — Satellite View',
          maxZoom: 19
        })
      }

      newLayer.addTo(map)
      activeTileLayerRef.current = newLayer
    })
  }, [mapMode])

  useEffect(() => {
    ;(window as any).aegisNavigateToDashboard = (contractId: string) => {
      onNavigate('dashboard', contractId)
    }
    return () => {
      delete (window as any).aegisNavigateToDashboard
    }
  }, [onNavigate])

  if (isLoading) return <div className="workspace-page" style={{ color: '#f3f4f6' }}><div className="workspace-hero"><h1>Loading mapping data...</h1></div></div>
  if (error) return <div className="workspace-page" style={{ color: '#f3f4f6' }}><div className="workspace-hero"><h1>Error loading projects map.</h1></div></div>

  return (
    <div className="workspace-page" style={{ color: '#f3f4f6', padding: '1rem' }}>
      <div className="workspace-hero" style={{ marginBottom: '2rem' }}>
        <p className="eyebrow" style={{ color: '#fbbf24', textTransform: 'uppercase', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em' }}>Geospatial intelligence</p>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginTop: '0.25rem', marginBottom: '0.5rem' }}>Project location map</h1>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Overview of tracked infrastructure projects with localized risk overlays.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {Object.entries(RISK_COLORS).map(([level, color]) => (
            <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#9ca3af' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, border: '2px solid #111827', boxShadow: `0 0 0 1.5px ${color}` }} />
              {level} Risk
            </div>
          ))}
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            {mappable.length} mapped · {noCoords.length} without coordinates
          </div>
        </div>

        <div style={{ display: 'flex', background: '#1e293b', padding: '4px', borderRadius: '8px', border: '1px solid #334155' }}>
          <button 
            type="button"
            onClick={() => setMapMode('streets')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              background: mapMode === 'streets' ? '#0f172a' : 'transparent',
              color: mapMode === 'streets' ? '#fff' : '#9ca3af',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Vector Street Map
          </button>
          <button 
            type="button"
            onClick={() => setMapMode('satellite')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              background: mapMode === 'satellite' ? '#0f172a' : 'transparent',
              color: mapMode === 'satellite' ? '#fff' : '#9ca3af',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Satellite View (2026)
          </button>
        </div>
      </div>

      <div className="relative" style={{ position: 'relative', marginBottom: '2.5rem' }}>
        <div
          ref={mapRef}
          className="relative z-0"
          style={{
            height: '540px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #374151',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            background: '#e5e7eb',
            zIndex: 0
          }}
        />
      </div>

      {noCoords.length > 0 && (
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '0.5rem', color: '#e5e7eb' }}>
            Projects without coordinates
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '1.5rem' }}>
            These projects couldn't be plotted due to unspecified location geo-coordinates.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1rem' 
          }}>
            {noCoords.map((project: any) => {
              const cardRisk = project.riskClassification || 'Unknown'
              const cardColor = RISK_COLORS[cardRisk] ?? '#6b7280'
              
              return (
                <button
                  key={project.contractId}
                  type="button"
                  className="project-card"
                  onClick={() => onNavigate('dashboard', project.contractId)}
                  style={{ width: '100%', textAlign: 'left', display: 'block' }}
                >
                  <div className="project-card-header">
                    <span>{project.contractId}</span>
                    <div style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: `${cardColor}22`,
                      color: cardColor,
                      fontSize: '11px',
                      fontWeight: 700,
                      border: `1px solid ${cardColor}44`
                    }}>
                      {cardRisk}
                    </div>
                  </div>

                  <h3>{project.projectTitle}</h3>
                  <p>{project.province}{project.region ? `, ${project.region}` : ''}</p>
                  
                  <div className="project-card-meta">
                    <span>₱{((project.budget || 0) / 1_000_000).toFixed(2)}M</span>
                    <span>{(project.progress || 0).toFixed(1)}%</span>
                    <span>{project.citizenReportCount || 0} alerts</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}