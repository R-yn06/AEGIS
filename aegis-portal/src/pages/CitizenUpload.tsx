import React from 'react'
import CameraButton from '../components/CameraButton'
import ProjectSelect from '../components/ProjectSelect'
import TrafficLight from '../components/TrafficLight'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useI18n } from '../contexts/I18nContext'
import { useToast } from '../contexts/ToastContext'
import { projectService } from '../services/projectService'
import { shortPeso } from '../utils/formatters'

export default function CitizenUpload() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const [projectId, setProjectId] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [photoData, setPhotoData] = React.useState<string | null>(null)

  const selectedProject = projectService.getProjectById(projectId)

  function submit(event: React.FormEvent) {
    event.preventDefault()
    showToast(t('upload.successMessage'), 'success')
  }

  function clearForm() {
    setProjectId('')
    setNotes('')
    setPhotoData(null)
  }

  return (
    <div className="workspace-page narrow">
      <div className="workspace-hero">
        <p className="eyebrow">{t('navigation.upload')}</p>
        <h1>{t('upload.title')}</h1>
        <p>{t('upload.description')}</p>
      </div>

      <div className="form-layout">
        <Card className="field-report-card">
          <form onSubmit={submit}>
            <div className="form-group">
              <label htmlFor="project-select">{t('upload.nearbyProject')}</label>
              <ProjectSelect value={projectId} onChange={setProjectId} />
            </div>

            <div className="form-group">
              <label>{t('upload.photoEvidence')}</label>
              <CameraButton onCapture={setPhotoData} />
              {photoData && (
                <div className="photo-preview">
                  <img src={photoData} alt={t('upload.photoEvidence')} />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="notes">{t('upload.notes')}</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="form-control"
                rows={6}
                placeholder={t('upload.notesPlaceholder')}
                required
              />
            </div>

            <div className="button-row">
              <Button type="submit">{t('common.submit')}</Button>
              <Button type="button" variant="secondary" onClick={clearForm}>{t('common.clear')}</Button>
            </div>
          </form>
        </Card>

        <aside className="side-stack">
          <Card className="selected-project-card">
            <h2>{t('upload.selectedProject')}</h2>
            {selectedProject ? (
              <>
                <TrafficLight risk={selectedProject.risk_classification} />
                <h3>{selectedProject.project_title}</h3>
                <p>{selectedProject.location}</p>
                <dl className="metric-grid compact">
                  <div><dt>{t('dashboard.contractAmount')}</dt><dd>{shortPeso(selectedProject.contract_amount)}</dd></div>
                  <div><dt>{t('dashboard.citizenSignals')}</dt><dd>{selectedProject.citizen_upload_count}</dd></div>
                </dl>
              </>
            ) : (
              <p>{t('upload.notSelected')}</p>
            )}
          </Card>

          <Card className="submission-preview-card">
            <h2>{t('upload.submissionPreview')}</h2>
            <div>
              <span>{t('upload.selectedProject')}</span>
              <strong>{selectedProject?.contract_id ?? t('upload.notSelected')}</strong>
            </div>
            <div>
              <span>{t('upload.photo')}</span>
              <strong>{photoData ? t('upload.attached') : t('upload.missing')}</strong>
            </div>
            <div>
              <span>{t('upload.notes')}</span>
              <strong>{notes.length} {t('upload.characters')}</strong>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
