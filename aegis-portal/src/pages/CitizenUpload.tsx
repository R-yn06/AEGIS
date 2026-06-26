import React, { useState, FormEvent } from 'react'
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
import { uploadPhoto } from '../api/uploads'

interface ReportSubmissionPayload {
  text: string
  reporterName: string
}

export default function CitizenUpload() {
  const { t } = useI18n()
  const { showToast } = useToast()

  // --- Form State ---
  const [projectId, setProjectId] = useState<string>('')
  const [reporterName, setReporterName] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoData, setPhotoData] = useState<string | null>(null)

  // --- Queries & Mutations ---
  const projectQuery = useProject(projectId)
  const submitReport = useSubmitReport(projectId)
  const selectedProject = projectQuery.data

  // --- Handlers ---
  const clearForm = () => {
    setProjectId('')
    setReporterName('')
    setNotes('')
    setPhotoFile(null)
    setPhotoData(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!projectId || !notes.trim()) return

    try {
      let finalPhotoUrl = ''

      // 1. Upload the photo to S3 first if it exists
      if (photoFile) {
        finalPhotoUrl = await uploadPhoto(photoFile)
      }

      // 2. BACKEND WORKAROUND: Append the image token dynamically to the text body
      // This allows the normalizer layer to correctly extract and attach the photo on the dashboard.
      const submissionText = finalPhotoUrl 
        ? `${notes.trim()}\n\n[IMAGE]:${finalPhotoUrl}` 
        : notes.trim()

      // 3. Fire mutation payload
      await submitReport.mutateAsync({
        text: submissionText,
        reporterName: reporterName.trim() || 'Concerned citizen',
      } as ReportSubmissionPayload)

      showToast(t('upload.successMessage'), 'success')
      clearForm()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit report.'
      showToast(message, 'error')
    }
  }

  return (
    <div className="workspace-page narrow">
      {/* Header section */}
      <header className="workspace-hero">
        <p className="eyebrow">Citizen Reporting</p>
        <h1>{t('upload.title')}</h1>
        <p>{t('upload.description')}</p>
      </header>

      {/* Main split-screen container */}
      <div className="form-layout">
        
        {/* Left: Input Form */}
        <main>
          <Card className="field-report-card">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="project-select">{t('upload.nearbyProject')}</label>
                <ProjectSelect value={projectId} onChange={setProjectId} />
              </div>

              <div className="form-group">
                <label htmlFor="reporter-name">Reporter Name</label>
                <input
                  id="reporter-name"
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="form-control"
                  placeholder="Your name or organization"
                />
              </div>

              <div className="form-group">
                <label>{t('upload.photoEvidence')}</label>
                <CameraButton 
                  onCapture={(file, dataUrl) => {
                    setPhotoFile(file)
                    setPhotoData(dataUrl)
                  }} 
                />
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
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-control"
                  rows={6}
                  placeholder={t('upload.notesPlaceholder')}
                  required
                />
              </div>

              <div className="button-row">
                <Button 
                  type="submit" 
                  disabled={!projectId || !notes.trim() || submitReport.isLoading}
                >
                  {submitReport.isLoading ? 'Submitting...' : t('common.submit')}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={clearForm}
                >
                  {t('common.clear')}
                </Button>
              </div>
            </form>
          </Card>
        </main>

        {/* Right: Informational Sidebar */}
        <aside className="side-stack">
          {/* Active Project Details Card */}
          <Card className="selected-project-card">
            <h2>{t('upload.selectedProject')}</h2>
            {projectQuery.isLoading ? (
              <div className="skeleton-list">
                <span />
                <span />
              </div>
            ) : selectedProject ? (
              <>
                <TrafficLight risk={selectedProject.riskClassification} />
                <h3>{selectedProject.projectTitle}</h3>
                <p>{selectedProject.province}, {selectedProject.region}</p>
                <dl className="metric-grid compact">
                  <div>
                    <dt>{t('dashboard.contractAmount')}</dt>
                    <dd>{shortPeso(selectedProject.budget)}</dd>
                  </div>
                  <div>
                    <dt>{t('dashboard.citizenSignals')}</dt>
                    <dd>{selectedProject.citizenReportCount}</dd>
                  </div>
                </dl>
              </>
            ) : (
              <p>{t('upload.notSelected')}</p>
            )}
          </Card>

          {/* Verification / Submission Snapshot Card */}
          <Card className="submission-preview-card">
            <h2>{t('upload.submissionPreview')}</h2>
            <div className="preview-row">
              <span>{t('upload.selectedProject')}</span>
              <strong>{selectedProject?.contractId ?? t('upload.notSelected')}</strong>
            </div>
            <div className="preview-row">
              <span>{t('upload.photo')}</span>
              <strong>{photoFile ? t('upload.attached') : t('upload.missing')}</strong>
            </div>
            <div className="preview-row">
              <span>{t('upload.notes')}</span>
              <strong>{notes.trim().length} {t('upload.characters')}</strong>
            </div>
          </Card>
        </aside>

      </div>
    </div>
  )
}