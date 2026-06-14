import React from 'react'
import MaterialCard from '../components/MaterialCard'
import { Card } from '../components/ui/Card'
import { Icon } from '../components/ui/Icons'
import { useI18n } from '../contexts/I18nContext'
import { projectService } from '../services/projectService'

const materialFilters = ['All', 'cement', 'steel', 'pavement', 'earthworks'] as const
type MaterialFilter = (typeof materialFilters)[number]

export default function SupplierDirectory() {
  const { t } = useI18n()
  const [filter, setFilter] = React.useState<MaterialFilter>('All')
  const [query, setQuery] = React.useState('')
  const projects = projectService.listProjects()

  const materials = projects.flatMap((project) =>
    project.bill_of_quantities_materials.map((material) => ({
      ...material,
      project_title: project.project_title,
      location: project.location,
    })),
  )

  const filtered = materials.filter((material) => {
    const text = `${material.description} ${material.item_code} ${material.project_title} ${material.location}`.toLowerCase()
    const description = material.description.toLowerCase()
    const matchesQuery = text.includes(query.toLowerCase())
    const matchesFilter =
      filter === 'All' ||
      (filter === 'cement' && description.includes('cement')) ||
      (filter === 'steel' && description.includes('steel')) ||
      (filter === 'pavement' && description.includes('pavement')) ||
      (filter === 'earthworks' && (description.includes('excavation') || description.includes('embankment')))

    return matchesQuery && matchesFilter
  })

  const averageDeviation = materials.reduce((sum, material) => sum + Math.abs(material.item_deviation_percent), 0) / Math.max(materials.length, 1)
  const flaggedCount = materials.filter((material) => Math.abs(material.item_deviation_percent) >= 20).length

  return (
    <div className="workspace-page">
      <div className="workspace-hero">
        <p className="eyebrow">{t('navigation.suppliers')}</p>
        <h1>{t('suppliers.title')}</h1>
        <p>{t('suppliers.description')}</p>
      </div>

      <div className="metrics-row">
        <Card className="metric-card"><span>{t('suppliers.materialLines')}</span><strong>{materials.length}</strong></Card>
        <Card className="metric-card"><span>{t('suppliers.averageVariance')}</span><strong>{averageDeviation.toFixed(1)}%</strong></Card>
        <Card className="metric-card"><span>{t('suppliers.flaggedItems')}</span><strong>{flaggedCount}</strong></Card>
      </div>

      <Card className="filter-card">
        <label htmlFor="material-search">{t('suppliers.searchLabel')}</label>
        <div className="search-control">
          <Icon name="search" />
          <input id="material-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('suppliers.searchPlaceholder')} />
        </div>
        <div className="filter-row">
          {materialFilters.map((item) => (
            <button key={item} type="button" className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>
              {item === 'All' ? t('common.all') : t(`suppliers.filters.${item}`)}
            </button>
          ))}
        </div>
      </Card>

      <section className="material-grid">
        {filtered.length === 0 ? (
          <Card className="empty-state">{t('common.empty')}</Card>
        ) : (
          filtered.map((material) => <MaterialCard key={`${material.project_title}-${material.item_code}`} material={material} />)
        )}
      </section>
    </div>
  )
}
