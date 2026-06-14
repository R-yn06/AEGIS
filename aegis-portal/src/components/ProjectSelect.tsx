import { useI18n } from '../contexts/I18nContext'
import { projectService } from '../services/projectService'

interface ProjectSelectProps {
  value: string
  onChange: (contractId: string) => void
}

export default function ProjectSelect({ value, onChange }: ProjectSelectProps) {
  const { t } = useI18n()
  const projects = projectService.listProjects()

  return (
    <select
      id="project-select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="form-control"
      required
    >
      <option value="">{t('upload.selectProject')}</option>
      {projects.map((project) => (
        <option key={project.contract_id} value={project.contract_id}>
          {project.location} - {project.project_title}
        </option>
      ))}
    </select>
  )
}
