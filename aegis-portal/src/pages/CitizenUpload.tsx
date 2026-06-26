import React from 'react'
import CameraButton from '../components/CameraButton'
import ProjectSelect from '../components/ProjectSelect'
import TrafficLight from '../components/TrafficLight'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useI18n } from '../contexts/I18nContext'
import { useToast } from '../contexts/ToastContext'
import { useProject } from '../hooks/useProject'
import { useSubmitReport } from '../hooks/useReports'
import { shortPeso } from '../utils/formatters'

export default function CitizenUpload() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const [projectId, setProjectId] = React.useState('')
  const [reporterName, setReporterName] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [photoFile, setPhotoFile] = React.useState<File | null>(null)
  const [photoData, setPhotoData] = React.useState<string | null>(null)
  const projectQuery = useProject(projectId)
  const submitReport = useSubmitReport(projectId)
  const selectedProject = projectQuery.data

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    try {
      await submitReport.mutateAsync({
        text: notes,
        reporterName: reporterName.trim() || 'Concerned citizen',
        photo: photoFile,
      })
      showToast(t('upload.successMessage'), 'success')
      clearForm()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit report.'
      showToast(message, 'error')
    }
  }

  function clearForm() {
    setProjectId('')
    setReporterName('')
    setNotes('')
    setPhotoFile(null)
    setPhotoData(null)
  }

  return (
    <div className="workspace-page narrow">
      <div className="workspace-hero">
        <p className="eyebrow">Citizen Reporting</p>
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
              <label htmlFor="reporter-name">Reporter Name</label>
              <input
                id="reporter-name"
                value={reporterName}
                onChange={(event) => setReporterName(event.target.value)}
                className="form-control"
                placeholder="Your name or organization"
              />
            </div>

            <div className="form-group">
              <label>{t('upload.photoEvidence')}</label>
              <CameraButton onCapture={(file, dataUrl) => {
                setPhotoFile(file)
                setPhotoData(dataUrl)
              }} />
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
              <Button type="submit" disabled={!projectId || !notes.trim() || submitReport.isLoading}>
                {submitReport.isLoading ? 'Submitting...' : t('common.submit')}
              </Button>
              <Button type="button" variant="secondary" onClick={clearForm}>{t('common.clear')}</Button>
            </div>
          </form>
        </Card>

        <aside className="side-stack">
          <Card className="selected-project-card">
            <h2>{t('upload.selectedProject')}</h2>
            {projectQuery.isLoading ? (
              <div className="skeleton-list"><span /><span /></div>
            ) : selectedProject ? (
              <>
                <TrafficLight risk={selectedProject.riskClassification} />
                <h3>{selectedProject.projectTitle}</h3>
                <p>{selectedProject.province}, {selectedProject.region}</p>
                <dl className="metric-grid compact">
                  <div><dt>{t('dashboard.contractAmount')}</dt><dd>{shortPeso(selectedProject.budget)}</dd></div>
                  <div><dt>{t('dashboard.citizenSignals')}</dt><dd>{selectedProject.citizenReportCount}</dd></div>
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
              <strong>{selectedProject?.contractId ?? t('upload.notSelected')}</strong>
            </div>
            <div>
              <span>{t('upload.photo')}</span>
              <strong>{photoFile ? t('upload.attached') : t('upload.missing')}</strong>
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
